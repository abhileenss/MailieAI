# PookAi Frontend MVP Documentation

## Overview
PookAi is a voice-first AI concierge for founders that transforms inbox chaos into personalized daily call summaries. The frontend provides an intuitive onboarding flow for email categorization and preference configuration.

## Core Features Implemented

### 1. Landing Page (`/`)
- **Purpose**: Convert visitors with founder-focused messaging
- **Key Elements**: 
  - Hero section with "Founder's Concierge" positioning
  - Value proposition focused on inbox chaos management
  - Call-to-action for email scanning
- **Design**: Dark-mode first with gradient accents

### 2. Email Scan & Categorization (`/email-scan`)
- **Purpose**: Unroll.me-style sender management interface
- **Layout**: Two-panel design (sender list + email preview)
- **Functionality**:
  - Display realistic founder-relevant email senders (Stripe, Y Combinator, GitHub, etc.)
  - Category assignment with quirky founder-focused buckets:
    - "Call Me For This" (urgent)
    - "Remind Me About This" (digest)
    - "Keep But Don't Care" (archive)
    - "Why Did I Sign Up For This?" (promotional)
    - "Don't Tell Anyone" (private)
    - "Unassigned" (default)
  - Real-time progress tracking
  - Email preview with sender details

### 3. Smart Personalization (`/personalization`)
- **Purpose**: Zero-friction preference configuration
- **Features**:
  - Smart founder defaults (pre-selected urgent categories)
  - Two-section toggle interface:
    - "Call Me Immediately" (financial alerts, investor updates, customer issues)
    - "Daily Digest" (partnerships, product updates)
  - Meeting reminder configuration:
    - Timing options (15 min to 1 day before)
    - Frequency selection (all meetings, important only, etc.)
    - Delivery method (call, digest, or both)
  - Real-time summary with dynamic counts

### 4. Call Configuration (`/call-config`)
- **Purpose**: Voice settings preview (marked as "Coming Soon")
- **Elements**:
  - Voice selection interface
  - Call timing preferences
  - Setup completion flow

### 5. Final Setup (`/final-setup`)
- **Purpose**: Onboarding completion and next steps
- **Features**:
  - Configuration summary
  - Success state with next call preview
  - Agent task status display

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS + ShadCN UI components
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: TanStack Query (prepared for backend integration)

### Key Components

#### UI Components (`/components/ui/`)
- Complete ShadCN component library
- Dark mode optimized
- Accessible form controls
- Custom animations and interactions

#### Feature Components (`/components/`)
- `EmailPreview`: Displays sender details and category assignment
- `SenderCard`: Individual sender item with selection state
- `VoiceInput`: Placeholder for voice interaction (future)
- `VoiceSelector`: Voice selection interface

#### Data Layer (`/data/mock-data.ts`)
- Realistic founder-focused email senders
- Category definitions with personality-driven copy
- Voice options and agent task structures
- Suggestion algorithms for smart defaults

### User Experience Flow
1. **Landing** → Value proposition and CTA
2. **Email Scan** → Categorize email senders (core UX)
3. **Personalization** → Smart defaults with quick toggles
4. **Call Config** → Voice preferences (coming soon)
5. **Final Setup** → Completion and next steps

## Key UX Decisions

### Friction Reduction
- Eliminated text fields in favor of toggle buttons
- Pre-selected smart defaults based on founder patterns
- Real-time feedback and progress indicators
- Connected user journey (each page builds on previous)

### Founder-Centric Design
- Industry-specific email senders (Stripe, YC, GitHub)
- Quirky category names that resonate with startup culture
- Urgent vs. digest categorization matching founder priorities
- Meeting reminder system for busy schedules

### Visual Design
- Dark-mode first for late-night founder sessions
- Gradient accents for premium feel
- Smooth animations for engagement
- Clear visual hierarchy and information density

## State Management

### Current Implementation
- Component-level state with React hooks
- No global state management (suitable for MVP scope)
- Form state handled by ShadCN form components

### Data Flow
- Mock data provides realistic content
- Category assignments stored in component state
- Preferences flow between pages via URL navigation
- Real-time updates reflect user choices immediately

## Responsive Design
- Mobile-first approach with responsive breakpoints
- Grid layouts adapt to screen sizes
- Touch-friendly interactions
- Optimized for both desktop and mobile founder workflows

## Performance Considerations
- Lazy loading for route components
- Optimized animations with Framer Motion
- Minimal bundle size with tree-shaking
- Fast development server with Vite

## Future Enhancements (Post-MVP)
- Voice interaction implementation
- Real-time call scheduling
- Email provider integrations
- Advanced AI categorization
- Analytics dashboard
- Team collaboration features