import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Mail, 
  Phone, 
  Filter, 
  BarChart3, 
  Users, 
  PlayCircle,
  Mic,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/sidebar';
import { useAuth } from '@/hooks/useAuth';

interface EmailSender {
  id: string;
  name: string;
  email: string;
  domain: string;
  emailCount: number;
  latestSubject: string;
  lastEmailDate: string;
  category: string;
}

interface ProcessedEmailsResponse {
  success: boolean;
  totalSenders: number;
  categorizedSenders: Record<string, EmailSender[]>;
  categoryStats: Record<string, number>;
}

const quickActions = [
  {
    name: 'Email Discovery',
    description: 'Analyze and discover email senders',
    icon: Mail,
    href: '/discovery',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Voice Calls',
    description: 'Configure AI voice summaries',
    icon: Phone,
    href: '/call-config',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600'
  },
  {
    name: 'Categorization',
    description: 'Organize your email senders',
    icon: Filter,
    href: '/categorization',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Voice Testing',
    description: 'Test AI voice capabilities',
    icon: Mic,
    href: '/voice-test',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    name: 'SMS Alerts',
    description: 'Set up WhatsApp notifications',
    icon: MessageSquare,
    href: '/sms-config',
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    name: 'Analytics',
    description: 'View email and call analytics',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600'
  }
];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    retry: false,
  });

  const stats = [
    {
      label: 'Total Senders',
      value: emailData?.totalSenders || 0,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Categories',
      value: emailData ? Object.keys(emailData.categorizedSenders).length : 0,
      icon: Filter,
      color: 'text-green-500'
    },
    {
      label: 'Total Emails',
      value: emailData ? Object.values(emailData.categorizedSenders).flat().reduce((sum, sender) => sum + sender.emailCount, 0) : 0,
      icon: Mail,
      color: 'text-purple-500'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {getGreeting()}, {user?.firstName || user?.email?.split('@')[0] || 'there'}
              </h1>
              <p className="text-slate-300 mt-1">
                Welcome to your AI-powered email management dashboard
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Quick Setup
              </Button>
              <Button>
                <PlayCircle className="w-4 h-4 mr-2" />
                Test Voice Call
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                          <p className="text-3xl font-bold text-white mt-1">
                            {isLoading ? '...' : stat.value.toLocaleString()}
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={action.href}>
                      <a className="block">
                        <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                          <CardContent className="p-6">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">{action.name}</h3>
                            <p className="text-slate-600 text-sm mb-4">{action.description}</p>
                            <div className="flex items-center text-blue-600 text-sm font-medium">
                              Get started
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Categories Overview */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Email Categories</h3>
                  <Badge variant="secondary">{emailData?.totalSenders || 0} senders</Badge>
                </div>
                
                {emailData && emailData.categoryStats ? (
                  <div className="space-y-3">
                    {Object.entries(emailData.categoryStats).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-slate-700 capitalize">{category.replace('-', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">No email data available</p>
                    <Link href="/discovery">
                      <Button variant="outline" className="mt-3">
                        Start Email Discovery
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Calls */}
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Recent Voice Calls</h3>
                  <Badge variant="secondary">0 today</Badge>
                </div>
                
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No recent calls</p>
                  <Link href="/call-config">
                    <Button variant="outline" className="mt-3">
                      Configure Voice Calls
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}