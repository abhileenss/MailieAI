import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { storage } from '../storage';
import { randomBytes } from 'crypto';

export interface EmailMessage {
  id: string;
  threadId?: string;
  subject: string | null;
  from: string;
  to?: string;
  date: Date;
  snippet: string;
  body: string;
  labels?: string[];
  isRead?: boolean;
}

export interface EmailSender {
  email: string;
  name: string;
  domain: string;
  messageCount: number;
  latestMessageDate: Date;
  latestSubject: string;
}

export class GmailService {
  private oauth2Client?: OAuth2Client;
  private gmail: any;

  constructor() {
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
      console.warn('Gmail API credentials not configured. Email features will be unavailable.');
      return;
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}/api/auth/gmail/callback`
    );
    
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  // Generate secure state parameter for CSRF protection
  private generateSecureState(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  // Generate OAuth URL for Gmail authorization
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth client not initialized');
    }

    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly'
    ];
    
    // Generate secure state parameter for CSRF protection
    const state = randomBytes(32).toString('hex');

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'consent',
      include_granted_scopes: true
    });
  }

  // Exchange authorization code for tokens
  async getAccessToken(code: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.oauth2Client?.getToken(code, (err, tokens) => {
          if (err) reject(err);
          else if (tokens) {
            this.oauth2Client?.setCredentials(tokens);
            resolve(tokens);
          } else {
            reject(new Error('No tokens received'));
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Set user credentials from stored tokens
  async setUserCredentials(userId: string): Promise<boolean> {
    try {
      const userToken = await storage.getUserToken(userId, 'gmail');
      if (!userToken) {
        return false;
      }

      this.oauth2Client?.setCredentials({
        access_token: userToken.accessToken,
        refresh_token: userToken.refreshToken,
        expiry_date: userToken.expiresAt?.getTime() || undefined
      });

      return true;
    } catch (error) {
      console.error('Error setting user credentials:', error);
      return false;
    }
  }

  // Fetch user's email messages
  async getMessages(userId: string, maxResults: number = 50): Promise<EmailMessage[]> {
    try {
      const hasCredentials = await this.setUserCredentials(userId);
      if (!hasCredentials) {
        throw new Error('No valid Gmail credentials found for user');
      }

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: 'in:inbox'
      });

      const messages: EmailMessage[] = [];
      
      if (response.data.messages) {
        for (const message of response.data.messages) {
          const fullMessage = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });

          const parsedMessage = this.parseMessage(fullMessage.data);
          messages.push(parsedMessage);
        }
      }

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Parse Gmail message format to our EmailMessage interface
  private parseMessage(message: any): EmailMessage {
    const headers = message.payload.headers;
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';

    // Extract body content
    let body = '';
    if (message.payload.body?.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString();
    } else if (message.payload.parts) {
      // Handle multipart messages
      const textPart = message.payload.parts.find((part: any) => part.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }

    return {
      id: message.id,
      threadId: message.threadId,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: new Date(parseInt(message.internalDate)),
      snippet: message.snippet || '',
      body,
      labels: message.labelIds || [],
      isRead: !message.labelIds?.includes('UNREAD')
    };
  }

  // Group messages by sender domain
  async getEmailSendersByDomain(userId: string): Promise<EmailSender[]> {
    try {
      const messages = await this.getMessages(userId, 200);
      const senderMap = new Map<string, EmailSender>();

      for (const message of messages) {
        const fromEmail = this.extractEmail(message.from);
        const fromName = this.extractName(message.from);
        const domain = this.extractDomain(fromEmail);

        const key = fromEmail;
        
        if (senderMap.has(key)) {
          const sender = senderMap.get(key)!;
          sender.messageCount++;
          if (message.date > sender.latestMessageDate) {
            sender.latestMessageDate = message.date;
            sender.latestSubject = message.subject;
          }
        } else {
          senderMap.set(key, {
            email: fromEmail,
            name: fromName,
            domain,
            messageCount: 1,
            latestMessageDate: message.date,
            latestSubject: message.subject
          });
        }
      }

      return Array.from(senderMap.values())
        .sort((a, b) => b.messageCount - a.messageCount);
    } catch (error) {
      console.error('Error grouping emails by sender:', error);
      throw new Error(`Failed to analyze email senders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Extract email address from "Name <email@domain.com>" format (public method)
  extractEmail(fromString: string): string {
    const emailMatch = fromString.match(/<([^>]+)>/);
    return emailMatch ? emailMatch[1] : fromString.trim();
  }

  // Extract name from "Name <email@domain.com>" format
  private extractName(fromString: string): string {
    const nameMatch = fromString.match(/^([^<]+)/);
    return nameMatch ? nameMatch[1].trim().replace(/"/g, '') : '';
  }

  // Extract domain from email address
  private extractDomain(email: string): string {
    return email.split('@')[1] || '';
  }

  // Store email senders in database
  async storeEmailSenders(userId: string, senders: EmailSender[]): Promise<void> {
    try {
      for (const sender of senders) {
        await storage.createEmailSender({
          id: `${userId}_${sender.email}`,
          userId,
          email: sender.email,
          name: sender.name,
          domain: sender.domain,
          emailCount: sender.messageCount,
          latestSubject: sender.latestSubject,
          lastEmailDate: sender.latestMessageDate,
          category: 'unassigned'
        });
      }
    } catch (error) {
      console.error('Error storing email senders:', error);
      throw new Error(`Failed to store email senders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}