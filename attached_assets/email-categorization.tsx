import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mail, Brain, Phone, Archive, Trash2, User, ArrowRight, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/seo-head";
import { CleanNavigation } from "@/components/clean-navigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

const categoryConfig = {
  'call-me': {
    title: 'Call Me',
    description: 'Critical emails requiring immediate attention',
    icon: Phone,
    color: 'bg-red-500',
    textColor: 'text-red-500'
  },
  'remind-me': {
    title: 'Remind Me',
    description: 'Important but not urgent items',
    icon: Brain,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Industry insights and informational content',
    icon: Mail,
    color: 'bg-blue-500',
    textColor: 'text-blue-500'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up?',
    description: 'Promotional and marketing emails',
    icon: Trash2,
    color: 'bg-gray-500',
    textColor: 'text-gray-500'
  },
  'keep-quiet': {
    title: 'Keep Quiet',
    description: 'Reference materials and confirmations',
    icon: Archive,
    color: 'bg-green-500',
    textColor: 'text-green-500'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    textColor: 'text-purple-500'
  }
};

export default function EmailCategorization() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [processedSenders, setProcessedSenders] = useState<EmailSender[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(20);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch processed emails from database
  const { data: processedEmails, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Update sender category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      const response = await fetch(`/api/emails/senders/${senderId}/category`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ category })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
      toast({
        title: "Category Updated",
        description: "Email sender category has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Category update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Flatten all senders into a single array
  useEffect(() => {
    if (processedEmails) {
      const allSenders = Object.values(processedEmails.categorizedSenders).flat();
      setProcessedSenders(allSenders);
    }
  }, [processedEmails]);

  const handleCategoryChange = (senderId: string, category: string) => {
    // Optimistically update the UI
    setProcessedSenders(prev => 
      prev.map(sender => 
        sender.id === senderId ? { ...sender, category } : sender
      )
    );

    // Update on server
    updateCategoryMutation.mutate({ senderId, category });
  };

  const handleContinue = () => {
    setLocation('/dashboard');
  };

  // Group senders by domain and filter
  const groupedByDomain = processedSenders.reduce((acc, sender) => {
    const domain = sender.domain;
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(sender);
    return acc;
  }, {} as Record<string, EmailSender[]>);

  // Filter domains based on search and category
  const filteredDomains = Object.entries(groupedByDomain).filter(([domain, senders]) => {
    const matchesSearch = searchTerm === '' || 
      domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senders.some(sender => 
        sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sender.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === null || 
      senders.some(sender => sender.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort domains by total email count
  const sortedDomains = filteredDomains.sort(([, sendersA], [, sendersB]) => {
    const totalA = sendersA.reduce((sum, sender) => sum + sender.emailCount, 0);
    const totalB = sendersB.reduce((sum, sender) => sum + sender.emailCount, 0);
    return totalB - totalA;
  });

  // Pagination
  const totalDomains = sortedDomains.length;
  const totalPages = Math.ceil(totalDomains / domainsPerPage);
  const startIndex = (currentPage - 1) * domainsPerPage;
  const paginatedDomains = sortedDomains.slice(startIndex, startIndex + domainsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your email senders...</p>
        </div>
      </div>
    );
  }

  if (error || !processedEmails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">No Email Data</CardTitle>
            <CardDescription>
              Please scan your emails first to categorize them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/scanning')} className="w-full">
              Start Email Scanning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Categorize Emails - PookAi | Manual Email Organization"
        description="Manually categorize your email senders into quirky buckets. Choose which emails deserve calls, reminders, or should stay quiet."
        canonical="https://pookai.com/categorize"
        keywords="email categorization, manual email sorting, email organization, email buckets, email management"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/categorize" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-4">
                Categorize Your Email Senders
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We found <strong>{processedEmails.totalSenders} email senders</strong>. 
                Assign each one to your preferred quirky bucket.
              </p>
            </motion.div>
          </div>

          {/* Progress Summary and Actions - MOVED TO TOP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="neopop-card">
              <CardHeader className="text-center">
                <CardTitle>Email Categorization Progress</CardTitle>
                <CardDescription>
                  {processedSenders.filter(s => s.category !== 'unassigned').length} of {processedSenders.length} senders categorized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const count = processedSenders.filter(s => s.category === key).length;
                    const Icon = config.icon;
                    return (
                      <div key={key} className="text-center">
                        <div className={`w-8 h-8 rounded-lg ${config.color} mx-auto mb-2 flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-lg font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground">{config.title}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => setLocation('/preferences')}
                    variant="outline"
                    className="flex-1 max-w-[200px]"
                  >
                    Set Call Preferences
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    className="neopop-button neopop-button-primary flex-1 max-w-[200px]"
                  >
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, email, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Email Type Filters */}
            <div className="flex gap-2 flex-wrap mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className={selectedCategory === null ? "bg-orange-500 text-white border-0" : ""}
              >
                All ({processedEmails.totalSenders})
              </Button>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = processedSenders.filter(s => s.category === key).length;
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    onClick={() => setSelectedCategory(key)}
                    size="sm"
                    className={selectedCategory === key ? `${config.color} text-white border-0` : ""}
                  >
                    {config.title} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Email Type Quick Filters - Mobile Responsive */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Quick Filters by Email Type:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("newsletter")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">📰</span>
                  <span className="truncate">Newsletters</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("bank")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">🏦</span>
                  <span className="truncate">Banking</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("event")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">📅</span>
                  <span className="truncate">Events</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("tool")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">🔧</span>
                  <span className="truncate">Tools</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("job")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">💼</span>
                  <span className="truncate">Jobs</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("social")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">👥</span>
                  <span className="truncate">Social</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("shopping")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">🛒</span>
                  <span className="truncate">Shopping</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("consulting")}
                  className="text-xs h-8 justify-start"
                >
                  <span className="mr-1">💡</span>
                  <span className="truncate">Consulting</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs h-8 bg-gray-100 justify-start col-span-2 sm:col-span-1"
                >
                  <span className="mr-1">✕</span>
                  <span className="truncate">Clear Filter</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Unroll.Me Style Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="grid gap-4">
              {paginatedDomains.map(([domain, senders], domainIndex) => {
                const totalEmails = senders.reduce((sum, sender) => sum + sender.emailCount, 0);
                
                return senders.map((sender) => {
                  const currentCategory = categoryConfig[sender.category as keyof typeof categoryConfig];
                  
                  return (
                    <motion.div
                      key={sender.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: domainIndex * 0.05 }}
                      className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Mobile-First Responsive Layout */}
                      <div className="space-y-4">
                        {/* Sender Info - Optimized for Mobile */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg truncate">{sender.name}</h3>
                              <Badge variant="secondary" className="text-xs w-fit">
                                {sender.emailCount} emails
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-1">{sender.email}</p>
                            <p className="text-xs text-muted-foreground mb-1">{sender.domain}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                              Latest: {sender.latestSubject}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Mobile Optimized Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {Object.entries(categoryConfig).map(([key, config]) => {
                            const isSelected = sender.category === key;
                            const Icon = config.icon;
                            
                            return (
                              <Button
                                key={key}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleCategoryChange(sender.id, key)}
                                className={`justify-start text-xs sm:text-sm h-9 sm:h-10 transition-all duration-200 ${
                                  isSelected 
                                    ? `${config.color} text-white border-0 shadow-sm transform scale-105` 
                                    : 'hover:border-primary/50 hover:shadow-sm'
                                } ${updateCategoryMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={updateCategoryMutation.isPending}
                              >
                                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="truncate">{config.title}</span>
                                {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Current Category Indicator */}
                      {currentCategory && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Current:</span>
                            <div className={`w-4 h-4 rounded ${currentCategory.color} flex items-center justify-center`}>
                              <currentCategory.icon className="w-2 h-2 text-white" />
                            </div>
                            <span className="font-medium">{currentCategory.title}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                });
              })}
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Results Summary */}
          {totalDomains === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No domains match your search criteria.</p>
            </div>
          )}


        </div>
      </div>
    </>
  );
}