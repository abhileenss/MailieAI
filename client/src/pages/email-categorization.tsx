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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch processed emails from database
  const { data: processedEmails, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Update sender category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      return apiRequest(`/api/emails/sender/${senderId}/category`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
      toast({
        title: "Category Updated",
        description: "Email sender category has been updated successfully.",
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

  // Filter senders based on search term and selected category
  const filteredSenders = processedSenders.filter(sender => {
    const matchesSearch = searchTerm === '' || 
      sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || sender.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, email, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
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
                  >
                    {config.title} ({count})
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Senders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            {filteredSenders.map((sender, index) => {
              const currentCategory = categoryConfig[sender.category as keyof typeof categoryConfig];
              
              return (
                <motion.div
                  key={sender.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Sender Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      
                      {/* Sender Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{sender.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {sender.emailCount} emails
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{sender.email}</p>
                        <p className="text-xs text-muted-foreground">{sender.domain}</p>
                      </div>
                      
                      {/* Current Category */}
                      {currentCategory && (
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${currentCategory.color} flex items-center justify-center`}>
                            <currentCategory.icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {currentCategory.title}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Actions */}
                    <div className="flex gap-1 ml-4">
                      {Object.entries(categoryConfig).map(([key, config]) => {
                        const isSelected = sender.category === key;
                        const Icon = config.icon;
                        
                        return (
                          <Button
                            key={key}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange(sender.id, key)}
                            className={`min-w-[80px] text-xs transition-all duration-200 ${
                              isSelected 
                                ? `${config.color} text-white border-0 shadow-md` 
                                : 'hover:border-gray-400'
                            }`}
                            title={config.description}
                            disabled={updateCategoryMutation.isPending}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {isSelected ? config.title : config.title.split(' ')[0]}
                            {isSelected && <Check className="w-3 h-3 ml-1" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Results Summary */}
          {filteredSenders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No senders match your search criteria.</p>
            </div>
          )}

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card className="neopop-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Categorization Progress</CardTitle>
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
                
                <p className="text-sm text-muted-foreground mt-4">
                  You can always adjust these categories later from your dashboard.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}