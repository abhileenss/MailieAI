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