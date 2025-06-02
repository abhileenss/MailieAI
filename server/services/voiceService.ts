import { storage } from '../storage';
import Twilio from 'twilio';

export class VoiceService {
  private twilioClient: any;
  private twilioLib: any;

  constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.twilioLib = Twilio;
    }
  }

  async makeOutboundCall(userId: string, phoneNumber: string, callType: string, emailData: any): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio API not configured. Please provide TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.');
    }

    try {
      // Generate voice script from real email data
      let script: string;
      if (emailData && emailData.categorizedEmails) {
        const { EmailCategorizationService } = await import('./emailCategorizationService');
        const categorizationService = new EmailCategorizationService();
        script = await categorizationService.generateCallScript(emailData.categorizedEmails, emailData.userPreferences);
      } else {
        script = this.generateVoiceScript(callType, emailData?.emailCount || 0);
      }
      
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

      // Store call log in database
      await storage.createCallLog({
        id: `call_${call.sid}`,
        userId,
        phoneNumber,
        callSid: call.sid,
        callType,
        status: call.status,
        script,
        emailCount: emailData?.emailCount || 0,
        createdAt: new Date()
      });

      // Start monitoring this call
      this.monitorCall(call.sid, userId);

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
        return `${greeting} This is a test call to verify your mailieAI voice service is working correctly. You have ${emailCount} emails in your queue. The system is functioning properly!`;
      default:
        return `${greeting} You have ${emailCount} new emails to review. Thank you for using mailieAI!`;
    }
  }

  private async generateTwiML(script: string): Promise<string> {
    // Create TwiML using Twilio's TwiML object
    const response = new this.twilioLib.twiml.VoiceResponse();
    
    response.say({
      voice: 'Polly.Joanna'
    }, script);
    
    response.gather({
      input: ['dtmf'],
      timeout: 10,
      numDigits: 1
    }).say({
      voice: 'Polly.Joanna'
    }, 'Press any key when you\'re ready to hang up.');
    
    response.say({
      voice: 'Polly.Joanna'
    }, 'Thank you for using mailieAI. Goodbye!');

    return response.toString();
  }

  async getCallLogs(userId: string): Promise<any[]> {
    try {
      const callLogs = await storage.getCallLogs(userId);
      
      // Enrich with Twilio status for recent calls
      const enrichedLogs = await Promise.all(
        callLogs.map(async (log) => {
          try {
            if (log.callSid && log.createdAt && 
                (new Date().getTime() - log.createdAt.getTime()) < 24 * 60 * 60 * 1000) {
              const twilioCall = await this.twilioClient.calls(log.callSid).fetch();
              return {
                ...log,
                twilioStatus: twilioCall.status,
                duration: twilioCall.duration,
                direction: twilioCall.direction,
                startTime: twilioCall.startTime,
                endTime: twilioCall.endTime
              };
            }
            return log;
          } catch (error) {
            console.warn(`Could not fetch Twilio data for call ${log.callSid}:`, error);
            return log;
          }
        })
      );
      
      return enrichedLogs;
    } catch (error) {
      console.error('Error fetching call logs:', error);
      return [];
    }
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
      throw new Error(`Failed to fetch call status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Monitor call progress and update database
  async monitorCall(callSid: string, userId: string): Promise<void> {
    try {
      const checkStatus = async () => {
        const status = await this.getCallStatus(callSid);
        console.log(`Call ${callSid} status: ${status.status}, duration: ${status.duration || 'ongoing'}`);
        
        // Continue monitoring if call is still in progress
        if (['queued', 'ringing', 'in-progress'].includes(status.status)) {
          setTimeout(checkStatus, 10000); // Check every 10 seconds
        } else {
          console.log(`Call ${callSid} completed with status: ${status.status}`);
        }
      };
      
      // Start monitoring
      setTimeout(checkStatus, 5000); // Initial check after 5 seconds
    } catch (error) {
      console.error('Error monitoring call:', error);
    }
  }
}