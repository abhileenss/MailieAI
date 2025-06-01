import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CleanNavigation } from "@/components/clean-navigation";
import { SEOHead } from "@/components/seo-head";

const categoryConfig = {
  'call-me': {
    title: '📞 Call Me',
    description: 'Urgent emails that need immediate attention',
    color: 'bg-red-500',
    icon: CheckCircle
  },
  'remind-me': {
    title: '⏰ Remind Me', 
    description: 'Important emails to follow up on',
    color: 'bg-orange-500',
    icon: CheckCircle
  },
  'keep-quiet': {
    title: '🔇 Keep Quiet',
    description: 'Low priority, check when convenient', 
    color: 'bg-green-500',
    icon: CheckCircle
  },
  'newsletter': {
    title: '📰 Newsletter',
    description: 'Regular updates and newsletters',
    color: 'bg-blue-500', 
    icon: CheckCircle
  },
  'why-did-i-signup': {
    title: '🤷 Why Did I Sign Up?',
    description: 'Questionable subscriptions',
    color: 'bg-purple-500',
    icon: CheckCircle
  },
  'dont-tell-anyone': {
    title: '🤫 Don\'t Tell Anyone',
    description: 'Personal or sensitive emails',
    color: 'bg-pink-500',
    icon: CheckCircle
  }
};

export default function EmailCategoriesPreview() {
  const [, setLocation] = useLocation();
  
  // Fetch your real processed emails
  const { data: processedEmails, isLoading } = useQuery({
    queryKey: ['/api/emails/processed']
  });
  
  const handleContinue = () => {
    setLocation("/preferences");
  };
  
  const totalSenders = processedEmails?.totalSenders || 0;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your email analysis results...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Email Analysis Results - PookAi | Your Email Categories"
        description="See how PookAi categorized your emails. Set preferences for which categories should trigger calls and which should stay quiet."
        canonical="https://pookai.com/preview"
        keywords="email categorization, AI email analysis, email preferences, inbox organization"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/preview" />
        
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  Your Email Analysis is Complete!
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We've analyzed your inbox and found <strong>{totalSenders} unique email senders</strong>. 
                  Here's how we've categorized them for you.
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <h3 className="text-2xl font-bold">{totalSenders}</h3>
                  <p className="text-muted-foreground">Email Senders</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-3 text-green-500" />
                  <h3 className="text-2xl font-bold">6</h3>
                  <p className="text-muted-foreground">Smart Categories</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="text-2xl font-bold">100%</h3>
                  <p className="text-muted-foreground">Categorized</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold text-center mb-8">
                Your Email Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const count = processedEmails?.categoryStats?.[key] || 
                             processedEmails?.categorizedSenders?.[key]?.length || 0;
                  const Icon = config.icon;
                  
                  return (
                    <Card key={key} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{config.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
                            <Badge variant="secondary">
                              {count} {count === 1 ? 'sender' : 'senders'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Next Step CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Now, Let's Set Your Preferences
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    You have complete control. Choose which categories should trigger voice calls, 
                    which ones should just send reminders, and which should stay completely quiet. 
                    <strong> No calls will be made without your explicit permission.</strong>
                  </p>
                  
                  <Button 
                    onClick={handleContinue}
                    size="lg"
                    className="px-8 py-6 text-lg"
                  >
                    Set My Preferences
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}