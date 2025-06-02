import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Settings, 
  User, 
  BarChart3, 
  Calendar,
  Bell,
  Search,
  Filter,
  MoreVertical,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  categorizedSenders: {
    'call-me': EmailSender[];
    'remind-me': EmailSender[];
    'keep-quiet': EmailSender[];
    'newsletter': EmailSender[];
    'why-did-i-signup': EmailSender[];
    'dont-tell-anyone': EmailSender[];
    'unassigned': EmailSender[];
  };
  categoryStats: Record<string, number>;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch processed emails
  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    enabled: true
  });

  const categoryInfo = {
    'call-me': { 
      label: 'Call Me', 
      color: 'bg-red-500', 
      icon: Phone, 
      description: 'Urgent emails requiring immediate attention'
    },
    'remind-me': { 
      label: 'Remind Me', 
      color: 'bg-yellow-500', 
      icon: Bell, 
      description: 'Important reminders and follow-ups'
    },
    'newsletter': { 
      label: 'Newsletters', 
      color: 'bg-blue-500', 
      icon: Mail, 
      description: 'Newsletters and regular updates'
    },
    'why-did-i-signup': { 
      label: 'Why Did I Sign Up?', 
      color: 'bg-purple-500', 
      icon: AlertTriangle, 
      description: 'Subscriptions to review'
    },
    'dont-tell-anyone': { 
      label: "Don't Tell Anyone", 
      color: 'bg-gray-500', 
      icon: User, 
      description: 'Private communications'
    },
    'keep-quiet': { 
      label: 'Keep Quiet', 
      color: 'bg-green-500', 
      icon: CheckCircle, 
      description: 'Background monitoring'
    }
  };

  const getAllSenders = () => {
    if (!emailData?.categorizedSenders) return [];
    
    return Object.entries(emailData.categorizedSenders)
      .flatMap(([category, senders]) => 
        Array.isArray(senders) ? senders.map(sender => ({ ...sender, category })) : []
      )
      .filter(sender => 
        selectedCategory === 'all' || sender.category === selectedCategory
      )
      .filter(sender =>
        searchTerm === '' || 
        sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sender.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const getCategoryStats = () => {
    if (!emailData?.categorizedSenders) return {};
    
    const stats: Record<string, number> = {};
    Object.entries(emailData.categorizedSenders).forEach(([category, senders]) => {
      if (Array.isArray(senders)) {
        stats[category] = senders.length;
      }
    });
    return stats;
  };

  const senders = getAllSenders();
  const categoryStats = getCategoryStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PookAi Dashboard</h1>
                <p className="text-gray-600">AI Email Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Senders</p>
                  <p className="text-3xl font-bold">{emailData?.totalSenders || 0}</p>
                </div>
                <Mail className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Urgent Calls</p>
                  <p className="text-3xl font-bold">{categoryStats['call-me'] || 0}</p>
                </div>
                <Phone className="w-10 h-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Reminders</p>
                  <p className="text-3xl font-bold">{categoryStats['remind-me'] || 0}</p>
                </div>
                <Bell className="w-10 h-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Processed</p>
                  <p className="text-3xl font-bold">{Object.values(categoryStats).reduce((a, b) => a + b, 0)}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Email Categories</span>
              <Badge variant="secondary">{senders.length} senders</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="flex items-center space-x-2"
              >
                <span>All Categories</span>
                <Badge variant="secondary">{Object.values(categoryStats).reduce((a, b) => a + b, 0)}</Badge>
              </Button>
              
              {Object.entries(categoryInfo).map(([category, info]) => {
                const Icon = info.icon;
                const count = categoryStats[category] || 0;
                
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{info.label}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </Button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search senders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Senders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Email Senders</span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {senders.map((sender, index) => {
                const categoryConfig = categoryInfo[sender.category as keyof typeof categoryInfo];
                const Icon = categoryConfig?.icon || Mail;
                
                return (
                  <motion.div
                    key={sender.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${categoryConfig?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{sender.name || sender.email}</h3>
                        <p className="text-sm text-gray-600">{sender.email}</p>
                        <p className="text-xs text-gray-500">{sender.latestSubject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{sender.emailCount} emails</p>
                        <p className="text-xs text-gray-500">{new Date(sender.lastEmailDate).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {categoryConfig?.label || sender.category}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {senders.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No senders found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'No email senders in this category'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}