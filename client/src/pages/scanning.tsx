import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Search, Mail, Brain, Phone, CheckCircle, ArrowRight, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { SEOHead } from "@/components/seo-head";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ScanProgress {
  step: 'connecting' | 'scanning' | 'analyzing' | 'categorizing' | 'complete';
  progress: number;
  currentAction: string;
  emailsProcessed: number;
  totalEmails: number;
  newEmailsFound?: number;
  previousTotal?: number;
}

export default function Scanning() {
  const [, setLocation] = useLocation();
  const [scanInProgress, setScanInProgress] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    step: 'connecting',
    progress: 0,
    currentAction: 'Initializing...',
    emailsProcessed: 0,
    totalEmails: 0
  });
  const queryClient = useQueryClient();

  // Check if user has existing processed emails
  const { data: existingEmails, isLoading } = useQuery({
    queryKey: ['/api/emails/processed'],
    enabled: !scanInProgress
  });

  // Check Gmail connection status
  const { data: gmailStatus } = useQuery({
    queryKey: ['/api/gmail/status'],
    enabled: !scanInProgress
  });

  const scanEmailsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/emails/scan-and-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/processed'] });
      
      // Calculate new emails found
      const previousTotal = existingEmails?.totalSenders || 0;
      const currentTotal = data.totalSenders || 0;
      const newEmailsFound = data.newEmailsCount || Math.max(0, currentTotal - previousTotal);
      
      setScanProgress(prev => ({ 
        ...prev, 
        step: 'complete', 
        progress: 100,
        newEmailsFound,
        previousTotal 
      }));
      
      setTimeout(() => setLocation('/dashboard'), 3000);
    },
    onError: (error) => {
      console.error('Scan error:', error);
      setScanInProgress(false);
    }
  });

  const connectGmail = async () => {
    try {
      const response = await fetch('/api/gmail/auth');
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
    }
  };

  const startEmailScan = async () => {
    setScanInProgress(true);
    
    // Simulate progress steps
    const steps = [
      { step: 'connecting' as const, action: 'Connecting to Gmail...', duration: 1000 },
      { step: 'scanning' as const, action: 'Scanning your inbox...', duration: 2000 },
      { step: 'analyzing' as const, action: 'Analyzing email content...', duration: 3000 },
      { step: 'categorizing' as const, action: 'Categorizing with AI...', duration: 2000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      setScanProgress({
        step: currentStep.step,
        progress: (i / steps.length) * 90,
        currentAction: currentStep.action,
        emailsProcessed: Math.floor(Math.random() * 50) + (i * 25),
        totalEmails: 100
      });
      await new Promise(resolve => setTimeout(resolve, currentStep.duration));
    }

    // Start actual scan
    scanEmailsMutation.mutate();
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'connecting': return <Mail className="w-5 h-5" />;
      case 'scanning': return <Search className="w-5 h-5" />;
      case 'analyzing': return <Brain className="w-5 h-5" />;
      case 'categorizing': return <Zap className="w-5 h-5" />;
      case 'complete': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <>
      <SEOHead 
        title="Email Scanning - mailieAI | AI Email Analysis & Categorization"
        description="Scan and analyze your emails with AI-powered categorization. Transform your inbox into organized, actionable insights for better productivity."
        canonical="https://mailieai.com/scanning"
        keywords="email scanning, AI email analysis, email categorization, inbox organization, email productivity"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <Navigation currentPage="/scanning" />
        
        <div className="max-w-4xl mx-auto p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              Email Scanning & Analysis
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Let our AI analyze your inbox and categorize emails by importance. 
              We'll prepare everything for your personalized voice calls.
            </p>
          </motion.div>

          {!scanInProgress && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {/* Gmail Connection Check */}
              {gmailStatus && !gmailStatus.connected ? (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-semibold mb-2">Connect Your Gmail Account</h3>
                    <p className="text-muted-foreground mb-6">
                      To analyze your emails, we need permission to access your Gmail account securely.
                    </p>
                    
                    <Button
                      onClick={connectGmail}
                      size="lg"
                      className="w-full"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Connect Gmail Account
                    </Button>
                  </div>
                </div>
              ) : gmailStatus?.connected && existingEmails && 'success' in existingEmails && existingEmails.success && 'totalSenders' in existingEmails && existingEmails.totalSenders > 0 ? (
                <div className="bg-accent/50 border border-border rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Previous Scan Found</h3>
                      <p className="text-muted-foreground">
                        {existingEmails.totalSenders} email senders already processed
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setLocation('/dashboard')}
                      className="flex-1"
                    >
                      View Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      onClick={startEmailScan}
                      variant="outline"
                      className="flex-1"
                    >
                      Rescan Emails
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Scan Your Emails</h3>
                    <p className="text-muted-foreground mb-6">
                      We'll analyze your inbox, categorize emails by importance, and prepare personalized call scripts.
                    </p>
                    
                    <Button
                      onClick={startEmailScan}
                      size="lg"
                      className="w-full"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Start Email Scan
                    </Button>
                  </div>
                </div>
              )}

              {/* What happens during scan */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h4 className="font-semibold mb-4">What happens during the scan:</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Connect securely to your Gmail account</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-primary" />
                    <span>Scan recent emails and identify senders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-4 h-4 text-primary" />
                    <span>AI analyzes content and importance levels</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Categorize into actionable buckets</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>Prepare personalized call scripts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {scanInProgress && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-background border border-border rounded-lg p-8">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    {getStepIcon(scanProgress.step)}
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-2">
                    {scanProgress.currentAction}
                  </h3>
                  
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-muted-foreground">
                    {scanProgress.emailsProcessed > 0 && (
                      `Processed ${scanProgress.emailsProcessed} of ${scanProgress.totalEmails} emails`
                    )}
                  </p>
                </div>

                {scanProgress.step === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h4 className="text-lg font-semibold mb-2">Scan Complete!</h4>
                    
                    {scanProgress.newEmailsFound !== undefined && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-green-600">
                            {scanProgress.newEmailsFound > 0 
                              ? `Found ${scanProgress.newEmailsFound} new email${scanProgress.newEmailsFound === 1 ? '' : 's'}!`
                              : 'No new emails since last scan'
                            }
                          </span>
                        </div>
                        {scanProgress.previousTotal !== undefined && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Total: {scanProgress.previousTotal + (scanProgress.newEmailsFound || 0)} senders processed
                          </p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-muted-foreground mb-4">
                      Your emails have been analyzed and categorized. Redirecting to dashboard...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}