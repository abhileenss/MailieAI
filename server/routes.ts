import type { Express } from "express";
import { createServer, type Server } from "http";
import { VoiceService } from "./services/voiceService";

const voiceService = new VoiceService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint for Twilio voice calls
  app.post("/api/test/voice-call", async (req, res) => {
    try {
      const { phoneNumber, callType = 'test', emailCount = 5 } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }
      
      // Use test user ID for demo
      const testUserId = 'test-user-' + Date.now();
      const result = await voiceService.makeOutboundCall(testUserId, phoneNumber, callType, emailCount);
      res.json(result);
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