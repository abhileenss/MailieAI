import { VoiceService } from './voiceService';
import { GmailService } from './gmailService';
import { EmailCategorizationService } from './emailCategorizationService';
import { storage } from '../storage';

export interface ScheduledCall {
  userId: string;
  phoneNumber: string;
  scheduledTime: string;
  callType: 'daily-digest' | 'urgent-alert' | 'weekly-summary';
  isActive: boolean;
}

export class CallScheduler {
  private voiceService: VoiceService;
  private gmailService: GmailService;
  private categorizationService: EmailCategorizationService;

  constructor() {
    this.voiceService = new VoiceService();
    this.gmailService = new GmailService();
    this.categorizationService = new EmailCategorizationService();
  }

  // Process daily digest calls for all users
  async processDailyDigests(): Promise<void> {
    try {
      // Get all users with active call preferences
      const users = await this.getActiveCallUsers();
      
      for (const user of users) {
        await this.processUserDigest(user.userId, user.phoneNumber);
      }
    } catch (error) {
      console.error('Error processing daily digests:', error);
    }
  }

  // Process digest for a specific user
  async processUserDigest(userId: string, phoneNumber: string): Promise<void> {
    try {
      // Check if user has Gmail credentials
      const hasCredentials = await this.gmailService.setUserCredentials(userId);
      if (!hasCredentials) {
        console.log(`No Gmail credentials for user ${userId}, skipping digest`);
        return;
      }

      // Get recent emails
      const messages = await this.gmailService.getMessages(userId, 50);
      
      // Categorize emails with AI
      const categorizations = await this.categorizationService.categorizeEmails(messages);
      
      // Generate call script
      const script = await this.categorizationService.generateCallScript(categorizations, {});
      
      // Make the call
      const callResult = await this.voiceService.makeOutboundCall(userId, phoneNumber, 'digest', messages.length);
      
      // Log the call
      await storage.createCallLog({
        id: `digest_${Date.now()}_${userId}`,
        userId,
        phoneNumber,
        callSid: callResult.sid,
        status: 'initiated',
        duration: 0,
        callType: 'daily-digest',
        emailCount: messages.length
      });

      console.log(`Daily digest call initiated for user ${userId}: ${callResult.sid}`);
    } catch (error) {
      console.error(`Error processing digest for user ${userId}:`, error);
    }
  }

  // Get users with active call preferences
  private async getActiveCallUsers(): Promise<ScheduledCall[]> {
    try {
      // This would query the database for users with active call schedules
      // For now, return empty array until we have real user data
      return [];
    } catch (error) {
      console.error('Error fetching active call users:', error);
      return [];
    }
  }

  // Schedule urgent alert call
  async scheduleUrgentAlert(userId: string, urgentEmails: any[]): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user?.phone) {
        console.log(`No phone number for user ${userId}, cannot send urgent alert`);
        return;
      }

      // Generate urgent script
      const urgentScript = `Hey, you have ${urgentEmails.length} urgent emails that need immediate attention. Check your inbox as soon as possible.`;
      
      // Make immediate call
      const callResult = await this.voiceService.makeOutboundCall(userId, user.phone, 'urgent', urgentEmails.length);
      
      // Log the urgent call
      await storage.createCallLog({
        id: `urgent_${Date.now()}_${userId}`,
        userId,
        phoneNumber: user.phone,
        callSid: callResult.sid,
        status: 'initiated',
        duration: 0,
        callType: 'urgent-alert',
        emailCount: urgentEmails.length
      });

      console.log(`Urgent alert call initiated for user ${userId}: ${callResult.sid}`);
    } catch (error) {
      console.error(`Error scheduling urgent alert for user ${userId}:`, error);
    }
  }

  // Monitor ongoing calls
  async monitorCalls(): Promise<void> {
    try {
      const recentCalls = await this.getRecentCalls();
      
      for (const call of recentCalls) {
        if (call.status === 'initiated' || call.status === 'in-progress') {
          const callStatus = await this.voiceService.getCallStatus(call.callSid!);
          
          // Update call status in database
          if (callStatus.status !== call.status) {
            // Update the call log with new status
            console.log(`Call ${call.callSid} status updated: ${callStatus.status}`);
          }
        }
      }
    } catch (error) {
      console.error('Error monitoring calls:', error);
    }
  }

  // Get recent calls for monitoring
  private async getRecentCalls(): Promise<any[]> {
    try {
      // This would query recent call logs from the database
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching recent calls:', error);
      return [];
    }
  }
}