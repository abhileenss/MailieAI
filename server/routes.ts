import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { VoiceService } from "./services/voiceService";
import { GmailService } from "./services/gmailService";
import { EmailCategorizationService } from "./services/emailCategorizationService";

const voiceService = new VoiceService();
const gmailService = new GmailService();
const categorizationService = new EmailCategorizationService();

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

  // Gmail OAuth Integration Routes
  app.get("/api/gmail/auth", isAuthenticated, async (req: any, res) => {
    try {
      const authUrl = gmailService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating Gmail auth URL:', error);
      res.status(500).json({ message: 'Failed to generate authentication URL' });
    }
  });

  app.get("/api/auth/gmail/callback", async (req, res) => {
    try {
      const { code, error: oauthError } = req.query;
      
      console.log('Gmail OAuth callback received:', { code: !!code, error: oauthError });
      
      if (oauthError) {
        console.error('OAuth error:', oauthError);
        return res.redirect('/scanning?error=oauth_denied');
      }
      
      if (!code) {
        console.error('No authorization code provided');
        return res.redirect('/scanning?error=no_code');
      }

      const tokens = await gmailService.getAccessToken(code as string);
      console.log('Gmail tokens received:', { hasAccessToken: !!tokens.access_token });
      
      // Store tokens in database with authenticated user
      const user = req.user as any;
      if (user?.claims?.sub) {
        await storage.upsertUserToken({
          id: `gmail_${user.claims.sub}`,
          userId: user.claims.sub,
          provider: 'gmail',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          scope: tokens.scope
        });
        console.log('Gmail tokens stored for user:', user.claims.sub);
      }

      // Redirect to scanning page with success parameter
      res.redirect('/scanning?gmail=connected');
    } catch (error) {
      console.error('Error handling Gmail callback:', error);
      res.redirect('/scanning?error=auth_failed');
    }
  });

  // Email Management Routes
  app.post("/api/emails/scan", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get emails from Gmail
      const messages = await gmailService.getMessages(userId, 100);
      
      // Group by senders
      const senders = await gmailService.getEmailSendersByDomain(userId);
      
      // Store senders in database
      await gmailService.storeEmailSenders(userId, senders);
      
      res.json({ 
        message: 'Email scan completed',
        sendersFound: senders.length,
        emailsProcessed: messages.length
      });
    } catch (error) {
      console.error('Error scanning emails:', error);
      res.status(500).json({ message: 'Failed to scan emails' });
    }
  });

  app.get("/api/emails/senders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const senders = await storage.getEmailSenders(userId);
      res.json(senders);
    } catch (error) {
      console.error('Error fetching email senders:', error);
      res.status(500).json({ message: 'Failed to fetch email senders' });
    }
  });

  app.post("/api/emails/categorize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { senderId, category } = req.body;
      
      if (!senderId || !category) {
        return res.status(400).json({ message: 'Sender ID and category are required' });
      }
      
      await storage.updateEmailSenderCategory(senderId, category);
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      console.error('Error updating email category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.post("/api/emails/ai-categorize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get recent emails
      const messages = await gmailService.getMessages(userId, 50);
      
      // Use AI to categorize
      const categorizations = await categorizationService.categorizeEmails(messages);
      
      // Update database with AI recommendations
      // This would require extending the schema to store AI categorizations
      
      res.json({ 
        message: 'AI categorization completed',
        categorizations: Array.from(categorizations.entries())
      });
    } catch (error) {
      console.error('Error with AI categorization:', error);
      res.status(500).json({ message: 'Failed to categorize emails with AI' });
    }
  });

  // Voice Call Integration Routes
  app.post("/api/calls/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { phoneNumber, time, callType } = req.body;
      
      // Store call preference
      await storage.upsertUserPreference({
        id: `call_${userId}`,
        userId,
        category: 'voice_calls',
        action: JSON.stringify({ phoneNumber, time, callType })
      });
      
      res.json({ message: 'Call schedule updated successfully' });
    } catch (error) {
      console.error('Error scheduling call:', error);
      res.status(500).json({ message: 'Failed to schedule call' });
    }
  });

  app.post("/api/calls/daily-digest", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get categorized emails
      const messages = await gmailService.getMessages(userId, 50);
      const categorizations = await categorizationService.categorizeEmails(messages);
      
      // Generate call script
      const script = await categorizationService.generateCallScript(categorizations, {});
      
      // Get user's phone number
      const user = await storage.getUser(userId);
      if (!user?.phone) {
        return res.status(400).json({ message: 'Phone number not configured' });
      }
      
      // Make the call
      const callResult = await voiceService.makeOutboundCall(userId, user.phone, 'digest', messages.length);
      
      res.json({ 
        message: 'Daily digest call initiated',
        callSid: callResult.sid,
        script
      });
    } catch (error) {
      console.error('Error with daily digest call:', error);
      res.status(500).json({ message: 'Failed to initiate daily digest call' });
    }
  });

  // Test endpoint for Twilio voice calls
  app.post("/api/test/voice-call", async (req, res) => {
    try {
      const { phoneNumber, callType = 'test', emailCount = 5 } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      // Direct Twilio call without database logging for testing
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        return res.status(400).json({ message: 'Twilio credentials not configured' });
      }

      const twilioLib = await import('twilio');
      const twilio = twilioLib.default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Generate test script
      const script = "Hello! This is your PookAi assistant calling to test the voice service. You have 7 emails in your queue. The system is working correctly!";
      
      // Create TwiML
      const VoiceResponse = twilio.twiml.VoiceResponse;
      const response = new VoiceResponse();
      response.say({ voice: 'Polly.Joanna' }, script);
      response.say({ voice: 'Polly.Joanna' }, 'Thank you for testing PookAi. Goodbye!');

      // Make the call
      const call = await client.calls.create({
        twiml: response.toString(),
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        timeout: 30,
        record: false,
      });

      res.json({
        success: true,
        callSid: call.sid,
        status: call.status,
        message: `Test call initiated to ${phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message,
        error: error.toString()
      });
    }
  });

  // Check API setup status
  app.get("/api/setup/status", async (req, res) => {
    const status = {
      twilio: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN && !!process.env.TWILIO_PHONE_NUMBER,
      openai: !!process.env.OPENAI_API_KEY,
      gmail: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    };
    
    res.json({
      configured: status,
      ready: status.twilio,
      twilioPhone: process.env.TWILIO_PHONE_NUMBER || 'Not configured',
      twilioConfigured: status.twilio
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}