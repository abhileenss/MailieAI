# PookAi API Setup Guide

## Required API Keys for Full Functionality

I've implemented a complete backend API structure for PookAi with the following services. Here are the exact API keys and setup steps you'll need to provide for each service:

### 1. Gmail API Integration (Email Scanning)
**Purpose**: Scan user's inbox to discover email senders

**Required Environment Variables**:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.replit.app/api/oauth/gmail/callback
```

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add your Replit domain to authorized redirect URIs
6. Copy Client ID and Secret to environment variables

### 2. Twilio Voice API (Outbound Calls)
**Purpose**: Make voice calls for email reminders and notifications

**Required Environment Variables**:
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Setup Steps**:
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get a phone number ($1/month)
3. Copy Account SID and Auth Token from dashboard
4. Add these to your environment variables

### 3. OpenAI API (Email Analysis & Voice Scripts)
**Purpose**: Categorize emails and generate voice call scripts

**Required Environment Variables**:
```
OPENAI_API_KEY=sk-your_openai_key
```

**Setup Steps**:
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Add billing information
3. Generate API key from dashboard
4. Add to environment variables

### 4. SendGrid API (Email Notifications - Optional)
**Purpose**: Send email digests and notifications

**Required Environment Variables**:
```
SENDGRID_API_KEY=SG.your_sendgrid_key
```

**Setup Steps**:
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify sender email
3. Generate API key
4. Add to environment variables

## API Endpoints Implemented

### Authentication (Already Working)
- `GET /api/auth/user` - Get current user info
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user

### Email Management
- `POST /api/emails/scan` - Scan Gmail inbox for senders
- `GET /api/emails/senders` - Get categorized email senders
- `PUT /api/emails/senders/:id/category` - Update sender category

### User Preferences
- `GET /api/preferences` - Get user's notification preferences
- `POST /api/preferences` - Save notification preferences

### Voice Calls
- `POST /api/calls/outbound` - Make outbound voice call
- `GET /api/calls/logs` - Get call history

### Setup Status
- `GET /api/setup/status` - Check which APIs are configured

## Database Structure

I've created a complete PostgreSQL schema with the following tables:
- `users` - User accounts (Replit Auth)
- `email_senders` - Discovered email senders from inbox scan
- `user_preferences` - User's notification preferences per category
- `call_logs` - History of voice calls made
- `user_tokens` - OAuth tokens for email providers
- `sessions` - User session storage

## Testing the APIs

Once you provide the API keys, you can test each service:

1. **Check setup status**:
   ```bash
   curl https://your-app.replit.app/api/setup/status
   ```

2. **Scan emails** (requires Gmail setup):
   ```bash
   curl -X POST https://your-app.replit.app/api/emails/scan
   ```

3. **Make test call** (requires Twilio setup):
   ```bash
   curl -X POST https://your-app.replit.app/api/calls/outbound \
     -d '{"phoneNumber":"+1234567890","callType":"test","emailCount":5}'
   ```

## Cost Estimates

### Twilio Voice
- Phone number: $1/month
- Outbound calls: ~$0.0085/minute
- Estimated monthly cost for 50 calls: ~$5-10

### OpenAI
- Email categorization: ~$0.01 per 100 emails
- Voice script generation: ~$0.005 per call
- Estimated monthly cost: ~$5-15

### Gmail API
- Free up to 1 billion quota units/day
- No cost for typical usage

### SendGrid
- Free tier: 100 emails/day
- No cost for basic notifications

## Next Steps

1. **Provide the API keys above** - I'll help you set them up
2. **Test email scanning** - Once Gmail is configured
3. **Test voice calls** - Once Twilio is configured
4. **Configure user preferences** - Set up call timing and frequency

The backend infrastructure is complete and ready to connect to these external services. Which API would you like to set up first?