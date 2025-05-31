import { storage } from '../storage';
import twilio from 'twilio';

export class VoiceService {
  private twilioClient: any;

  constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  async makeOutboundCall(userId: string, phoneNumber: string, callType: string, emailCount: number): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio API not configured. Please provide TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
    }

    try {
      // Generate voice script based on call type and email count
      const script = this.generateVoiceScript(callType, emailCount);
      
      // Create TwiML for the call
      const twiml = await this.generateTwiML(script);
      
      // Make the actual Twilio call using TwiML directly
      const call = await this.twilioClient.calls.create({
        twiml: twiml,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        timeout: 30,
        record: false,
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        message: `Call initiated to ${phoneNumber}`,
        phoneNumber: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      };
    } catch (error: any) {
      console.error('Voice call error:', error);
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  private generateVoiceScript(callType: string, emailCount: number): string {
    const greetings = [
      "Hello! This is your PookAi assistant.",
      "Hi there! Your personal email concierge calling.",
      "Good day! PookAi here with your email update."
    ];

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    switch (callType) {
      case 'urgent':
        return `${greeting} You have ${emailCount} urgent emails that need your immediate attention. Would you like me to read the details? Press 1 for yes, or 2 to hang up.`;
      case 'reminder':
        return `${greeting} You have ${emailCount} important emails waiting for your review. Shall I summarize them for you? Press 1 for summary, or 2 to hang up.`;
      case 'digest':
        return `${greeting} Here's your daily email digest. You received ${emailCount} emails today. The highlights include investor updates and customer inquiries. Press 1 to hear more details.`;
      case 'test':
        return `${greeting} This is a test call to verify your PookAi voice service is working correctly. You have ${emailCount} emails in your queue. The system is functioning properly!`;
      default:
        return `${greeting} You have ${emailCount} new emails to review. Thank you for using PookAi!`;
    }
  }

  private async generateTwiML(script: string): Promise<string> {
    // Create TwiML using Twilio's TwiML object
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    response.say({
      voice: 'Polly.Joanna',
      rate: 'medium'
    }, script);
    
    response.gather({
      input: 'dtmf',
      timeout: 10,
      numDigits: 1
    }).say({
      voice: 'Polly.Joanna'
    }, 'Press any key when you\'re ready to hang up.');
    
    response.say({
      voice: 'Polly.Joanna'
    }, 'Thank you for using PookAi. Goodbye!');

    return response.toString();
  }

  async getCallLogs(userId: string): Promise<any[]> {
    return await storage.getCallLogs(userId);
  }

  async getCallStatus(callSid: string): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const call = await this.twilioClient.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
        price: call.price,
        direction: call.direction
      };
    } catch (error) {
      throw new Error(`Failed to fetch call status: ${error.message}`);
    }
  }
}