export class WhatsAppService {
  private twilioClient: any;

  constructor() {
    // Initialize Twilio client for WhatsApp
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require('twilio');
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  async sendWhatsAppReminder(userId: string, phoneNumber: string, emailData: any): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('WhatsApp service not configured - Twilio credentials required');
    }

    const message = this.generateReminderMessage(emailData);
    
    try {
      const result = await this.twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
        body: message
      });

      return {
        sid: result.sid,
        status: result.status,
        message: 'WhatsApp reminder sent successfully'
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  async sendNewsletterSummary(userId: string, phoneNumber: string, newsletters: any[]): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('WhatsApp service not configured - Twilio credentials required');
    }

    const message = this.generateNewsletterSummary(newsletters);
    
    try {
      const result = await this.twilioClient.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
        body: message
      });

      return {
        sid: result.sid,
        status: result.status,
        message: 'Newsletter summary sent via WhatsApp'
      };
    } catch (error) {
      console.error('WhatsApp newsletter send error:', error);
      throw error;
    }
  }

  private generateReminderMessage(emailData: any): string {
    const { senderName, subject, domain, emailCount } = emailData;
    
    return `🔔 *PookAi Reminder*

📧 *${senderName}* (${domain})
📄 Subject: ${subject}
📊 ${emailCount} emails to review

💡 *Action needed:* Check your email when convenient.

Reply STOP to unsubscribe from reminders.`;
  }

  private generateNewsletterSummary(newsletters: any[]): string {
    const totalNewsletters = newsletters.length;
    const topNewsletters = newsletters.slice(0, 5);
    
    let message = `📰 *Daily Newsletter Summary*\n\n`;
    message += `📊 ${totalNewsletters} newsletters received today\n\n`;
    
    topNewsletters.forEach((newsletter, index) => {
      message += `${index + 1}. *${newsletter.senderName}*\n`;
      message += `   📄 ${newsletter.subject}\n`;
      if (newsletter.snippet) {
        message += `   📝 ${newsletter.snippet.substring(0, 100)}...\n`;
      }
      message += `\n`;
    });

    if (totalNewsletters > 5) {
      message += `... and ${totalNewsletters - 5} more newsletters\n\n`;
    }

    message += `💡 *Tip:* Use PookAi to categorize and manage your email subscriptions efficiently.\n\n`;
    message += `Reply STOP to unsubscribe from newsletter summaries.`;

    return message;
  }

  async scheduleWhatsAppReminders(userId: string): Promise<void> {
    // This would be called by a scheduler to send daily WhatsApp summaries
    // Implementation would fetch user's "remind-me" and "newsletter" emails
    // and send appropriate WhatsApp messages
    console.log(`Scheduling WhatsApp reminders for user ${userId}`);
  }
}