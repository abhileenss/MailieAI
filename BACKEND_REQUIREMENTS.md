# PookAi Backend Development Requirements

## Overview
Backend API specification for PookAi voice concierge service. The backend handles user preferences, email categorization rules, call scheduling, and integrates with email providers and voice services.

## Core Data Models

### User Schema
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}
```

### Email Sender Schema
```typescript
interface EmailSender {
  id: string;
  user_id: string;
  email: string;
  domain: string;
  name: string;
  category: 'call-me' | 'remind-me' | 'keep-quiet' | 'why-did-i-signup' | 'dont-tell-anyone' | 'unassigned';
  email_count: number;
  latest_subject: string;
  latest_date: Date;
  latest_preview: string;
  sender_type: 'newsletter' | 'tool' | 'meeting' | 'promotional' | 'personal';
  created_at: Date;
  updated_at: Date;
}
```

### User Preferences Schema
```typescript
interface UserPreferences {
  id: string;
  user_id: string;
  // Immediate call triggers
  urgent_financial: boolean;
  investor_updates: boolean;
  customer_issues: boolean;
  team_urgent: boolean;
  // Digest preferences
  partnership_deals: boolean;
  product_launches: boolean;
  // Meeting reminders
  meeting_reminder_timing: '15-minutes' | '30-minutes' | '1-hour' | '2-hours' | '1-day';
  meeting_reminder_frequency: 'all-meetings' | 'important-only' | 'external-only' | 'investor-calls';
  meeting_reminder_method: 'call-only' | 'digest-only' | 'call-and-digest';
  // Call settings
  preferred_call_time: string; // HH:MM format
  voice_preference: string;
  created_at: Date;
  updated_at: Date;
}
```

### Call Log Schema
```typescript
interface CallLog {
  id: string;
  user_id: string;
  call_type: 'urgent' | 'digest' | 'meeting-reminder';
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  scheduled_at: Date;
  completed_at?: Date;
  duration_seconds?: number;
  content_summary: string;
  created_at: Date;
}
```

## Required API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### User Management
```
GET /api/users/profile
PUT /api/users/profile
DELETE /api/users/account
```

### Email Sender Management
```
GET /api/senders
- Returns list of email senders for authenticated user
- Supports pagination, filtering by category
- Response: { senders: EmailSender[], total: number, page: number }

POST /api/senders/scan
- Triggers email account scan to identify senders
- Requires email provider authentication
- Response: { job_id: string, status: 'processing' }

GET /api/senders/scan/:job_id
- Check status of email scan job
- Response: { status: 'processing' | 'completed' | 'failed', progress: number }

PUT /api/senders/:id/category
- Update sender category assignment
- Body: { category: string }
- Response: { sender: EmailSender }

POST /api/senders/bulk-update
- Update multiple sender categories
- Body: { updates: { sender_id: string, category: string }[] }
- Response: { updated_count: number }
```

### User Preferences
```
GET /api/preferences
- Get user's current preferences
- Response: { preferences: UserPreferences }

PUT /api/preferences
- Update user preferences
- Body: Partial<UserPreferences>
- Response: { preferences: UserPreferences }

POST /api/preferences/reset
- Reset to smart defaults based on user patterns
- Response: { preferences: UserPreferences }
```

### Call Management
```
GET /api/calls
- Get call history for user
- Supports date range filtering
- Response: { calls: CallLog[], total: number }

POST /api/calls/schedule-urgent
- Schedule immediate call for urgent notifications
- Body: { content: string, priority: 'high' | 'medium' }
- Response: { call: CallLog }

GET /api/calls/next-digest
- Get preview of next daily digest call
- Response: { scheduled_at: Date, content_preview: string }
```

### Email Provider Integration
```
POST /api/integrations/email/connect
- Connect user's email account (Gmail, Outlook, etc.)
- Body: { provider: string, auth_token: string }
- Response: { integration_id: string, status: 'connected' }

GET /api/integrations/email/status
- Check email integration status
- Response: { connected: boolean, provider: string, last_sync: Date }

POST /api/integrations/email/sync
- Trigger manual email sync
- Response: { job_id: string }
```

### Calendar Integration
```
POST /api/integrations/calendar/connect
- Connect calendar for meeting reminders
- Body: { provider: string, auth_token: string }
- Response: { integration_id: string }

GET /api/integrations/calendar/events
- Get upcoming events for meeting reminders
- Query params: days_ahead=7
- Response: { events: CalendarEvent[] }
```

## External Service Integrations

### Email Provider APIs
**Required for email scanning and categorization**
- Gmail API (OAuth 2.0)
- Outlook/Exchange API (OAuth 2.0)
- IMAP support for other providers

**Request**: User email provider credentials
**Scopes**: Read-only email access, sender identification

### Voice Service Integration
**Required for AI voice calls**
- OpenAI Text-to-Speech API
- Twilio Voice API for call delivery
- Speech synthesis and call orchestration

**Request**: OpenAI API key, Twilio credentials
**Features**: Natural voice generation, call scheduling, call status tracking

### Calendar APIs
**Required for meeting reminders**
- Google Calendar API
- Outlook Calendar API
- CalDAV support

**Request**: Calendar provider credentials
**Scopes**: Read-only calendar access

## Technical Architecture Requirements

### Database Design
- PostgreSQL recommended for production
- Proper indexing on user_id, email fields
- Soft deletes for user data
- Audit logs for preference changes

### Authentication & Security
- JWT-based authentication
- Rate limiting on all endpoints
- Email provider token encryption
- GDPR compliance for data deletion

### Background Jobs
- Email scanning and processing
- Daily digest compilation
- Call scheduling and delivery
- Meeting reminder checks

### Caching Strategy
- Redis for session management
- Cache email sender data
- Cache user preferences
- Cache call content generation

### Error Handling
- Comprehensive error responses
- Email provider connection failures
- Voice service fallbacks
- Retry mechanisms for failed calls

## Development Priorities

### Phase 1 (MVP Backend)
1. User authentication and profile management
2. Email sender CRUD operations
3. User preferences storage
4. Basic call logging

### Phase 2 (Integrations)
1. Gmail API integration
2. Email scanning and categorization
3. Voice service integration
4. Call scheduling system

### Phase 3 (Advanced Features)
1. Calendar integration
2. Advanced AI categorization
3. Multi-provider support
4. Analytics and insights

## Environment Variables Required

```
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# Email Providers
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...

# Voice Services
OPENAI_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Calendar Providers
GOOGLE_CALENDAR_CLIENT_ID=...
GOOGLE_CALENDAR_CLIENT_SECRET=...

# Redis
REDIS_URL=...
```

## API Response Formats

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Testing Requirements
- Unit tests for all endpoints
- Integration tests for email providers
- End-to-end tests for call flows
- Load testing for concurrent users
- Voice service integration testing