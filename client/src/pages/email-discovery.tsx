import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Filter, 
  ArrowRight, 
  Edit3,
  ChevronDown,
  Check,
  Phone,
  MessageSquare,
  Bell,
  Trash2,
  Archive,
  Eye,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { CleanNavigation } from '@/components/clean-navigation';
import ProgressStepper from '@/components/progress-stepper';
import NavigationFooter from '@/components/navigation-footer';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/pagination';
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

export default function EmailDiscovery() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State management
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);
  const [filterDomain, setFilterDomain] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch processed emails
  const { data: emailData, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    retry: false,
  });

  // Get all senders from all categories
  const allSenders = useMemo(() => {
    if (!emailData?.categorizedSenders) return [];
    return Object.values(emailData.categorizedSenders).flat();
  }, [emailData]);

  // Filter senders based on search, domain, and category
  const filteredSenders = useMemo(() => {
    let filtered = allSenders;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(sender => 
        sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.latestSubject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by domain
    if (filterDomain) {
      filtered = filtered.filter(sender => 
        sender.domain.toLowerCase().includes(filterDomain.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sender => sender.category === selectedCategory);
    }

    return filtered;
  }, [allSenders, searchQuery, filterDomain, selectedCategory]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedSenders,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage
  } = usePagination(filteredSenders, 25);

  // Calculate domain stats
  const domainStats = useMemo(() => {
    const stats: Record<string, number> = {};
    allSenders.forEach(sender => {
      stats[sender.domain] = (stats[sender.domain] || 0) + sender.emailCount;
    });
    return stats;
  }, [allSenders]);

  const totalEmails = useMemo(() => {
    return allSenders.reduce((sum, sender) => sum + sender.emailCount, 0);
  }, [allSenders]);

  const topDomains = useMemo(() => {
    return Object.entries(domainStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [domainStats]);

  // Update category mutation
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

  const handleSenderToggle = (senderId: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderId) 
        ? prev.filter(id => id !== senderId)
        : [...prev, senderId]
    );
  };

  const handleCategoryChange = (senderId: string, category: string) => {
    updateCategoryMutation.mutate({ senderId, category });
  };

  const proceedToDashboard = () => {
    setLocation('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your email patterns...</p>
        </div>
      </div>
    );
  }

  if (error || !emailData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load email data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/discovery" />
        
        {/* Fixed Header */}
        <div className="bg-background border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <ProgressStepper 
              steps={["Connect", "Discover", "Preview", "Categorize", "Preferences", "Call Setup", "Dashboard"]}
              currentStep={1}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <h1 className="text-3xl font-bold mb-2">
                Here's Who You're Getting Emails From
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We analyzed your inbox and found {emailData.totalSenders} unique email senders. 
                Choose what matters most to you for personalized voice summaries.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex h-[calc(100vh-220px)]">
          {/* Left Panel - Stats and Controls */}
          <div className="w-1/3 border-r bg-muted/20 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Mail className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-xl font-bold">{emailData.totalSenders}</p>
                    <p className="text-xs text-muted-foreground">Total Senders</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-xl font-bold">{Object.keys(domainStats).length}</p>
                    <p className="text-xs text-muted-foreground">Unique Domains</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-xl font-bold">{totalEmails}</p>
                    <p className="text-xs text-muted-foreground">Total Emails</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Filter className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-xl font-bold">{selectedSenders.length}</p>
                    <p className="text-xs text-muted-foreground">Selected</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Filters and Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Senders</label>
                    <Input
                      placeholder="Search by name, email, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Domain Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filter by Domain</label>
                    <Input
                      placeholder="e.g., gmail.com, work.com..."
                      value={filterDomain}
                      onChange={(e) => setFilterDomain(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filter by Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

                  {/* Bulk Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedSenders(filteredSenders.map(s => s.id))}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={() => setSelectedSenders([])}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Top Domains Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Email Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDomains.map(([domain, count], index) => (
                      <div key={domain} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium w-6">{index + 1}.</span>
                          <span className="font-medium text-sm">{domain}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(count / Math.max(...Object.values(domainStats))) * 100}%` }}
                            />
                          </div>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Email Senders List */}
          <div className="flex-1 flex flex-col">
            {/* List Header */}
            <div className="border-b bg-background p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Email Senders</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} senders
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Scrollable Email List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {paginatedSenders.map((sender, index) => (
                  <motion.div
                    key={sender.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedSenders.includes(sender.id)}
                        onCheckedChange={() => handleSenderToggle(sender.id)}
                        className="mt-1"
                      />

                      {/* Sender Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{sender.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">{sender.email}</p>
                            <p className="text-xs text-muted-foreground">{sender.domain}</p>
                          </div>
                          <div className="text-right ml-4">
                            <Badge variant="secondary">{sender.emailCount} emails</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(sender.lastEmailDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Latest Subject */}
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            Latest: {sender.latestSubject}
                          </p>
                        </div>

                        {/* Category Dropdown */}
                        <div className="mt-3">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Category
                          </label>
                          <Select 
                            value={sender.category} 
                            onValueChange={(category) => handleCategoryChange(sender.id, category)}
                            disabled={updateCategoryMutation.isPending}
                          >
                            <SelectTrigger className="w-full h-8">
                              <SelectValue>
                                {sender.category && categoryConfig[sender.category as keyof typeof categoryConfig] && (
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      const config = categoryConfig[sender.category as keyof typeof categoryConfig];
                                      const Icon = config.icon;
                                      return (
                                        <>
                                          <div className={`w-3 h-3 rounded ${config.color}`} />
                                          <span className="text-sm">{config.title}</span>
                                        </>
                                      );
                                    })()}
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
                                      <div className="text-xs text-muted-foreground">{config.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="border-t bg-background p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>
        </div>

        {/* Fixed Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
          <div className="container mx-auto flex items-center justify-center gap-4">
            <Button
              onClick={proceedToDashboard}
              disabled={selectedSenders.length === 0}
              size="lg"
              className="min-w-[200px]"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              size="lg"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Later
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}