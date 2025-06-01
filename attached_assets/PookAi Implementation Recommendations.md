# PookAi Implementation Recommendations

## Priority Fixes and Next Steps

Based on the code review, here are the specific implementation steps you should take to get your PookAi project working properly for the 100xEngineers buildathon:

### 1. Complete Gmail API Integration (Highest Priority)

```typescript
// server/services/gmailService.ts - Replace with gmail-inbox library
import { Inbox } from 'gmail-inbox';
import { storage } from '../storage';

export class GmailService {
  private inbox: any;
  
  constructor() {
    // No initialization here - we'll initialize per user
  }
  
  // Generate OAuth URL for Gmail authorization
  getAuthUrl(): string {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Gmail API credentials not configured');
    }
    
    const redirectUri = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost'}/api/auth/gmail/callback`;
    
    // Use the gmail-inbox library to generate auth URL
    return Inbox.getAuthUrl({
      clientId: process.env.GOOGLE_CLIENT_ID,
      redirectUri: redirectUri,
      scope: ['https://www.googleapis.com/auth/gmail.readonly']
    });
  }
  
  // Exchange authorization code for tokens
  async getAccessToken(code: string): Promise<any> {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Gmail API credentials not configured');
    }
    
    const redirectUri = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost'}/api/auth/gmail/callback`;
    
    try {
      // Use the gmail-inbox library to exchange code for tokens
      const tokens = await Inbox.getTokensFromCode({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: redirectUri,
        code
      });
      
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error(`Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Initialize inbox for a specific user
  async initializeForUser(userId: string): Promise<boolean> {
    try {
      const userToken = await storage.getUserToken(userId, 'gmail');
      if (!userToken) {
        return false;
      }
      
      this.inbox = new Inbox({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken
      });
      
      // Test connection
      await this.inbox.testConnection();
      return true;
    } catch (error) {
      console.error('Error initializing inbox:', error);
      return false;
    }
  }
  
  // Get messages using gmail-inbox library
  async getMessages(userId: string, maxResults: number = 50): Promise<EmailMessage[]> {
    try {
      const initialized = await this.initializeForUser(userId);
      if (!initialized) {
        throw new Error('Failed to initialize Gmail inbox');
      }
      
      // Use the gmail-inbox library to get messages
      const messages = await this.inbox.getLatestMessages(maxResults);
      
      // Map to our EmailMessage interface
      return messages.map(this.mapToEmailMessage);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Map gmail-inbox message to our EmailMessage interface
  private mapToEmailMessage(message: any): EmailMessage {
    return {
      id: message.id,
      threadId: message.threadId,
      subject: message.subject || '',
      from: message.from || '',
      to: message.to || '',
      date: new Date(message.date),
      snippet: message.snippet || '',
      body: message.body || '',
      labels: message.labels || [],
      isRead: message.isRead || false
    };
  }
  
  // Other methods remain similar but adapted to use gmail-inbox
}
```

### 2. Fix Database Integration in CallScheduler

```typescript
// server/services/callScheduler.ts - Fix database queries
private async getActiveCallUsers(): Promise<ScheduledCall[]> {
  try {
    // Implement actual database query
    const users = await storage.getActiveCallUsers();
    return users.map(user => ({
      userId: user.id,
      phoneNumber: user.phone || '',
      scheduledTime: user.callPreferences?.scheduledTime || '09:00',
      callType: user.callPreferences?.callType || 'daily-digest',
      isActive: user.callPreferences?.isActive || false
    }));
  } catch (error) {
    console.error('Error fetching active call users:', error);
    return [];
  }
}

private async getRecentCalls(): Promise<any[]> {
  try {
    // Implement actual database query
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return await storage.getCallLogs({
      status: ['initiated', 'in-progress'],
      createdAfter: oneDayAgo
    });
  } catch (error) {
    console.error('Error fetching recent calls:', error);
    return [];
  }
}
```

### 3. Standardize Error Handling

Create a centralized error handling utility:

```typescript
// server/utils/errorHandler.ts
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  API = 'API',
  RATE_LIMIT = 'RATE_LIMIT',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL = 'INTERNAL'
}

export class AppError extends Error {
  type: ErrorType;
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, type: ErrorType, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: Error | AppError): void => {
  // Log error
  console.error('Error:', error);
  
  // Additional handling like sending to monitoring service
  // could be added here
}

// Example usage:
// throw new AppError('User not found', ErrorType.NOT_FOUND, 404);
```

Then use it consistently across services:

```typescript
// Example in gmailService.ts
import { AppError, ErrorType } from '../utils/errorHandler';

async getMessages(userId: string, maxResults: number = 50): Promise<EmailMessage[]> {
  try {
    const initialized = await this.initializeForUser(userId);
    if (!initialized) {
      throw new AppError('Failed to initialize Gmail inbox', ErrorType.AUTHENTICATION, 401);
    }
    
    // Rest of the method...
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      ErrorType.API, 500);
  }
}
```

### 4. Implement Proper Rate Limiting for OpenAI

```typescript
// server/utils/rateLimiter.ts
export class RateLimiter {
  private requestCounts: Map<string, number> = new Map();
  private lastResetTime: number = Date.now();
  private resetInterval: number; // in milliseconds
  private maxRequestsPerInterval: number;
  
  constructor(maxRequestsPerInterval: number, resetIntervalSeconds: number) {
    this.maxRequestsPerInterval = maxRequestsPerInterval;
    this.resetInterval = resetIntervalSeconds * 1000;
  }
  
  async acquire(key: string): Promise<boolean> {
    // Reset counts if interval has passed
    if (Date.now() - this.lastResetTime > this.resetInterval) {
      this.requestCounts.clear();
      this.lastResetTime = Date.now();
    }
    
    // Get current count
    const currentCount = this.requestCounts.get(key) || 0;
    
    // Check if limit reached
    if (currentCount >= this.maxRequestsPerInterval) {
      // Calculate time to wait
      const timeToWait = this.resetInterval - (Date.now() - this.lastResetTime);
      
      // Wait if needed
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
        // Reset after waiting
        this.requestCounts.clear();
        this.lastResetTime = Date.now();
      }
    }
    
    // Increment count
    this.requestCounts.set(key, currentCount + 1);
    return true;
  }
}

// Usage in emailCategorizationService.ts
private rateLimiter = new RateLimiter(20, 60); // 20 requests per minute

async categorizeEmail(message: EmailMessage): Promise<CategoryResult> {
  try {
    // Rate limit OpenAI calls
    await this.rateLimiter.acquire('openai');
    
    // Rest of the method...
  } catch (error) {
    // Error handling...
  }
}
```

### 5. Fix TwiML Implementation

```typescript
// server/services/voiceService.ts
private async generateTwiML(script: string): Promise<string> {
  // Create TwiML using Twilio's TwiML object
  const response = new this.twilioLib.twiml.VoiceResponse();
  
  // Initial greeting
  response.say({
    voice: 'Polly.Joanna'
  }, script);
  
  // Gather user input with action URL
  const gather = response.gather({
    input: ['dtmf'],
    timeout: 10,
    numDigits: 1,
    action: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost'}/api/calls/gather`,
    method: 'POST'
  });
  
  gather.say({
    voice: 'Polly.Joanna'
  }, 'Press 1 to hear more details, or any other key to end the call.');
  
  // If user doesn't input anything
  response.say({
    voice: 'Polly.Joanna'
  }, 'We didn\'t receive any input. Thank you for using PookAi. Goodbye!');
  
  return response.toString();
}
```

### 6. Implement Dependency Injection

Create a simple service container:

```typescript
// server/services/serviceContainer.ts
import { GmailService } from './gmailService';
import { EmailCategorizationService } from './emailCategorizationService';
import { VoiceService } from './voiceService';
import { CallScheduler } from './callScheduler';

class ServiceContainer {
  private services: Map<string, any> = new Map();
  
  // Get or create service instance
  get<T>(serviceClass: new (...args: any[]) => T): T {
    const serviceName = serviceClass.name;
    
    if (!this.services.has(serviceName)) {
      // Create new instance
      const instance = this.createService(serviceClass);
      this.services.set(serviceName, instance);
    }
    
    return this.services.get(serviceName);
  }
  
  // Create service with dependencies
  private createService<T>(serviceClass: new (...args: any[]) => T): T {
    switch(serviceClass.name) {
      case 'GmailService':
        return new GmailService() as T;
      
      case 'EmailCategorizationService':
        return new EmailCategorizationService() as T;
      
      case 'VoiceService':
        return new VoiceService() as T;
      
      case 'CallScheduler':
        // Inject dependencies
        const gmailService = this.get(GmailService);
        const categorizationService = this.get(EmailCategorizationService);
        const voiceService = this.get(VoiceService);
        return new CallScheduler(gmailService, categorizationService, voiceService) as T;
      
      default:
        throw new Error(`Unknown service: ${serviceClass.name}`);
    }
  }
}

export const serviceContainer = new ServiceContainer();
```

Then update CallScheduler to use dependency injection:

```typescript
// server/services/callScheduler.ts
export class CallScheduler {
  constructor(
    private gmailService: GmailService,
    private categorizationService: EmailCategorizationService,
    private voiceService: VoiceService
  ) {}
  
  // Rest of the class remains the same
}
```

### 7. Add Database Transactions

```typescript
// server/storage.ts - Add transaction support
async storeEmailSendersWithTransaction(userId: string, senders: EmailSender[]): Promise<void> {
  // Start transaction
  const db = getDatabase();
  const transaction = db.transaction();
  
  try {
    for (const sender of senders) {
      transaction.run(
        'INSERT INTO email_senders (id, user_id, email, name, domain, email_count, latest_subject, last_email_date, category) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ' +
        'ON CONFLICT (id) DO UPDATE SET ' +
        'email_count = ?, latest_subject = ?, last_email_date = ?',
        [
          `${userId}_${sender.email}`,
          userId,
          sender.email,
          sender.name,
          sender.domain,
          sender.messageCount,
          sender.latestSubject,
          sender.latestMessageDate,
          'unassigned',
          // Update values
          sender.messageCount,
          sender.latestSubject,
          sender.latestMessageDate
        ]
      );
    }
    
    // Commit transaction
    await transaction.commit();
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}
```

## Testing Strategy

### 1. Unit Tests for Gmail Service

```typescript
// tests/unit/gmailService.test.ts
import { GmailService } from '../../server/services/gmailService';
import { storage } from '../../server/storage';

// Mock dependencies
jest.mock('../../server/storage');
jest.mock('gmail-inbox');

describe('GmailService', () => {
  let gmailService: GmailService;
  
  beforeEach(() => {
    gmailService = new GmailService();
    jest.clearAllMocks();
  });
  
  test('should initialize inbox for user with valid token', async () => {
    // Mock storage.getUserToken
    (storage.getUserToken as jest.Mock).mockResolvedValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token'
    });
    
    const result = await gmailService.initializeForUser('test-user-id');
    
    expect(result).toBe(true);
    expect(storage.getUserToken).toHaveBeenCalledWith('test-user-id', 'gmail');
  });
  
  test('should return false when user token not found', async () => {
    // Mock storage.getUserToken returning null
    (storage.getUserToken as jest.Mock).mockResolvedValue(null);
    
    const result = await gmailService.initializeForUser('test-user-id');
    
    expect(result).toBe(false);
    expect(storage.getUserToken).toHaveBeenCalledWith('test-user-id', 'gmail');
  });
  
  // Add more tests...
});
```

### 2. Integration Test for Email Processing Flow

```typescript
// tests/integration/emailProcessing.test.ts
import { serviceContainer } from '../../server/services/serviceContainer';
import { GmailService } from '../../server/services/gmailService';
import { EmailCategorizationService } from '../../server/services/emailCategorizationService';
import { storage } from '../../server/storage';

// Mock dependencies
jest.mock('../../server/storage');
jest.mock('gmail-inbox');
jest.mock('openai');

describe('Email Processing Flow', () => {
  const userId = 'test-user-id';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should process emails end-to-end', async () => {
    // Mock Gmail service
    const mockMessages = [
      {
        id: 'msg1',
        threadId: 'thread1',
        subject: 'Test Email',
        from: 'sender@example.com',
        to: 'user@example.com',
        date: new Date(),
        snippet: 'This is a test email',
        body: 'Email body content',
        labels: [],
        isRead: false
      }
    ];
    
    const gmailService = serviceContainer.get(GmailService);
    const categorizationService = serviceContainer.get(EmailCategorizationService);
    
    // Mock getMessages
    jest.spyOn(gmailService, 'getMessages').mockResolvedValue(mockMessages);
    
    // Mock categorizeEmail
    jest.spyOn(categorizationService, 'categorizeEmail').mockResolvedValue({
      category: 'call-me',
      importance: 4,
      reasoning: 'Test reasoning',
      summary: 'Test summary'
    });
    
    // Mock storage
    (storage.createEmailSender as jest.Mock).mockResolvedValue(true);
    
    // Process emails
    const messages = await gmailService.getMessages(userId);
    const categorizations = await categorizationService.categorizeEmails(messages);
    
    // Store results
    await gmailService.storeEmailSenders(userId, [
      {
        email: 'sender@example.com',
        name: 'Sender',
        domain: 'example.com',
        messageCount: 1,
        latestMessageDate: new Date(),
        latestSubject: 'Test Email'
      }
    ]);
    
    // Assertions
    expect(messages).toHaveLength(1);
    expect(categorizations.size).toBe(1);
    expect(categorizations.get('msg1')?.category).toBe('call-me');
    expect(storage.createEmailSender).toHaveBeenCalled();
  });
});
```

## Next Steps Checklist

1. [ ] Fix Gmail API integration using gmail-inbox library
2. [ ] Implement proper database queries in CallScheduler
3. [ ] Standardize error handling across all services
4. [ ] Add rate limiting for OpenAI API calls
5. [ ] Fix TwiML implementation for interactive calls
6. [ ] Implement dependency injection for services
7. [ ] Add database transactions for data consistency
8. [ ] Write unit tests for core services
9. [ ] Add integration tests for end-to-end flows
10. [ ] Test the complete application with real Gmail accounts

## Conclusion

These implementation steps address the critical issues in your codebase. Focus on completing the Gmail API integration first, as it's the foundation of your application. Then fix the database integration and error handling to ensure reliable operation. The remaining improvements will enhance maintainability and reliability.

Remember that for the buildathon, a working end-to-end solution is more important than perfect code. Prioritize getting the core functionality working, then refine as time allows.
