import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mail, Search, CheckCircle, Zap, Brain } from "lucide-react";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";

export default function EmailScanning() {
  const [, setLocation] = useLocation();
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const scanSteps = [
    { 
      icon: <Mail className="w-6 h-6" />, 
      title: "Connecting to your email", 
      description: "Securely accessing your inbox..." 
    },
    { 
      icon: <Search className="w-6 h-6" />, 
      title: "Analyzing email patterns", 
      description: "Identifying senders and communication patterns..." 
    },
    { 
      icon: <Brain className="w-6 h-6" />, 
      title: "Learning your priorities", 
      description: "Understanding what matters most to founders..." 
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Building your categories", 
      description: "Creating smart buckets for your emails..." 
    }
  ];

  useEffect(() => {
    const startScanningAnimation = () => {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsComplete(true);
            clearInterval(timer);
            // Auto-navigate to dashboard after animation completes
            setTimeout(() => setLocation("/dashboard"), 2000);
            return 100;
          }
          
          // Update current step based on progress
          const newStep = Math.floor((prev / 100) * scanSteps.length);
          if (newStep !== currentStep && newStep < scanSteps.length) {
            setCurrentStep(newStep);
          }
          
          return prev + 2;
        });
      }, 100);
    };

    const checkExistingData = async () => {
      try {
        // Check if we already have processed email data
        const response = await fetch('/api/emails/processed');
        if (response.ok) {
          const data = await response.json();
          if (data.totalSenders > 0) {
            // We have existing data, start animation and go to dashboard
            startScanningAnimation();
            return;
          }
        }
        
        // No existing data, need to process emails first
        await processEmails();
      } catch (error) {
        console.error('Error checking existing data:', error);
        // Start animation anyway
        startScanningAnimation();
      }
    };

    const processEmails = async () => {
      try {
        // Start the scanning animation
        startScanningAnimation();
        
        // Try to process emails through AI categorization
        const response = await fetch('/api/emails/process-full', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Email processing completed:', result);
        } else if (response.status === 401) {
          // User not authenticated, redirect to Gmail auth
          const authResponse = await fetch('/api/gmail/auth');
          if (authResponse.ok) {
            const { authUrl } = await authResponse.json();
            window.location.href = authUrl;
          }
        } else {
          console.error('Email processing failed:', await response.text());
        }
      } catch (error) {
        console.error('Error during email processing:', error);
      }
    };

    // Check URL parameters for Gmail connection status
    const urlParams = new URLSearchParams(window.location.search);
    const gmailConnected = urlParams.get('gmail') === 'connected';
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Gmail auth error:', error);
      // Continue with scanning animation on error
      startScanningAnimation();
    } else if (gmailConnected) {
      // Gmail successfully connected, process emails
      processEmails();
    } else {
      // Check if we have existing data first
      checkExistingData();
    }
  }, [currentStep, setLocation]);

  return (
    <>
      <SEOHead 
        title="Scanning Your Inbox - PookAi"
        description="PookAi is analyzing your email patterns to create personalized categories and priorities for your founder workflow."
        canonical="https://pookai.com/scanning"
      />
      
      <div className="min-h-screen bg-background text-foreground font-primary">
        <Navigation currentPage="/scanning" />
        
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="max-w-lg mx-auto text-center">
            
            {/* Main Animation */}
            <motion.div
              className="relative mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Outer Ring */}
              <div className="relative w-32 h-32 mx-auto">
                <motion.div
                  className="absolute inset-0 border-4 border-gray-700 rounded-full"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-blue-500"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * scanProgress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-primary"
                    >
                      <CheckCircle className="w-12 h-12" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-primary"
                    >
                      {scanSteps[currentStep]?.icon}
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Progress Percentage */}
              <motion.div 
                className="mt-6"
                key={scanProgress}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-4xl font-bold text-primary">
                  {Math.round(scanProgress)}%
                </div>
              </motion.div>
            </motion.div>

            {/* Current Step */}
            <motion.div
              className="mb-8"
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isComplete ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-primary">Scan Complete!</h2>
                  <p className="text-muted-foreground">Found your email senders. Ready to categorize.</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{scanSteps[currentStep]?.title}</h2>
                  <p className="text-muted-foreground">{scanSteps[currentStep]?.description}</p>
                </div>
              )}
            </motion.div>

            {/* Progress Steps */}
            <div className="flex justify-center space-x-4 mb-8">
              {scanSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index <= currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>

            {/* Privacy Note */}
            <motion.div
              className="text-sm text-muted-foreground max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              🔒 We only analyze sender patterns and metadata. Your email content stays private and is never stored.
            </motion.div>

            {/* Skip Option */}
            {!isComplete && (
              <motion.button
                onClick={() => setLocation("/email-scan")}
                className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Skip animation
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}