import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Phone, Brain, Mail, Bell, Shield, Trash2, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { SEOHead } from "@/components/seo-head";

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
    color: 'bg-red-500'
  },
  'remind-me': {
    title: 'Remind Me',
    description: 'Important but not urgent items',
    icon: Brain,
    color: 'bg-blue-500'
  },
  'keep-quiet': {
    title: 'Keep Quiet',
    description: 'Low priority, just keep track',
    icon: Bell,
    color: 'bg-green-500'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Regular updates and newsletters',
    icon: Mail,
    color: 'bg-yellow-500'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up',
    description: 'Promotional and marketing emails',
    icon: Trash2,
    color: 'bg-gray-500'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500'
  }
};

export default function EmailDashboardFixed() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('call-me');

  // Fetch your real processed emails
  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    staleTime: 30000
  });

  // Process emails mutation
  const processEmailsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/emails/scan-and-process', {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
    }
  });

  const SenderCard = ({ sender }: { sender: EmailSender }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
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
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
            <config.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{config.title}</h2>
            <p className="text-sm text-muted-foreground">{config.description}</p>
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

  return (
    <>
      <SEOHead 
        title="Email Dashboard - PookAi | AI-Categorized Email Management"
        description="View your AI-categorized emails organized by priority. See urgent 'call me' emails, reminders, newsletters, and more in your personalized email dashboard."
        canonical="https://pookai.com/dashboard"
        keywords="email dashboard, AI categorization, email management, email organization, startup productivity"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <Navigation currentPage="/dashboard" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Your Email Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                {emailData?.success ? `${emailData.totalSenders} email senders processed and categorized` : 'AI-categorized emails from your connected inbox'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => processEmailsMutation.mutate()}
                disabled={processEmailsMutation.isPending}
                variant="outline"
              >
                {processEmailsMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Refresh Analysis
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {emailData?.success && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = emailData.categoryStats[key] || 0;
                return (
                  <Card key={key} className={`cursor-pointer transition-all hover:shadow-md ${activeTab === key ? 'ring-2 ring-primary' : ''}`}
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
              <span className="ml-3 text-muted-foreground">Loading your processed emails...</span>
            </div>
          ) : emailData?.success ? (
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
                    senders={emailData.categorizedSenders[key as keyof typeof emailData.categorizedSenders] || []} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Email</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start by processing your emails through our AI categorization system
                </p>
                <Button 
                  onClick={() => processEmailsMutation.mutate()}
                  disabled={processEmailsMutation.isPending}
                >
                  {processEmailsMutation.isPending ? 'Processing...' : 'Process My Emails'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}