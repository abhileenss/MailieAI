# Mailie - AI-Powered Email Intelligence Platform

An intelligent communication management platform that transforms startup founders' email workflows through AI-powered smart categorization, personalized communication strategies, and dynamic user engagement.

## Vision

Mailie revolutionizes how entrepreneurs manage their email communication by providing intelligent, AI-driven insights that help prioritize what matters most. Built specifically for startup founders who receive hundreds of emails daily, Mailie categorizes, analyzes, and provides actionable intelligence on every message.

The platform combines real-time Gmail integration with advanced OpenAI analysis to deliver personalized email management strategies, ensuring that critical communications are never missed while reducing noise from less important messages.

## Core Value Proposition

- **Intelligent Email Triage**: AI automatically categorizes emails into actionable buckets
- **Startup-Focused Categories**: Custom categories designed for entrepreneurial workflows
- **Real-Time Processing**: Immediate analysis and categorization of incoming emails  
- **Voice-Enabled Responses**: Personalized communication preferences and voice settings
- **Analytics Dashboard**: Comprehensive insights into email patterns and sender behavior

## Features

- **Real Gmail Integration** - Secure OAuth2 authentication with Gmail API
- **AI-Powered Categorization** - OpenAI GPT-4 analysis of email content and sentiment
- **Interactive Dashboard** - Modern React UI with real-time email processing
- **Smart Categories** - Call-me, Remind-me, Keep-quiet, Why-did-I-signup, Don't-tell-anyone
- **Voice Settings** - Personalized communication preferences
- **PostgreSQL Database** - Comprehensive data persistence and analytics

## Technology Stack

- **Frontend**: React 18, TypeScript, ShadCN UI, Framer Motion, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth + Gmail OAuth2
- **AI**: OpenAI GPT-4 for email analysis
- **APIs**: Gmail API, Google OAuth2

## Complete Local Setup Guide

### Step 1: Prerequisites
- Node.js 20+ installed
- Docker and Docker Compose installed
- Git for cloning the repository

### Step 2: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API" and enable it
4. Configure OAuth consent screen:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in app name, user support email, and developer contact
   - Add your email as a test user if in testing mode
5. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins: `http://localhost:5000`
   - Add authorized redirect URIs: `http://localhost:5000/api/auth/gmail/callback`
   - Save the Client ID and Client Secret

### Step 3: OpenAI API Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API keys section
4. Create a new API key and save it securely

### Step 4: Clone and Configure
```bash
# Clone the repository
git clone <your-repository-url>
cd mailie

# Create environment file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mailie
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
POSTGRES_PASSWORD=secure_postgres_password
SESSION_SECRET=your_secure_session_secret_here
EOF
```

### Step 5: Run with Docker (Recommended)
```bash
# Start all services (app + database)
docker-compose up -d

# Check if services are running
docker-compose ps

# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres
```

The application will be available at http://localhost:5000

### Step 6: Testing the Application
1. Open http://localhost:5000 in your browser
2. Click "Login" to authenticate with Replit
3. After login, click "Connect Gmail Account"
4. Authorize Gmail access in the popup
5. Wait for email processing to complete (may take 5-10 minutes)
6. View your categorized emails in the dashboard

### Alternative: Local Development Setup
If you prefer running without Docker:

```bash
# Install dependencies
npm install

# Start PostgreSQL database only
docker-compose up -d postgres

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

### Troubleshooting
- **OAuth Error**: Ensure redirect URIs match exactly in Google Cloud Console
- **Database Connection**: Check PostgreSQL is running with `docker-compose ps`
- **API Rate Limits**: OpenAI has token limits - processing will pause and resume automatically
- **Gmail Permissions**: Make sure your email is added as a test user in Google OAuth consent screen

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose
- Google Cloud Console project with Gmail API enabled
- OpenAI API key

### Environment Variables
Create a `.env` file:
```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mailie
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
POSTGRES_PASSWORD=your_postgres_password
SESSION_SECRET=your_session_secret
```

### Run with Docker Compose
```bash
# Clone and navigate to project
git clone <your-repo>
cd mailie

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

The application will be available at http://localhost:5000

### Manual Docker Build
```bash
# Build image
docker build -t mailie .

# Run with environment variables
docker run -p 5000:5000 \
  -e DATABASE_URL=your_db_url \
  -e GOOGLE_CLIENT_ID=your_client_id \
  -e GOOGLE_CLIENT_SECRET=your_client_secret \
  -e OPENAI_API_KEY=your_openai_key \
  mailie
```

## Google OAuth Setup

1. **Google Cloud Console** → Create new project
2. **Enable Gmail API** → APIs & Services → Library
3. **OAuth Consent Screen** → Configure app details
4. **Credentials** → Create OAuth 2.0 Client ID

### Required OAuth URLs
**Authorized JavaScript Origins:**
- `http://localhost:5000` (development)
- `https://your-domain.com` (production)

**Authorized Redirect URIs:**
- `http://localhost:5000/api/auth/gmail/callback` (development)
- `https://your-domain.com/api/auth/gmail/callback` (production)

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables configured

### Local Development
```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Production Build
```bash
# Build application
npm run build

# Start production server
npm start
```

## Database Schema

The application uses a comprehensive PostgreSQL schema with:
- User management and authentication
- Gmail OAuth token storage
- Email messages and metadata
- AI categorization results
- User preferences and voice settings
- Email processing batches and analytics

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Replit OAuth login
- `GET /api/callback` - OAuth callback

### Gmail Integration
- `GET /api/gmail/auth` - Initiate Gmail OAuth
- `GET /api/gmail/status` - Check Gmail connection
- `GET /api/auth/gmail/callback` - Gmail OAuth callback

### Email Processing
- `POST /api/emails/scan-and-process` - Scan and categorize emails
- `GET /api/emails/processed` - Get processed email senders
- `PATCH /api/emails/sender/:id/category` - Update sender category

## Deployment Notes

### Google OAuth Production
- Change OAuth consent screen from "Testing" to "Production"
- Submit for Google verification (required for Gmail access)
- Add privacy policy and terms of service URLs

### Environment Configuration
- Use secure session secrets in production
- Configure proper PostgreSQL connection strings
- Set up SSL certificates for HTTPS

### Rate Limiting
- OpenAI API has token limits (30,000 tokens/minute for GPT-4)
- Implement batching for large email volumes
- Consider caching for frequently accessed data

## Security Features

- OAuth2 authentication flow with CSRF protection
- Session-based state management
- Secure token storage in PostgreSQL
- Environment variable configuration
- Input validation and sanitization

## Performance

- Processes 200+ emails efficiently
- Real-time AI categorization
- Optimized database queries with proper indexing
- Responsive UI with loading states

## License

MIT License - Built for hackathon evaluation in 72 hours.