import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mail, Brain, Phone, Archive, Trash2, User, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";
import { CleanNavigation } from "@/components/clean-navigation";

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
    textColor: 'text-red-500',
    examples: 'Investors, co-founders, urgent client issues'
  },
  'remind-me': {
    title: 'Remind Me',
    description: 'Important but not urgent items',
    icon: Brain,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    examples: 'Follow-ups, meetings, project updates'
  },
  'newsletter': {
    title: 'Newsletter',
    description: 'Industry insights and informational content',
    icon: Mail,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    examples: 'Tech newsletters, industry reports, blogs'
  },
  'why-did-i-signup': {
    title: 'Why Did I Sign Up?',
    description: 'Promotional and marketing emails',
    icon: Trash2,
    color: 'bg-gray-500',
    textColor: 'text-gray-500',
    examples: 'Sales pitches, marketing campaigns, promotions'
  },
  'keep-quiet': {
    title: 'Keep Quiet',
    description: 'Reference materials and confirmations',
    icon: Archive,
    color: 'bg-green-500',
    textColor: 'text-green-500',
    examples: 'Receipts, confirmations, automated messages'
  },
  'dont-tell-anyone': {
    title: "Don't Tell Anyone",
    description: 'Personal emails in work inbox',
    icon: User,
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    examples: 'Personal shopping, family, private matters'
  }
};

export default function EmailCategoriesPreview() {
  const [, setLocation] = useLocation();

  // Fetch processed emails from database
  const { data: processedEmails, isLoading, error } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  const handleContinue = () => {
    setLocation('/preferences');
  };

  const totalSenders = processedEmails?.totalSenders || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your email analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !processedEmails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Analysis Not Ready</CardTitle>
            <CardDescription>
              Please scan your emails first to see the categorization preview.
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
        title="Email Categories Preview - PookAi | AI-Categorized Email Analysis"
        description="Preview how PookAi's AI has categorized your emails into smart buckets: Call Me, Remind Me, Newsletters, and more. Set your preferences before receiving voice calls."
        canonical="https://pookai.com/preview"
        keywords="email categories, AI categorization preview, email sorting, email buckets, startup email management, AI email analysis, email preferences"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/preview" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Your Email Analysis is Complete!
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We've analyzed your inbox and found <strong>{totalSenders} unique email senders</strong>. 
                Here's how we've categorized them for you.
              </p>
            </motion.div>
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          >
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = processedEmails.categoryStats[key] || 0;
              const Icon = config.icon;
              
              return (
                <Card key={key} className="text-center">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${config.color} mx-auto mb-3 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground">{config.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* Category Explanations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = processedEmails.categoryStats[key] || 0;
              const Icon = config.icon;
              
              return (
                <Card key={key} className="neopop-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{config.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {count} senders
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{config.description}</p>
                    <p className="text-sm text-muted-foreground italic">
                      Examples: {config.examples}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* Sample Senders Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Sample Categorizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(processedEmails.categorizedSenders).map(([categoryKey, senders]) => {
                if (senders.length === 0) return null;
                
                const config = categoryConfig[categoryKey as keyof typeof categoryConfig];
                if (!config) return null;

                // Show first 2 senders as examples
                const sampleSenders = senders.slice(0, 2);
                
                return (
                  <Card key={categoryKey} className="neopop-card">
                    <CardHeader>
                      <CardTitle className={`text-lg ${config.textColor}`}>
                        {config.title} Examples
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sampleSenders.map((sender) => (
                          <div key={sender.id} className="p-3 bg-muted rounded-lg">
                            <p className="font-medium text-sm">{sender.name}</p>
                            <p className="text-xs text-muted-foreground">{sender.domain}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {sender.emailCount} emails
                            </p>
                          </div>
                        ))}
                        {senders.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{senders.length - 2} more senders
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="neopop-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl">What's Next?</CardTitle>
                <CardDescription>
                  Now you can customize which categories you want to receive voice calls for.
                  You have complete control over your preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleContinue}
                  className="neopop-button neopop-button-primary text-lg px-8 py-4"
                >
                  Customize My Preferences
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="mt-6 text-sm text-muted-foreground">
                  <p className="mb-2">You'll be able to:</p>
                  <ul className="space-y-1">
                    <li>• Choose which categories trigger voice calls</li>
                    <li>• Set your preferred call times</li>
                    <li>• Adjust individual sender preferences</li>
                    <li>• Configure notification settings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}