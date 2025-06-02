import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Settings, 
  Phone, 
  Mail, 
  Users, 
  Clock, 
  Target, 
  Zap,
  Brain,
  User,
  Mic,
  Bell,
  Calendar,
  Shield,
  LogOut,
  ChevronRight,
  Volume2,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface UserPreference {
  senderId: string;
  category: string;
  enableCalls: boolean;
  enableSMS: boolean;
  priority: 'high' | 'medium' | 'low' | 'none';
  customNotes?: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: emailData } = useQuery({
    queryKey: ['/api/emails/processed'],
    enabled: !!user
  });

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'emails', label: 'Email Management', icon: Mail },
    { id: 'voice', label: 'Voice Settings', icon: Mic },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'schedule', label: 'Call Schedule', icon: Calendar },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'account', label: 'Account', icon: User }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {(user as any)?.email?.split('@')[0]}
        </h1>
        <p className="text-xl text-gray-300 font-medium">
          Your AI concierge has processed <span className="text-orange-400 font-bold">{(emailData as any)?.totalSenders || 0} senders</span> and is ready to help you stay organized.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="group bg-zinc-900 border-zinc-800 rounded-xl p-6 hover:border-orange-400/40 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-semibold mb-2">Total Senders</p>
                <p className="text-3xl font-black text-white">
                  {(emailData as any)?.totalSenders || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-green-300/20 rounded-2xl p-6 hover:border-green-300/40 hover:from-white/15 hover:to-white/8 transition-all duration-500 hover:scale-105">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-semibold mb-2">Call-Me Priority</p>
                <p className="text-3xl font-black text-white">
                  {(emailData as any)?.categorizedSenders?.['call-me']?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-shadow duration-300">
                <Phone className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-pink-300/20 rounded-2xl p-6 hover:border-pink-300/40 hover:from-white/15 hover:to-white/8 transition-all duration-500 hover:scale-105">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-semibold mb-2">Remind-Me</p>
                <p className="text-3xl font-black text-white">
                  {(emailData as any)?.categorizedSenders?.['remind-me']?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-shadow duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-blue-300/20 rounded-2xl p-6 hover:border-blue-300/40 hover:from-white/15 hover:to-white/8 transition-all duration-500 hover:scale-105">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-2">Newsletters</p>
                <p className="text-3xl font-black text-white">
                  {(emailData as any)?.categorizedSenders?.['newsletter']?.length || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-300/20 rounded-3xl p-8 hover:border-purple-300/30 transition-all duration-500">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                onClick={() => setActiveSection('emails')}
                className="group bg-gradient-to-br from-white/5 to-white/0 border border-purple-300/20 rounded-2xl p-6 hover:border-purple-300/40 hover:from-white/10 hover:to-white/5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-shadow duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-semibold">Manage Categories</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => setActiveSection('voice')}
                className="group bg-gradient-to-br from-white/5 to-white/0 border border-green-300/20 rounded-2xl p-6 hover:border-green-300/40 hover:from-white/10 hover:to-white/5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/25 transition-shadow duration-300">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-semibold">Voice Settings</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => setActiveSection('schedule')}
                className="group bg-gradient-to-br from-white/5 to-white/0 border border-blue-300/20 rounded-2xl p-6 hover:border-blue-300/40 hover:from-white/10 hover:to-white/5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-semibold">Schedule Calls</span>
                </div>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderVoiceSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your AI voice assistant for personalized call summaries.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voice Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Current Voice</label>
            <Select defaultValue="morgan-freeman">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morgan-freeman">Morgan Freeman - Deep, authoritative voice</SelectItem>
                <SelectItem value="naval-ravikant">Naval Ravikant - Calm, philosophical tone</SelectItem>
                <SelectItem value="joe-rogan">Joe Rogan - Conversational, engaging style</SelectItem>
                <SelectItem value="andrew-schulz">Andrew Schulz - Energetic, direct delivery</SelectItem>
                <SelectItem value="amitabh-bachchan">Amitabh Bachchan - Distinguished, commanding presence</SelectItem>
                <SelectItem value="priyanka-chopra">Priyanka Chopra - Professional, clear articulation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Speaking Speed</label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Voice Style</label>
              <Select defaultValue="professional">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Custom Instructions</label>
            <Textarea 
              placeholder="Add any specific instructions for how you'd like your AI assistant to communicate..."
              className="min-h-[100px]"
            />
          </div>

          <Button className="w-full md:w-auto">
            <Mic className="w-4 h-4 mr-2" />
            Test Voice
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmailManagement = () => {
    const categories = {
      'call-me': { 
        name: 'Call Me For This', 
        description: 'High priority emails that need immediate attention',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10'
      },
      'remind-me': { 
        name: 'Remind Me Later', 
        description: 'Important but not urgent emails',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10'
      },
      'keep-quiet': { 
        name: 'Keep Quiet', 
        description: 'Low priority emails, minimal notifications',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10'
      },
      'newsletter': { 
        name: 'Newsletters', 
        description: 'Subscriptions and regular updates',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10'
      },
      'why-did-i-signup': { 
        name: 'Why Did I Sign Up?', 
        description: 'Subscriptions you might want to unsubscribe from',
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10'
      },
      'dont-tell-anyone': { 
        name: "Don't Tell Anyone", 
        description: 'Personal or sensitive emails',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10'
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Sender Management</h2>
          <p className="text-muted-foreground mt-2">
            Review AI suggestions for your {(emailData as any)?.totalSenders || 0} email senders. You have final approval on all categorizations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const senders = (emailData as any)?.categorizedSenders?.[categoryKey] || [];
            
            return (
              <Card key={categoryKey} className="neopop-card bg-surface border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-3 h-3 rounded-full ${categoryInfo.bgColor}`}></div>
                    <Badge variant="secondary" className="text-xs">
                      {senders.length}
                    </Badge>
                  </div>
                  <CardTitle className={`text-lg ${categoryInfo.color}`}>
                    {categoryInfo.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {categoryInfo.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {senders.slice(0, 8).map((sender: EmailSender) => (
                      <motion.div 
                        key={sender.id} 
                        className="p-3 bg-surface-elevated rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white truncate">{sender.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{sender.domain}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {sender.emailCount} emails • {new Date(sender.lastEmailDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {senders.length > 8 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-muted-foreground hover:text-white"
                      >
                        View {senders.length - 8} more senders
                      </Button>
                    )}
                    
                    {senders.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No senders in this category yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="neopop-card bg-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5" />
              Bulk Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Auto-categorize New Senders
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Export All Categories
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Refresh AI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Control when and how you receive alerts about important emails.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voice Calls for Urgent Emails</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive immediate voice alerts for call-me category</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Text message alerts for high-priority emails</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Email Summary</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Morning voice summary of all categorized emails</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Phone Number for Voice Calls</label>
            <Input 
              type="tel" 
              placeholder="+1 (555) 123-4567"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Desktop Setup Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please use a desktop or laptop to configure your PookAi settings. 
              Once set up, you can view a simplified dashboard on mobile.
            </p>
            <Button onClick={logout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">PookAi</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {(user as any)?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400">
                {(user as any)?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'emails' && renderEmailManagement()}
          {activeSection === 'voice' && renderVoiceSettings()}
          {activeSection === 'notifications' && renderNotifications()}
          {activeSection === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Call Schedule</h2>
              <p className="text-gray-300">Schedule management coming soon...</p>
            </div>
          )}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Preferences</h2>
              <p className="text-gray-300">Advanced preferences coming soon...</p>
            </div>
          )}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Account Settings</h2>
              <p className="text-gray-300">Account management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}