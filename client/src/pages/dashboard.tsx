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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {(user as any)?.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground mt-2">
          Your intelligent email concierge is ready to help you stay organized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="neopop-card bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary text-sm font-medium">Total Senders</p>
                <p className="text-2xl font-bold text-white">
                  {(emailData as any)?.totalSenders || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Call-Me Priority</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {(emailData as any)?.categorizedSenders?.['call-me']?.length || 0}
                </p>
              </div>
              <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Remind-Me</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {emailData?.categorizedSenders?.['remind-me']?.length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Newsletters</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {emailData?.categorizedSenders?.['newsletter']?.length || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
              onClick={() => setActiveSection('emails')}
            >
              <Mail className="w-6 h-6" />
              <span>Manage Categories</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
              onClick={() => setActiveSection('voice')}
            >
              <Mic className="w-6 h-6" />
              <span>Voice Settings</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center gap-2"
              onClick={() => setActiveSection('schedule')}
            >
              <Calendar className="w-6 h-6" />
              <span>Schedule Calls</span>
            </Button>
          </div>
        </CardContent>
      </Card>
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

  const renderEmailManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fine-tune how your emails are categorized and prioritized.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(emailData?.categorizedSenders || {}).map(([category, senders]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize text-lg">
                {category.replace('-', ' ')} ({(senders as EmailSender[]).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(senders as EmailSender[]).slice(0, 5).map((sender) => (
                  <div key={sender.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{sender.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{sender.email}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {sender.emailCount}
                      </Badge>
                    </div>
                  </div>
                ))}
                {(senders as EmailSender[]).length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    View {(senders as EmailSender[]).length - 5} more
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

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
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
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
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-white'
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

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-surface-elevated rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {(user as any)?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground">
                {(user as any)?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-white hover:bg-surface-elevated"
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
              <h2 className="text-2xl font-bold">Call Schedule</h2>
              <p className="text-gray-600 dark:text-gray-400">Schedule management coming soon...</p>
            </div>
          )}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400">Advanced preferences coming soon...</p>
            </div>
          )}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Account management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}