export interface EmailSummary {
  id: string;
  type: 'newsletters' | 'meetings' | 'spam' | 'events';
  title: string;
  count: number;
  icon: string;
  color: string;
  description: string;
  examples: string[];
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

export const mockEmailSummaries: EmailSummary[] = [
  {
    id: 'newsletters',
    type: 'newsletters',
    title: 'Newsletter Subscriptions',
    count: 47,
    icon: 'fas fa-newspaper',
    color: 'blue',
    description: 'Daily newsletters cluttering your inbox',
    examples: ['Morning Brew', 'TechCrunch', '+45 more']
  },
  {
    id: 'meetings',
    type: 'meetings',
    title: 'Missed Meetings',
    count: 12,
    icon: 'fas fa-calendar-times',
    color: 'red',
    description: 'Meetings you may have overlooked',
    examples: ['Team Standup', 'Client Call', '+10 more']
  },
  {
    id: 'spam',
    type: 'spam',
    title: 'Spam Sources',
    count: 23,
    icon: 'fas fa-exclamation-triangle',
    color: 'yellow',
    description: 'Promotional emails and spam',
    examples: ['promo@deals.com', 'offers@shop.com', '+21 more']
  },
  {
    id: 'events',
    type: 'events',
    title: 'Upcoming Events',
    count: 8,
    icon: 'fas fa-calendar-plus',
    color: 'green',
    description: 'Conferences, workshops, and events',
    examples: ['DevCon 2024', 'AI Summit', '+6 more']
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

export const mockSuggestions = [
  {
    id: 'customer-support',
    title: 'Customer Support Priority',
    description: 'Alert me about customer complaints'
  },
  {
    id: 'meeting-reminders',
    title: 'Meeting Reminders',
    description: '15 minutes before important meetings'
  },
  {
    id: 'newsletter-digest',
    title: 'Newsletter Digest',
    description: 'Weekly summary of subscriptions'
  },
  {
    id: 'vip-contacts',
    title: 'VIP Contacts',
    description: 'Immediate alerts from key people'
  }
];
