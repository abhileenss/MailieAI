import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";

export default function Landing() {
  const [, setLocation] = useLocation();

  const navigateToEmailScan = () => {
    setLocation("/scanning");
  };

  return (
    <>
      <SEOHead 
        title="PookAi - Your Founder's AI Concierge | Smart Email Voice Assistant"
        description="Transform your inbox chaos into daily voice calls. PookAi's AI concierge categorizes emails and calls founders with what matters most. Privacy-first, voice-powered productivity for startup leaders."
        canonical="https://pookai.com"
        keywords="AI voice assistant, email productivity, founder tools, voice AI, email management, startup productivity, AI concierge, email categorization, voice-first productivity"
      />
      
      <div className="min-h-screen flex flex-col bg-background text-foreground font-primary">
        {/* Navigation */}
        <Navigation currentPage="/" />

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-8 leading-tight tracking-tight">
                Your Founder's
                <br />
                <span className="text-primary">
                  AI Concierge
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Stop drowning in email chaos. Your AI concierge calls you daily with what actually matters, 
                filters the noise, and keeps you focused on building.
              </p>
            </motion.div>

            <motion.div 
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                onClick={navigateToEmailScan}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-4 rounded-xl font-medium transition-all duration-200 surface-elevated-hover"
              >
                Scan My Inbox Now
                <motion.span
                  className="ml-3"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>

            {/* Feature Preview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div 
                className="surface-elevated rounded-xl p-8 surface-elevated-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-14 h-14 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <Brain className="text-primary-foreground w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Smart Categorization</h3>
                <p className="text-muted-foreground font-light leading-relaxed">AI sorts your emails: "Call me", "Remind me", "Keep quiet", "Why did I sign up for this?"</p>
              </motion.div>
              
              <motion.div 
                className="surface-elevated rounded-xl p-8 surface-elevated-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="w-14 h-14 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <Phone className="text-primary-foreground w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Daily Voice Calls</h3>
                <p className="text-muted-foreground font-light leading-relaxed">Your AI calls you at 9am: "Hey, you've got 3 investor emails and your app is down"</p>
              </motion.div>
              
              <motion.div 
                className="surface-elevated rounded-xl p-8 surface-elevated-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-14 h-14 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <Lock className="text-primary-foreground w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">Privacy First</h3>
                <p className="text-muted-foreground font-light leading-relaxed">We don't sell your data like others. Your inbox secrets stay secret.</p>
              </motion.div>
            </motion.div>

            {/* Internal Links Section */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-gray-400 mb-4">Learn more about our approach</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <button 
                  onClick={() => setLocation("/privacy")} 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Privacy Policy
                </button>
                <span className="text-gray-600">•</span>
                <button 
                  onClick={() => setLocation("/security")} 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Security Features
                </button>
                <span className="text-gray-600">•</span>
                <button 
                  onClick={() => setLocation("/support")} 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Get Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}