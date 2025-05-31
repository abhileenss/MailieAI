export interface EmailSender {
  id: string;
  name: string;
  email: string;
  domain: string;
  count: number;
  latestSubject: string;
  latestDate: string;
  latestPreview: string;
  category: 'call-me' | 'remind-me' | 'keep-quiet' | 'why-did-i-signup' | 'dont-tell-anyone' | 'unassigned';
  avatar?: string;
  type: 'newsletter' | 'tool' | 'meeting' | 'promotional' | 'personal';
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'female' | 'male' | 'neutral';
  color: string;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'waiting';
  details: string[];
}

export const mockEmailSenders: EmailSender[] = [
  {
    id: '1',
    name: 'Morning Brew',
    email: 'crew@morningbrew.com',
    domain: 'morningbrew.com',
    count: 47,
    latestSubject: 'Meta\'s AI strategy is working, Tesla\'s isn\'t',
    latestDate: '2 hours ago',
    latestPreview: 'Meta reported strong Q4 earnings yesterday, driven largely by its Reality Labs division finally turning...',
    category: 'unassigned',
    type: 'newsletter'
  },
  {
    id: '2',
    name: 'Calendly',
    email: 'notifications@calendly.com',
    domain: 'calendly.com',
    count: 23,
    latestSubject: 'New meeting booked: Investor Pitch - Sarah Chen',
    latestDate: '30 minutes ago',
    latestPreview: 'Sarah Chen has booked a 30-minute meeting with you for tomorrow at 2:00 PM PST. Meeting details...',
    category: 'unassigned',
    type: 'meeting'
  },
  {
    id: '3',
    name: 'Stripe',
    email: 'receipts@stripe.com',
    domain: 'stripe.com',
    count: 15,
    latestSubject: 'Payment received: $2,500.00 from Acme Corp',
    latestDate: '1 hour ago',
    latestPreview: 'You received a payment of $2,500.00 from Acme Corp for Invoice #INV-2025-001234...',
    category: 'unassigned',
    type: 'tool'
  },
  {
    id: '4',
    name: 'Notion',
    email: 'team@makenotion.com',
    domain: 'notion.so',
    count: 31,
    latestSubject: '3 updates in "Q1 2025 Product Roadmap"',
    latestDate: '4 hours ago',
    latestPreview: 'Alex updated the timeline, Sarah added 2 new feature requests, and Mike commented on the mobile app section...',
    category: 'unassigned',
    type: 'tool'
  },
  {
    id: '5',
    name: 'TechCrunch',
    email: 'newsletter@techcrunch.com',
    domain: 'techcrunch.com',
    count: 19,
    latestSubject: 'The Station: Autonomous vehicles hit another speed bump',
    latestDate: '3 hours ago',
    latestPreview: 'Welcome back to The Station, your central hub for all past, present and future means of moving people...',
    category: 'unassigned',
    type: 'newsletter'
  },
  {
    id: '6',
    name: 'GitHub',
    email: 'noreply@github.com',
    domain: 'github.com',
    count: 42,
    latestSubject: '[pookai/frontend] New issue opened: Voice input not working on Safari',
    latestDate: '20 minutes ago',
    latestPreview: 'user_dev_123 opened a new issue: The voice input component fails to initialize on Safari 17.2...',
    category: 'unassigned',
    type: 'tool'
  },
  {
    id: '7',
    name: 'ProductHunt Daily',
    email: 'hello@producthunt.com',
    domain: 'producthunt.com',
    count: 28,
    latestSubject: 'Today\'s top products: 5 AI tools that will change your workflow',
    latestDate: '6 hours ago',
    latestPreview: 'Discover the latest launches including VoiceFlow 2.0, DataLens AI, and 3 other products that caught our attention...',
    category: 'unassigned',
    type: 'newsletter'
  },
  {
    id: '8',
    name: 'Shopify Partners',
    email: 'partners@shopify.com',
    domain: 'shopify.com',
    count: 8,
    latestSubject: 'Your November commission: $1,247.83 is ready',
    latestDate: '1 day ago',
    latestPreview: 'Great news! Your commission for November 2024 is ready for payout. You earned $1,247.83 from 3 client referrals...',
    category: 'unassigned',
    type: 'promotional'
  },
  {
    id: '9',
    name: 'Y Combinator',
    email: 'blog@ycombinator.com',
    domain: 'ycombinator.com',
    count: 12,
    latestSubject: 'Startup School: How to validate your idea in 30 days',
    latestDate: '2 days ago',
    latestPreview: 'This week in Startup School, we\'re covering the most crucial step in building a successful startup: validation...',
    category: 'unassigned',
    type: 'newsletter'
  },
  {
    id: '10',
    name: 'LinkedIn',
    email: 'messages-noreply@linkedin.com',
    domain: 'linkedin.com',
    count: 156,
    latestSubject: 'You have 3 new messages and 12 connection requests',
    latestDate: '5 hours ago',
    latestPreview: 'Sarah Johnson wants to connect, Mike Chen sent you a message about partnership opportunities...',
    category: 'unassigned',
    type: 'promotional'
  }
];

export const mockVoiceOptions: VoiceOption[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    description: 'Professional, warm tone',
    gender: 'female',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Clear, authoritative voice',
    gender: 'male',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'morgan',
    name: 'Morgan',
    description: 'Friendly, conversational',
    gender: 'neutral',
    color: 'from-green-500 to-teal-500'
  }
];

export const mockAgentTasks: AgentTask[] = [
  {
    id: '1',
    title: 'Scan Recent Emails',
    description: 'Analyze your inbox for important updates',
    status: 'completed',
    details: [
      '✓ Processed 47 emails',
      '✓ Identified 3 priority items',
      '✓ Detected 2 meeting conflicts'
    ]
  },
  {
    id: '2',
    title: 'Prepare Call Script',
    description: 'Generate personalized daily briefing',
    status: 'in-progress',
    details: [
      '✓ Customer support priority identified',
      '⏳ Meeting reminders prepared',
      '⏳ Newsletter digest compiled'
    ]
  },
  {
    id: '3',
    title: 'Schedule Daily Call',
    description: 'Call you at 9:00 AM PST tomorrow',
    status: 'pending',
    details: [
      '⏳ Waiting for scheduled time',
      '⏳ Voice synthesis ready',
      '⏳ Call duration: ~2-3 minutes'
    ]
  },
  {
    id: '4',
    title: 'Post-Call Analysis',
    description: 'Analyze call feedback and improve',
    status: 'waiting',
    details: []
  }
];

export const categoryBuckets = [
  {
    id: 'call-me',
    title: 'Call Me For This',
    description: 'Wake me up at 3am if needed',
    color: 'bg-red-500/20 text-red-400 border-red-500/50'
  },
  {
    id: 'remind-me',
    title: 'Remind Me For This',
    description: 'Daily summary is fine',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
  },
  {
    id: 'keep-quiet',
    title: 'Keep But Don\'t Care',
    description: 'Archive, I\'ll check when I need to',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  },
  {
    id: 'why-did-i-signup',
    title: 'Why Did I Sign Up For This?',
    description: 'Auto-unsubscribe please',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
  },
  {
    id: 'dont-tell-anyone',
    title: 'Don\'t Tell Anyone',
    description: 'Hide these emails from my team',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
  }
];

export const mockSuggestions = [
  {
    id: 'customer-support',
    title: 'Customer Complaints & Support',
    description: 'Call me immediately for unhappy customers'
  },
  {
    id: 'investor-updates',
    title: 'Investor Communications',
    description: 'VCs, angels, and board members get priority'
  },
  {
    id: 'revenue-alerts',
    title: 'Revenue & Payment Alerts',
    description: 'Stripe, PayPal, and sales notifications'
  },
  {
    id: 'team-urgent',
    title: 'Team Urgent Issues',
    description: 'When the app breaks or servers are down'
  }
];
