# API Documentation

*Complete guide to PookAi's backend API for developers*

## Overview

The PookAi API provides programmatic access to email categorization, user preferences, and voice call management. This RESTful API is designed for reliability, security, and ease of integration.

### Base URL
```
Production: https://api.pookai.com/v1
Development: http://localhost:5000/api
```

### Authentication

All API requests require authentication using JWT tokens obtained through the OAuth flow.

```bash
# Include token in Authorization header
Authorization: Bearer <your_jwt_token>
```

### Response Format

All API responses follow a consistent JSON structure:

**Success Response**
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error context
    }
  }
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body**
```json
{
  "email": "founder@startup.com",
  "name": "Jane Founder",
  "timezone": "America/New_York"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "founder@startup.com",
      "name": "Jane Founder",
      "timezone": "America/New_York"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login
Authenticate an existing user.

**Request Body**
```json
{
  "email": "founder@startup.com",
  "password": "secure_password"
}
```

### GET /auth/me
Get current user information.

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "founder@startup.com",
      "name": "Jane Founder",
      "timezone": "America/New_York",
      "emailConnected": true,
      "lastSync": "2025-05-31T10:30:00Z"
    }
  }
}
```

## Email Sender Management

### GET /senders
Retrieve all email senders for the authenticated user.

**Query Parameters**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `category` (optional): Filter by category
- `search` (optional): Search sender names or emails

**Example Request**
```bash
GET /senders?page=1&limit=20&category=call-me
```

**Response**
```json
{
  "success": true,
  "data": {
    "senders": [
      {
        "id": "sender_456",
        "name": "Stripe",
        "email": "receipts@stripe.com",
        "domain": "stripe.com",
        "category": "call-me",
        "emailCount": 42,
        "latestSubject": "Payment failed for subscription",
        "latestDate": "2025-05-31T09:15:00Z",
        "latestPreview": "Your payment method was declined...",
        "type": "tool",
        "avatar": "https://logo.clearbit.com/stripe.com"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

### POST /senders/scan
Trigger a new email scan to identify senders.

**Request Body**
```json
{
  "provider": "gmail",
  "forceRescan": false
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "jobId": "scan_789",
    "status": "processing",
    "estimatedCompletion": "2025-05-31T10:45:00Z"
  }
}
```

### GET /senders/scan/:jobId
Check the status of an email scan job.

**Response**
```json
{
  "success": true,
  "data": {
    "jobId": "scan_789",
    "status": "completed",
    "progress": 100,
    "sendersFound": 156,
    "newSenders": 12,
    "completedAt": "2025-05-31T10:42:00Z"
  }
}
```

### PUT /senders/:id/category
Update the category for a specific sender.

**Request Body**
```json
{
  "category": "remind-me"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "sender": {
      "id": "sender_456",
      "category": "remind-me",
      "updatedAt": "2025-05-31T10:30:00Z"
    }
  }
}
```

### POST /senders/bulk-update
Update categories for multiple senders.

**Request Body**
```json
{
  "updates": [
    {"senderId": "sender_456", "category": "call-me"},
    {"senderId": "sender_789", "category": "keep-quiet"},
    {"senderId": "sender_012", "category": "remind-me"}
  ]
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "results": [
      {"senderId": "sender_456", "status": "updated"},
      {"senderId": "sender_789", "status": "updated"},
      {"senderId": "sender_012", "status": "updated"}
    ]
  }
}
```

## User Preferences

### GET /preferences
Get user's current preferences and configuration.

**Response**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "urgentFinancial": true,
      "investorUpdates": true,
      "customerIssues": true,
      "teamUrgent": false,
      "partnershipDeals": false,
      "productLaunches": true,
      "meetingReminders": {
        "timing": "30-minutes",
        "frequency": "all-meetings",
        "method": "call-and-digest"
      },
      "callSchedule": {
        "preferredTime": "09:00",
        "timezone": "America/New_York",
        "voice": "nova"
      }
    }
  }
}
```

### PUT /preferences
Update user preferences.

**Request Body**
```json
{
  "urgentFinancial": true,
  "investorUpdates": true,
  "customerIssues": false,
  "meetingReminders": {
    "timing": "1-hour",
    "frequency": "important-only",
    "method": "call-only"
  }
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "preferences": {
      // Updated preferences object
    }
  }
}
```

### POST /preferences/reset
Reset preferences to smart defaults based on user patterns.

**Response**
```json
{
  "success": true,
  "data": {
    "preferences": {
      // Reset preferences with smart defaults
    },
    "message": "Preferences reset to smart defaults"
  }
}
```

## Voice Call Management

### GET /calls
Retrieve call history for the user.

**Query Parameters**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by call type (urgent, digest, meeting-reminder)
- `status` (optional): Filter by status (completed, failed, scheduled)
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)

**Response**
```json
{
  "success": true,
  "data": {
    "calls": [
      {
        "id": "call_123",
        "type": "digest",
        "status": "completed",
        "scheduledAt": "2025-05-31T09:00:00Z",
        "completedAt": "2025-05-31T09:03:45Z",
        "duration": 225,
        "contentSummary": "3 investor emails, 1 customer issue, 2 meeting reminders",
        "satisfaction": 4.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 47,
      "pages": 3
    }
  }
}
```

### POST /calls/schedule-urgent
Schedule an immediate call for urgent notifications.

**Request Body**
```json
{
  "content": "Critical payment failure from Stripe",
  "priority": "high",
  "context": {
    "senderIds": ["sender_456"],
    "emailIds": ["email_789"]
  }
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "call": {
      "id": "call_456",
      "type": "urgent",
      "status": "scheduled",
      "scheduledAt": "2025-05-31T10:35:00Z",
      "estimatedDuration": 120
    }
  }
}
```

### GET /calls/next-digest
Get preview of the next scheduled digest call.

**Response**
```json
{
  "success": true,
  "data": {
    "nextCall": {
      "scheduledAt": "2025-06-01T09:00:00Z",
      "contentPreview": {
        "callMeItems": 2,
        "remindMeItems": 5,
        "meetingReminders": 3,
        "topSenders": ["Stripe", "Y Combinator", "GitHub"]
      },
      "estimatedDuration": 180
    }
  }
}
```

## Integration Management

### POST /integrations/email/connect
Connect a new email provider.

**Request Body**
```json
{
  "provider": "gmail",
  "authCode": "oauth_authorization_code",
  "redirectUri": "https://pookai.com/auth/callback"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "integration_123",
      "provider": "gmail",
      "email": "founder@startup.com",
      "status": "connected",
      "connectedAt": "2025-05-31T10:30:00Z"
    }
  }
}
```

### GET /integrations/email/status
Check current email integration status.

**Response**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "provider": "gmail",
    "email": "founder@startup.com",
    "lastSync": "2025-05-31T09:00:00Z",
    "permissions": ["read", "metadata"],
    "health": "healthy"
  }
}
```

### POST /integrations/calendar/connect
Connect calendar for meeting reminders.

**Request Body**
```json
{
  "provider": "google",
  "authCode": "oauth_authorization_code"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "cal_integration_456",
      "provider": "google",
      "status": "connected",
      "calendarsFound": 3
    }
  }
}
```

### GET /integrations/calendar/events
Get upcoming calendar events for meeting reminders.

**Query Parameters**
- `daysAhead` (optional): Number of days to look ahead (default: 7)
- `calendarIds` (optional): Specific calendar IDs to include

**Response**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_123",
        "title": "Board Meeting",
        "startTime": "2025-06-01T14:00:00Z",
        "endTime": "2025-06-01T15:00:00Z",
        "location": "Conference Room A",
        "attendees": ["investor@vc.com", "cofounder@startup.com"],
        "importance": "high"
      }
    ]
  }
}
```

## Error Codes

### Authentication Errors
- `AUTH_REQUIRED` - Authentication token required
- `AUTH_INVALID` - Invalid or expired token
- `AUTH_FORBIDDEN` - Insufficient permissions

### Validation Errors
- `VALIDATION_ERROR` - Request validation failed
- `INVALID_EMAIL` - Invalid email format
- `INVALID_CATEGORY` - Invalid sender category
- `INVALID_DATE_RANGE` - Invalid date parameters

### Integration Errors
- `EMAIL_CONNECTION_FAILED` - Email provider connection failed
- `CALENDAR_CONNECTION_FAILED` - Calendar provider connection failed
- `SYNC_IN_PROGRESS` - Another sync operation is running
- `PROVIDER_ERROR` - External provider error

### Rate Limiting
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `QUOTA_EXCEEDED` - API quota exceeded

## Rate Limits

### Standard Limits
- **Authentication**: 10 requests per minute
- **Sender Management**: 100 requests per minute
- **Preferences**: 20 requests per minute
- **Voice Calls**: 5 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704088800
```

## Webhooks

### Email Sync Completed
Triggered when an email scan completes.

```json
{
  "event": "email.sync.completed",
  "timestamp": "2025-05-31T10:42:00Z",
  "data": {
    "userId": "user_123",
    "jobId": "scan_789",
    "sendersFound": 156,
    "newSenders": 12
  }
}
```

### Call Completed
Triggered when a voice call finishes.

```json
{
  "event": "call.completed",
  "timestamp": "2025-05-31T09:03:45Z",
  "data": {
    "userId": "user_123",
    "callId": "call_456",
    "type": "digest",
    "duration": 225,
    "satisfaction": 4.5
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const PookAi = require('@pookai/sdk');

const client = new PookAi({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Get email senders
const senders = await client.senders.list({
  category: 'call-me',
  limit: 20
});

// Update sender category
await client.senders.updateCategory('sender_123', 'remind-me');

// Schedule urgent call
const call = await client.calls.scheduleUrgent({
  content: 'Critical payment failure',
  priority: 'high'
});
```

### Python
```python
from pookai import PookAi

client = PookAi(
    api_key='your_api_key',
    environment='production'
)

# Get email senders
senders = client.senders.list(
    category='call-me',
    limit=20
)

# Update preferences
preferences = client.preferences.update({
    'urgent_financial': True,
    'investor_updates': True
})
```

### cURL Examples
```bash
# Get senders
curl -H "Authorization: Bearer $TOKEN" \
     "https://api.pookai.com/v1/senders?category=call-me"

# Update sender category
curl -X PUT \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"category": "remind-me"}' \
     "https://api.pookai.com/v1/senders/sender_123/category"

# Schedule urgent call
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content": "Critical payment failure", "priority": "high"}' \
     "https://api.pookai.com/v1/calls/schedule-urgent"
```

---

*This API documentation covers all available endpoints for integrating with PookAi's backend services.*