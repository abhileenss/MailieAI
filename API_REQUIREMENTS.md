# PookAi API Requirements & Integration Guide

## Overview
PookAi requires multiple API integrations for email processing, voice calls, and AI-powered categorization. This document outlines all required APIs, authentication methods, and implementation priorities.

## Core API Categories

### 1. Email Provider APIs (Required)
**Purpose**: Access user's email inbox for analysis and categorization

#### Gmail API
- **Endpoint**: `https://gmail.googleapis.com/gmail/v1/`
- **Auth**: OAuth 2.0 with Google
- **Scopes**: `https://www.googleapis.com/auth/gmail.readonly`
- **Key Operations**:
  - List messages: `GET /users/{userId}/messages`
  - Get message details: `GET /users/{userId}/messages/{id}`
  - List labels: `GET /users/{userId}/labels`

#### Microsoft Graph API (Outlook)
- **Endpoint**: `https://graph.microsoft.com/v1.0/`
- **Auth**: OAuth 2.0 with Microsoft
- **Scopes**: `Mail.Read`
- **Key Operations**:
  - List messages: `GET /me/messages`
  - Get message: `GET /me/messages/{id}`

#### IMAP (Generic Email)
- **Protocols**: IMAP over SSL/TLS
- **Auth**: Username/Password or App Passwords
- **Ports**: 993 (SSL), 143 (STARTTLS)

### 2. Voice & Communication APIs (Core Feature)

#### Twilio Voice API
- **Purpose**: Make outbound calls for reminders and notifications
- **Endpoint**: `https://api.twilio.com/2010-04-01/`
- **Auth**: Account SID + Auth Token
- **Key Operations**:
  - Create call: `POST /Accounts/{AccountSid}/Calls.json`
  - Get call status: `GET /Accounts/{AccountSid}/Calls/{CallSid}.json`
  - TwiML for voice scripts

**Environment Variables Needed**:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

#### Alternative: Vonage Voice API
- **Endpoint**: `https://api.nexmo.com/v1/`
- **Auth**: API Key + Secret
- **Features**: Text-to-speech, call recording

### 3. AI Processing APIs (Essential)

#### OpenAI API
- **Purpose**: Email categorization, content analysis, voice script generation
- **Endpoint**: `https://api.openai.com/v1/`
- **Auth**: Bearer Token
- **Models Used**:
  - `gpt-4o` for email analysis
  - `text-embedding-ada-002` for similarity matching

**Environment Variables Needed**:
```
OPENAI_API_KEY=your_openai_key
```

#### Alternative: Anthropic Claude API
- **Endpoint**: `https://api.anthropic.com/v1/`
- **Auth**: x-api-key header
- **Model**: `claude-3-sonnet-20240229`

### 4. Calendar Integration APIs

#### Google Calendar API
- **Purpose**: Access meeting schedules for smart reminders
- **Endpoint**: `https://www.googleapis.com/calendar/v3/`
- **Auth**: OAuth 2.0
- **Scopes**: `https://www.googleapis.com/auth/calendar.readonly`
- **Operations**:
  - List events: `GET /calendars/{calendarId}/events`
  - Get event: `GET /calendars/{calendarId}/events/{eventId}`

#### Microsoft Calendar API
- **Endpoint**: `https://graph.microsoft.com/v1.0/me/events`
- **Auth**: OAuth 2.0 with Microsoft
- **Scopes**: `Calendars.Read`

### 5. Authentication & User Management

#### Replit Authentication (Already Implemented)
- **Purpose**: User login and session management
- **Type**: OpenID Connect
- **Scopes**: `openid email profile offline_access`

### 6. Notification APIs (Optional Enhancements)

#### SendGrid Email API
- **Purpose**: Send email digests and notifications
- **Endpoint**: `https://api.sendgrid.com/v3/`
- **Auth**: Bearer Token

**Environment Variables Needed**:
```
SENDGRID_API_KEY=your_sendgrid_key
```

#### Push Notifications (Firebase/Apple/Google)
- **Purpose**: Mobile app notifications
- **Auth**: Service account credentials

## Implementation Priority

### Phase 1: Core MVP
1. **Replit Auth** ✅ (Already implemented)
2. **Gmail API** (Primary email provider)
3. **OpenAI API** (Email categorization)
4. **Twilio Voice API** (Outbound calls)

### Phase 2: Enhanced Features
1. **Google Calendar API** (Meeting reminders)
2. **SendGrid API** (Email digests)
3. **Microsoft Graph API** (Outlook support)

### Phase 3: Advanced Features
1. **IMAP Support** (Generic email providers)
2. **Vonage Voice** (Alternative voice provider)
3. **Push Notifications**

## Voice Call Implementation

### Twilio Call Flow
1. **Trigger**: Time-based scheduler or manual trigger
2. **TwiML Script**: Dynamic voice content based on email categories
3. **Call Logic**:
   ```xml
   <Response>
     <Say voice="Polly.Joanna">
       Hello! This is your PookAi assistant. 
       You have 3 urgent emails requiring attention.
     </Say>
     <Gather input="speech" timeout="10">
       <Say>Would you like me to read them to you?</Say>
     </Gather>
   </Response>
   ```

### Call Scheduling
- **Cron Jobs**: For recurring reminders
- **Event-driven**: Based on email urgency
- **User Preferences**: Timing and frequency controls

## Database Schema Requirements

### Email Senders Table
```sql
CREATE TABLE email_senders (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  domain VARCHAR NOT NULL,
  name VARCHAR,
  category VARCHAR NOT NULL,
  last_email_date TIMESTAMP,
  email_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  action VARCHAR NOT NULL, -- 'call-me', 'digest', 'off'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Call Logs Table
```sql
CREATE TABLE call_logs (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  phone_number VARCHAR,
  call_sid VARCHAR,
  status VARCHAR,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

### API Key Management
- Store all keys in environment variables
- Use Replit Secrets for production
- Implement key rotation policies

### OAuth Flow Security
- Use PKCE for OAuth flows
- Secure token storage
- Refresh token management

### Rate Limiting
- Implement API rate limiting
- Queue management for calls
- Exponential backoff for retries

## Testing Strategy

### Development Testing
- Use Twilio test credentials
- Mock API responses for email providers
- Sandbox environments for all services

### Production Readiness
- Webhook verification
- Error handling and logging
- Monitoring and alerting

## Cost Considerations

### Twilio Pricing
- Outbound calls: ~$0.0085/minute (US)
- Phone number: ~$1/month
- SMS (optional): ~$0.0075/message

### OpenAI Pricing
- GPT-4o: $5/1M input tokens, $15/1M output tokens
- Embeddings: $0.10/1M tokens

### API Rate Limits
- Gmail: 1 billion quota units/day
- Twilio: No hard limits (pay-per-use)
- OpenAI: Tier-based rate limits

Would you like me to implement any specific API integration first? I recommend starting with the Gmail API and OpenAI for the core email categorization functionality.