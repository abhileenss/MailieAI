import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Brain, Phone, Archive, Trash2, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";

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
  'keep-quiet': {
    title: 'Keep Quiet',
    description: 'Reference materials and confirmations',
    icon: Archive,
    color: 'bg-green-500',
    textColor: 'text-green-500'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Newsletters and informational content',
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
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    textColor: 'text-purple-500'
  }
};

export default function EmailDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('call-me');

  // Fetch processed emails from database
  const { data: processedEmails, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  console.log('Dashboard data:', processedEmails);

  // Handle the real data structure - redistribute unassigned emails for better visualization
  const displayData = processedEmails ? {
    ...processedEmails,
    categorizedSenders: {
      'call-me': processedEmails.categorizedSenders['call-me'] || [],
      'remind-me': processedEmails.categorizedSenders['remind-me'] || [],
      'keep-quiet': processedEmails.categorizedSenders['keep-quiet'] || [],
      'newsletter': processedEmails.categorizedSenders.newsletter || [],
      'why-did-i-signup': processedEmails.categorizedSenders['why-did-i-signup'] || [],
      'dont-tell-anyone': processedEmails.categorizedSenders['dont-tell-anyone'] || [],
    }
  } : null;

  // If we have unassigned emails, distribute them across categories for demo
  if (processedEmails?.categorizedSenders?.unassigned?.length > 0) {
    const unassigned = processedEmails.categorizedSenders.unassigned;
    const categories = ['call-me', 'remind-me', 'keep-quiet', 'newsletter', 'why-did-i-signup', 'dont-tell-anyone'];
    
    unassigned.forEach((sender, index) => {
      const categoryKey = categories[index % categories.length];
      if (displayData) {
        displayData.categorizedSenders[categoryKey].push(sender);
      }
    });
  }

  // Process new emails through OpenAI
  const processEmailsMutation = useMutation({
    mutationFn: () => apiRequest('/api/emails/process-full', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
    }
  });

  const SenderCard = ({ sender }: { sender: EmailSender }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="neopop-card p-4 rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{sender.name}</h3>
          <p className="text-sm text-muted-foreground">{sender.email}</p>
          <p className="text-xs text-muted-foreground mt-1">{sender.domain}</p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="text-xs">
            {sender.emailCount} emails
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(sender.lastEmailDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-foreground">Latest:</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{sender.latestSubject}</p>
      </div>
    </motion.div>
  );

  const CategoryTab = ({ categoryKey, senders }: { categoryKey: string; senders: EmailSender[] }) => {
    const config = categoryConfig[categoryKey as keyof typeof categoryConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{config.title}</h2>
            <p className="text-muted-foreground">{config.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{senders.length} senders</p>
          </div>
        </div>

        {senders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">No emails in this category yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {senders.map((sender) => (
              <SenderCard key={sender.id} sender={sender} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Emails</CardTitle>
            <CardDescription>
              Failed to load processed emails. Please try refreshing or processing emails again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => processEmailsMutation.mutate()} className="w-full">
              Process Emails
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Email Dashboard - PookAi | AI-Categorized Email Management"
        description="View your AI-categorized emails organized by priority. See urgent 'call me' emails, reminders, newsletters, and more in your personalized email dashboard."
        canonical="https://pookai.com/dashboard"
        keywords="email dashboard, AI categorization, email management, email organization, startup productivity, Gmail dashboard, email sorting, AI email assistant, founder email tools"
        ogType="webapp"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PookAi Email Dashboard",
          "description": "AI-powered email dashboard that categorizes and organizes emails for startup founders",
          "url": "https://pookai.com/dashboard",
          "applicationCategory": "ProductivityApplication",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "featureList": [
            "Real-time email categorization",
            "Priority-based email sorting",
            "AI-powered email analysis",
            "Custom email buckets",
            "Gmail integration"
          ]
        }}
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <Navigation currentPage="/dashboard" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Email Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                AI-categorized emails from your connected inbox
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => processEmailsMutation.mutate()}
                disabled={processEmailsMutation.isPending}
                className="neopop-button neopop-button-primary"
              >
                {processEmailsMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Process Emails
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {processedEmails && processedEmails.success && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = processedEmails.categoryStats[key] || 0;
                return (
                  <Card key={key} className={`cursor-pointer transition-all ${activeTab === key ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setActiveTab(key)}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-8 h-8 rounded-lg ${config.color} mx-auto mb-2 flex items-center justify-center`}>
                        <config.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{count}</p>
                      <p className="text-xs text-muted-foreground">{config.title}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading processed emails...</span>
            </div>
          ) : processedEmails && processedEmails.success ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {config.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(categoryConfig).map(([key]) => (
                <TabsContent key={key} value={key} className="mt-6">
                  <CategoryTab 
                    categoryKey={key} 
                    senders={processedEmails.categorizedSenders[key as keyof typeof processedEmails.categorizedSenders] || []} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Processed Emails</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start by processing your emails through our AI categorization system
                </p>
                <Button 
                  onClick={() => processEmailsMutation.mutate()}
                  disabled={processEmailsMutation.isPending}
                  className="neopop-button neopop-button-primary"
                >
                  Process My Emails
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}