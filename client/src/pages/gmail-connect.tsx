import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Shield, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function GmailConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleGmailConnect = async () => {
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/gmail/auth-url');
      const { authUrl } = await response.json();
      
      // Redirect to Gmail OAuth
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Gmail. Please try again.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleManualSkip = () => {
    // Skip to next step for testing
    window.location.href = '/phone-verify';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Gmail</h1>
          <p className="text-muted-foreground">
            Securely connect your Gmail account to start managing your emails with PookAi
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Secure Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Read-only access</div>
                  <div>We only read your emails to categorize them</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Secure OAuth</div>
                  <div>Google-standard authentication process</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">No password sharing</div>
                  <div>We never see or store your Gmail password</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  You'll be redirected to Google to authorize access. This is completely secure and standard.
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGmailConnect}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Connect Gmail Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleManualSkip}
                className="text-muted-foreground"
              >
                Skip for now (demo mode)
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          By connecting, you agree to our privacy policy and terms of service
        </div>
      </div>
    </div>
  );
}