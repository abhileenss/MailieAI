# Technical Documentation

*For developers who want to understand how PookAi works under the hood*

## Architecture Overview

PookAi is built as a modern web application with a focus on privacy, performance, and user experience.

### Technology Stack

**Frontend**
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript for better development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - High-quality component library
- **Framer Motion** - Smooth animations and interactions
- **Wouter** - Lightweight client-side routing

**Backend** (Coming in Phase 2)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Reliable database for production
- **Redis** - Caching and session management
- **JWT** - Secure authentication tokens

**Infrastructure**
- **Vite** - Fast development and build tool
- **Replit** - Development and hosting platform
- **Cloud deployment** - Auto-scaling and reliability

## Project Structure

```
pookai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components for routing
│   │   ├── data/          # Mock data and type definitions
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configs
├── server/                # Backend API (Phase 2)
├── shared/               # Shared types and schemas
├── components/           # Additional UI components
└── docs/                # Documentation files
```

### Component Architecture

**Core Components**
- `Navigation` - Responsive navigation with mobile menu
- `SEOHead` - Dynamic meta tag management
- `EmailPreview` - Email sender preview interface
- `SenderCard` - Individual email sender display
- `VoiceInput` - Voice interaction interface (future)

**Page Components**
- `Landing` - Marketing homepage with feature overview
- `EmailScan` - Email categorization interface
- `Personalization` - User preference configuration
- `CallConfig` - Voice settings and scheduling
- `FinalSetup` - Onboarding completion

## Data Models

### Email Sender
```typescript
interface EmailSender {
  id: string;
  name: string;
  email: string;
  domain: string;
  count: number;
  latestSubject: string;
  latestDate: string;
  latestPreview: string;
  category: CategoryType;
  avatar?: string;
  type: SenderType;
}
```

### User Preferences
```typescript
interface UserPreferences {
  urgentFinancial: boolean;
  investorUpdates: boolean;
  customerIssues: boolean;
  teamUrgent: boolean;
  partnershipDeals: boolean;
  productLaunches: boolean;
  meetingReminders: MeetingConfig;
}
```

### Meeting Configuration
```typescript
interface MeetingConfig {
  timing: '15-minutes' | '30-minutes' | '1-hour' | '2-hours' | '1-day';
  frequency: 'all-meetings' | 'important-only' | 'external-only' | 'investor-calls';
  method: 'call-only' | 'digest-only' | 'call-and-digest';
}
```

## State Management

### Current Implementation (Phase 1)
- **Component State** - Using React hooks for local state
- **URL State** - Navigation state managed by Wouter
- **Form State** - ShadCN form components with validation

### Future Implementation (Phase 2)
- **Global State** - TanStack Query for server state
- **Local Storage** - User preferences and session data
- **Cache Management** - Optimistic updates and invalidation

## API Design (Phase 2)

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Email Management
```
GET    /api/senders              # List user's email senders
POST   /api/senders/scan         # Trigger email scan
PUT    /api/senders/:id/category # Update sender category
POST   /api/senders/bulk-update  # Bulk category updates
```

### User Preferences
```
GET  /api/preferences      # Get user preferences
PUT  /api/preferences      # Update preferences
POST /api/preferences/reset # Reset to defaults
```

### Voice Calls
```
GET  /api/calls            # Call history
POST /api/calls/schedule   # Schedule urgent call
GET  /api/calls/next       # Next scheduled call
```

## Security Implementation

### Frontend Security
- **Input Validation** - All user inputs validated
- **XSS Protection** - Sanitized content rendering
- **HTTPS Only** - All communications encrypted
- **CSP Headers** - Content Security Policy protection

### Backend Security (Phase 2)
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - API abuse prevention
- **Input Sanitization** - SQL injection prevention
- **Encryption at Rest** - Database encryption

### Email Provider Integration
- **OAuth 2.0** - Secure authorization flow
- **Minimal Permissions** - Read-only email access
- **Token Encryption** - Encrypted credential storage
- **Automatic Revocation** - User-controlled access removal

## Performance Optimization

### Frontend Performance
- **Code Splitting** - Lazy loading of page components
- **Image Optimization** - Compressed and responsive images
- **Bundle Analysis** - Tree shaking and dead code elimination
- **Caching Strategy** - Browser caching for static assets

### Backend Performance (Phase 2)
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections
- **Caching Layer** - Redis for frequently accessed data
- **Background Jobs** - Async processing for heavy tasks

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Environment Variables
```bash
# Development
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development

# Production (Phase 2)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

### Testing Strategy (Phase 2)
- **Unit Tests** - Component and function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Full user journey testing
- **Performance Tests** - Load and stress testing

## Deployment

### Current Deployment (Phase 1)
- **Replit Hosting** - Integrated development and hosting
- **Automatic Updates** - Hot reloading in development
- **Domain Configuration** - Custom domain support

### Production Deployment (Phase 2)
- **Docker Containers** - Consistent deployment environment
- **Load Balancing** - High availability setup
- **Auto Scaling** - Dynamic resource allocation
- **Monitoring** - Application and infrastructure monitoring

## Database Schema (Phase 2)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Email Senders Table
```sql
CREATE TABLE email_senders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  category VARCHAR(50) DEFAULT 'unassigned',
  email_count INTEGER DEFAULT 0,
  latest_subject TEXT,
  latest_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  urgent_financial BOOLEAN DEFAULT true,
  investor_updates BOOLEAN DEFAULT true,
  customer_issues BOOLEAN DEFAULT true,
  meeting_reminder_timing VARCHAR(20) DEFAULT '30-minutes',
  meeting_reminder_frequency VARCHAR(20) DEFAULT 'all-meetings',
  meeting_reminder_method VARCHAR(20) DEFAULT 'call-and-digest',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## External Integrations

### Email Providers
- **Gmail API** - OAuth 2.0 integration for Google accounts
- **Outlook API** - Microsoft Graph API for Outlook accounts
- **IMAP Support** - Generic email provider support

### Voice Services
- **OpenAI TTS** - Natural voice generation
- **Twilio Voice** - Phone call delivery
- **Speech Recognition** - Voice command processing

### Calendar Integration
- **Google Calendar** - Meeting and event sync
- **Outlook Calendar** - Microsoft calendar integration
- **CalDAV Support** - Generic calendar protocol

## Error Handling

### Frontend Error Handling
- **Error Boundaries** - React component error catching
- **Form Validation** - Real-time input validation
- **Network Errors** - Graceful API failure handling
- **User Feedback** - Clear error messages

### Backend Error Handling (Phase 2)
- **Structured Errors** - Consistent error response format
- **Logging** - Comprehensive error logging
- **Monitoring** - Real-time error tracking
- **Recovery** - Automatic retry mechanisms

## Contributing Guidelines

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting and formatting
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks for quality

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and approval
6. Merge to main branch

### Development Setup
```bash
# Clone repository
git clone https://github.com/pookai/pookai.git

# Install dependencies
cd pookai
npm install

# Start development
npm run dev

# Run tests
npm test
```

## Monitoring and Analytics (Phase 2)

### Application Monitoring
- **Performance Metrics** - Response times and throughput
- **Error Tracking** - Real-time error monitoring
- **User Analytics** - Usage patterns and behavior
- **Uptime Monitoring** - Service availability tracking

### Business Metrics
- **User Engagement** - Feature usage and retention
- **Email Processing** - Volume and categorization accuracy
- **Voice Calls** - Delivery success and user satisfaction
- **Support Tickets** - Common issues and resolution times

---

*This technical documentation covers the current implementation and planned features for Phase 2 development.*