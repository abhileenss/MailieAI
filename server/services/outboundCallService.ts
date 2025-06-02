import { ElevenLabsService } from './elevenLabsService';
import { EmailCategorizationService } from './emailCategorizationService';
import { storage } from '../storage';

interface CallConfig {
  phoneNumber: string;
  voiceId: string;
  callType: 'reminder' | 'digest' | 'urgent';
  emailData: any;
  scheduledTime?: Date;
}

interface VoiceOptions {
  rachel: string;
  adam: string;
  domi: string;
  elli: string;
  josh: string;
  arnold: string;
  bella: string;
  antoni: string;
  sarah: string;
}

export class OutboundCallService {
  private elevenLabs: ElevenLabsService;
  private categorization: EmailCategorizationService;
  private twilioClient: any;

  // ElevenLabs voice IDs for different personalities
  private voiceIds: VoiceOptions = {
    rachel: 'Rachel',  // Professional female
    adam: 'Adam',      // Professional male
    domi: 'Domi',      // Energetic female
    elli: 'Elli',      // Young female
    josh: 'Josh',      // Casual male
    arnold: 'Arnold',  // Deep male voice
    bella: 'Bella',    // Smooth female
    antoni: 'Antoni',  // Narrator style
    sarah: 'Sarah'     // Warm female
  };

  constructor() {
    this.elevenLabs = new ElevenLabsService();
    this.categorization = new EmailCategorizationService();
    this.initializeTwilio();
  }

  private async initializeTwilio() {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('Twilio credentials not configured');
      return;
    }

    const twilio = await import('twilio');
    this.twilioClient = twilio.default(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async makeOutboundCall(config: CallConfig): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('Twilio not configured. Please provide TWILIO credentials.');
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs not configured. Please provide ELEVENLABS_API_KEY.');
    }

    try {
      // Generate voice script based on email data
      const script = await this.generateCallScript(config);
      
      // Create Twilio call with voice script
      const call = await this.twilioClient.calls.create({
        twiml: this.generateTwiML(script, config.voiceId),
        to: config.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        timeout: 30,
        record: true,
        recordingStatusCallback: '/api/calls/recording-status'
      });

      // Log the call in database
      await storage.createCallLog({
        id: `call_${Date.now()}`,
        userId: config.emailData.userId || 'unknown',
        phoneNumber: config.phoneNumber,
        callType: config.callType,
        script: script,
        status: 'initiated',
        twilioSid: call.sid,
        voiceId: config.voiceId,
        scheduledTime: config.scheduledTime || new Date(),
        completedTime: null
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        message: `Outbound call initiated to ${config.phoneNumber}`,
        script: script,
        voiceUsed: config.voiceId
      };

    } catch (error: any) {
      console.error('Error making outbound call:', error);
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  private async generateCallScript(config: CallConfig): Promise<string> {
    const { callType, emailData } = config;
    
    switch (callType) {
      case 'reminder':
        return this.generateReminderScript(emailData);
      case 'digest':
        return this.generateDigestScript(emailData);
      case 'urgent':
        return this.generateUrgentScript(emailData);
      default:
        return this.generateGenericScript(emailData);
    }
  }

  private generateReminderScript(emailData: any): string {
    const senderCount = emailData.senders?.length || 0;
    const category = emailData.category || 'important';
    
    return `Hello! This is your mailieAI assistant calling with an email reminder.

You have ${senderCount} emails in your ${category.replace('-', ' ')} category that need your attention.

${emailData.senders?.map((sender: any) => 
  `From ${sender.name || sender.email}: "${sender.latestSubject}" - ${sender.emailCount} total emails.`
).join('\n\n') || ''}

These emails were categorized as ${category.replace('-', ' ')}, which means they require your direct response.

Would you like me to read the full details, or shall I send you a summary via text? 

Thank you for using mailieAI. Have a productive day!`;
  }

  private generateDigestScript(emailData: any): string {
    const totalEmails = emailData.totalEmails || 0;
    const categories = emailData.categories || {};
    
    return `Good ${this.getTimeOfDay()}! This is your daily mailieAI email digest.

You received ${totalEmails} emails today across ${Object.keys(categories).length} categories.

Here's your breakdown:
${Object.entries(categories).map(([cat, count]) => 
  `${cat.replace('-', ' ')}: ${count} emails`
).join('\n')}

The most important items are in your "call me" and "remind me" categories. 

Your mailieAI assistant has everything organized and ready for your review.

Have a great day!`;
  }

  private generateUrgentScript(emailData: any): string {
    return `This is your mailieAI assistant with an urgent email alert.

You have received high-priority emails that require immediate attention:

${emailData.urgentEmails?.map((email: any) => 
  `From ${email.sender}: "${email.subject}"`
).join('\n') || 'Multiple urgent emails detected.'}

These emails have been flagged based on content analysis and sender importance.

Please check your email as soon as possible.

Thank you.`;
  }

  private generateGenericScript(emailData: any): string {
    return `Hello! This is your mailieAI assistant.

You have new emails that have been categorized and are ready for your review.

Check your mailieAI dashboard for the complete breakdown.

Thank you!`;
  }

  private generateTwiML(script: string, voiceId: string): string {
    const twilio = require('twilio');
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    // Use appropriate Twilio voice based on ElevenLabs voice selection
    const twilioVoice = this.mapToTwilioVoice(voiceId);
    
    response.say({ 
      voice: twilioVoice,
      rate: '0.9'  // Slightly slower for clarity
    }, script);
    
    response.say({ voice: twilioVoice }, 'Goodbye!');
    
    return response.toString();
  }

  private mapToTwilioVoice(elevenLabsVoiceId: string): string {
    const voiceMap: Record<string, string> = {
      'rachel': 'Polly.Joanna',
      'adam': 'Polly.Matthew',
      'domi': 'Polly.Amy',
      'elli': 'Polly.Emma',
      'josh': 'Polly.Joey',
      'arnold': 'Polly.Brian',
      'bella': 'Polly.Kimberly',
      'antoni': 'Polly.Russell',
      'sarah': 'Polly.Salli'
    };
    
    return voiceMap[elevenLabsVoiceId] || 'Polly.Joanna';
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  async scheduleReminder(userId: string, phoneNumber: string, emailData: any, reminderTime: Date, voiceId: string = 'rachel'): Promise<any> {
    // For immediate implementation, we'll make the call right away
    // In production, you'd use a job queue like Bull or agenda
    
    const config: CallConfig = {
      phoneNumber,
      voiceId,
      callType: 'reminder',
      emailData: { ...emailData, userId },
      scheduledTime: reminderTime
    };

    return await this.makeOutboundCall(config);
  }

  async getAvailableVoices(): Promise<VoiceOptions> {
    return this.voiceIds;
  }
}