import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { EmailService } from "./services/emailService";
import { VoiceService } from "./services/voiceService";

const emailService = new EmailService();
const voiceService = new VoiceService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Email scanning and management
  app.post("/api/emails/scan", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const senders = await emailService.scanUserEmails(userId);
      
      // Save discovered senders to database
      for (const sender of senders) {
        await storage.createEmailSender({
          id: crypto.randomUUID(),
          userId,
          email: sender.email,
          domain: sender.domain,
          name: sender.name || '',
          category: 'unassigned',
          emailCount: sender.count,
          latestSubject: sender.latestSubject,
          latestPreview: sender.latestPreview,
          lastEmailDate: new Date(sender.latestDate),
        });
      }
      
      res.json({ senders, count: senders.length });
    } catch (error) {
      res.status(500).json({ 
        message: error.message,
        requiresSetup: error.message.includes('not configured') 
      });
    }
  });

  app.get("/api/emails/senders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const senders = await storage.getEmailSenders(userId);
      res.json(senders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email senders" });
    }
  });

  app.put("/api/emails/senders/:id/category", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { category } = req.body;
      await storage.updateEmailSenderCategory(id, category);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update sender category" });
    }
  });

  // User preferences
  app.get("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category, action } = req.body;
      
      const preference = await storage.upsertUserPreference({
        id: crypto.randomUUID(),
        userId,
        category,
        action,
      });
      
      res.json(preference);
    } catch (error) {
      res.status(500).json({ message: "Failed to save preference" });
    }
  });

  // Voice calls
  app.post("/api/calls/outbound", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, callType, emailCount } = req.body;
      
      const result = await voiceService.makeOutboundCall(userId, phoneNumber, callType, emailCount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        message: error.message,
        requiresSetup: error.message.includes('not configured')
      });
    }
  });

  app.get("/api/calls/logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await voiceService.getCallLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call logs" });
    }
  });

  // OAuth setup endpoints
  app.get("/api/oauth/gmail/url", isAuthenticated, async (req: any, res) => {
    try {
      const authUrl = await emailService.getGmailAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ 
        message: error.message,
        requiresSetup: error.message.includes('not configured')
      });
    }
  });

  // Test endpoint to check API setup
  app.get("/api/setup/status", isAuthenticated, async (req: any, res) => {
    const status = {
      gmail: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      twilio: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_PHONE_NUMBER,
      openai: !!process.env.OPENAI_API_KEY,
      sendgrid: !!process.env.SENDGRID_API_KEY,
    };
    
    res.json({
      configured: status,
      ready: status.gmail && status.twilio && status.openai,
      missing: Object.entries(status)
        .filter(([_, configured]) => !configured)
        .map(([service]) => service)
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
