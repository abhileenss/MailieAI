import sgMail from '@sendgrid/mail';

interface SupportEmailData {
  userEmail?: string;
  userName?: string;
  subject: string;
  message: string;
  supportType: 'general' | 'technical' | 'founder-feedback';
  userAgent?: string;
  timestamp: Date;
}

export class EmailService {
  private initialized = false;

  constructor() {
    this.initializeSendGrid();
  }

  private initializeSendGrid() {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email features will be unavailable.');
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.initialized = true;
    console.log('SendGrid email service initialized');
  }

  async sendSupportEmail(data: SupportEmailData): Promise<boolean> {
    if (!this.initialized) {
      console.error('SendGrid not initialized');
      return false;
    }

    try {
      const supportEmail = {
        to: 'info.glitchowt@gmail.com',
        from: {
          email: 'noreply@glitchowt.com',
          name: 'Mailie Support System'
        },
        replyTo: data.userEmail || 'info.glitchowt@gmail.com',
        subject: `[${data.supportType.toUpperCase()}] ${data.subject}`,
        html: this.generateSupportEmailHTML(data),
        text: this.generateSupportEmailText(data)
      };

      await sgMail.send(supportEmail);
      console.log(`Support email sent successfully for: ${data.subject}`);
      return true;
    } catch (error) {
      console.error('Failed to send support email:', error);
      return false;
    }
  }

  async sendAutoReply(userEmail: string, supportType: string): Promise<boolean> {
    if (!this.initialized || !userEmail) {
      return false;
    }

    try {
      const autoReply = {
        to: userEmail,
        from: {
          email: 'info.glitchowt@gmail.com',
          name: 'Mailie Support Team'
        },
        subject: 'We received your message - Mailie Support',
        html: this.generateAutoReplyHTML(supportType),
        text: this.generateAutoReplyText(supportType)
      };

      await sgMail.send(autoReply);
      console.log(`Auto-reply sent to: ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send auto-reply:', error);
      return false;
    }
  }

  private generateSupportEmailHTML(data: SupportEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
          .badge { display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .message-content { background: #ffffff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Support Request - Mailie</h2>
            <span class="badge">${data.supportType.replace('-', ' ').toUpperCase()}</span>
          </div>
          
          <div class="details">
            <h3>Request Details</h3>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>From:</strong> ${data.userEmail || 'Anonymous User'}</p>
            <p><strong>Name:</strong> ${data.userName || 'Not provided'}</p>
            <p><strong>Type:</strong> ${data.supportType}</p>
            <p><strong>Timestamp:</strong> ${data.timestamp.toISOString()}</p>
            ${data.userAgent ? `<p><strong>User Agent:</strong> ${data.userAgent}</p>` : ''}
          </div>

          <div class="message-content">
            <h3>Message</h3>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This message was sent through the Mailie support system.</p>
            <p>Reply directly to this email to respond to the user.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateSupportEmailText(data: SupportEmailData): string {
    return `
NEW SUPPORT REQUEST - MAILIE
Type: ${data.supportType.toUpperCase()}

Subject: ${data.subject}
From: ${data.userEmail || 'Anonymous User'}
Name: ${data.userName || 'Not provided'}
Timestamp: ${data.timestamp.toISOString()}

MESSAGE:
${data.message}

---
This message was sent through the Mailie support system.
Reply directly to this email to respond to the user.
    `.trim();
  }

  private generateAutoReplyHTML(supportType: string): string {
    const responseTime = this.getResponseTime(supportType);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { color: #3b82f6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .response-time { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Mailie</div>
            <h2>Thank you for contacting us!</h2>
          </div>
          
          <p>Hi there,</p>
          
          <p>We've received your message and appreciate you reaching out to our team. Our support team is designed specifically for startup founders and understands the unique challenges you face.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div class="response-time">Expected Response: ${responseTime}</div>
          </div>
          
          <p>Here's what happens next:</p>
          <ul>
            <li>Your message has been forwarded to the appropriate team member</li>
            <li>You'll receive a personalized response within the timeframe above</li>
            <li>For urgent issues, don't hesitate to follow up</li>
          </ul>
          
          <p>In the meantime, you might find our <a href="https://docs.mailie.ai" style="color: #3b82f6;">documentation</a> helpful for quick answers.</p>
          
          <p>Thanks for using Mailie!</p>
          
          <p style="margin-top: 30px;">
            <strong>The Mailie Support Team</strong><br>
            <a href="mailto:info.glitchowt@gmail.com" style="color: #3b82f6;">info.glitchowt@gmail.com</a>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated response. Please do not reply to this email directly.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAutoReplyText(supportType: string): string {
    const responseTime = this.getResponseTime(supportType);
    
    return `
MAILIE SUPPORT - MESSAGE RECEIVED

Hi there,

We've received your message and appreciate you reaching out to our team. Our support team is designed specifically for startup founders and understands the unique challenges you face.

Expected Response Time: ${responseTime}

Here's what happens next:
- Your message has been forwarded to the appropriate team member
- You'll receive a personalized response within the timeframe above
- For urgent issues, don't hesitate to follow up

Thanks for using Mailie!

The Mailie Support Team
info.glitchowt@gmail.com

---
This is an automated response. Please do not reply to this email directly.
    `.trim();
  }

  private getResponseTime(supportType: string): string {
    switch (supportType) {
      case 'technical':
        return '< 2 hours';
      case 'general':
        return '< 24 hours';
      case 'founder-feedback':
        return '< 3 days';
      default:
        return '< 24 hours';
    }
  }
}

export const emailService = new EmailService();