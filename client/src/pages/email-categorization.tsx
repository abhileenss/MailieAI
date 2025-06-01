import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Bell, 
  Archive, 
  Mail, 
  Trash2, 
  Eye, 
  Settings,
  Check,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/sidebar';
import { apiRequest } from '@/lib/queryClient';

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

const categoryConfig = {
  'call-me': { 
    title: 'Call Me', 
    icon: Phone, 
    color: 'bg-red-500',
    description: 'Important contacts that need voice calls'
  },
  'remind-me': { 
    title: 'Remind Me', 
    icon: Bell, 
    color: 'bg-orange-500',
    description: 'Reminders and follow-ups'
  },
  'keep-quiet': { 
    title: 'Keep Quiet', 
    icon: Archive, 
    color: 'bg-gray-500',
    description: 'Silent notifications only'
  },
  'newsletter': { 
    title: 'Newsletter', 
    icon: Mail, 
    color: 'bg-blue-500',
    description: 'Newsletters and updates'
  },
  'why-did-i-signup': { 
    title: 'Why Did I Sign Up?', 
    icon: Trash2, 
    color: 'bg-purple-500',
    description: 'Questionable subscriptions'
  },
  'dont-tell-anyone': { 
    title: "Don't Tell Anyone", 
    icon: Eye, 
    color: 'bg-pink-500',
    description: 'Private and confidential'
  },
  'unassigned': { 
    title: 'Unassigned', 
    icon: Settings, 
    color: 'bg-gray-400',
    description: 'Needs categorization'
  }
};

export default function EmailCategorization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    retry: false,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      await apiRequest(`/api/emails/senders/${senderId}/category`, {
        method: 'PATCH',
        body: JSON.stringify({ category }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
      toast({
        title: "Category Updated",
        description: "Email sender category has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update category. Please try again.",
        variant: "destructive",
      });
    },
  });

  const allSenders = useMemo(() => {
    if (!emailData?.categorizedSenders) return [];
    return Object.values(emailData.categorizedSenders).flat();
  }, [emailData]);

  const filteredSenders = useMemo(() => {
    if (selectedCategory === 'all') return allSenders;
    return allSenders.filter(sender => sender.category === selectedCategory);
  }, [allSenders, selectedCategory]);

  const handleCategoryChange = (senderId: string, category: string) => {
    updateCategoryMutation.mutate({ senderId, category });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading email data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Email Categorization</h1>
              <p className="text-slate-600 mt-1">
                Organize your {allSenders.length} email senders into categories
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = emailData?.categoryStats?.[key] || 0;
              const Icon = config.icon;
              
              return (
                <Card key={key} className="bg-white border-slate-200">
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-xs text-slate-600 truncate">{config.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Email Senders List */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {selectedCategory === 'all' ? 'All Email Senders' : categoryConfig[selectedCategory as keyof typeof categoryConfig]?.title}
                <Badge variant="secondary">{filteredSenders.length} senders</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSenders.map((sender, index) => {
                  const currentCategory = categoryConfig[sender.category as keyof typeof categoryConfig];
                  
                  return (
                    <motion.div
                      key={sender.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 truncate">{sender.name}</h4>
                              <p className="text-sm text-slate-600 truncate">{sender.email}</p>
                              <p className="text-xs text-slate-500">{sender.domain}</p>
                            </div>
                            
                            <div className="ml-4 text-right">
                              <Badge variant="secondary">{sender.emailCount} emails</Badge>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(sender.lastEmailDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-xs text-slate-600 line-clamp-1">
                              Latest: {sender.latestSubject}
                            </p>
                          </div>

                          {/* Category Selection */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-700">Category:</span>
                            <Select 
                              value={sender.category} 
                              onValueChange={(category) => handleCategoryChange(sender.id, category)}
                              disabled={updateCategoryMutation.isPending}
                            >
                              <SelectTrigger className="w-64">
                                <SelectValue>
                                  {currentCategory && (
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded ${currentCategory.color}`} />
                                      <span>{currentCategory.title}</span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(categoryConfig).map(([key, config]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded ${config.color}`} />
                                      <div>
                                        <div className="font-medium">{config.title}</div>
                                        <div className="text-xs text-slate-500">{config.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {updateCategoryMutation.isPending && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {filteredSenders.length === 0 && (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">
                      {selectedCategory === 'all' ? 'No email senders found' : `No senders in "${categoryConfig[selectedCategory as keyof typeof categoryConfig]?.title}" category`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}