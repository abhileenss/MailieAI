import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { CleanNavigation } from "@/components/clean-navigation";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    // Redirect to Replit authentication first, then Gmail
    window.location.href = "/api/login";
  };

  return (
    <>
      <SEOHead 
        title="PookAi - Your Founder's AI Concierge | Smart Email Voice Assistant"
        description="Transform your inbox chaos into daily voice calls. PookAi's AI concierge categorizes emails and calls founders with what matters most. Privacy-first, voice-powered productivity for startup leaders."
        canonical="https://pookai.com"
        keywords="AI voice assistant, email productivity, founder tools, voice AI, email management, startup productivity, AI concierge, email categorization, voice-first productivity, startup founder tools, email automation, voice calls, Gmail integration"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PookAi",
          "description": "AI-powered email concierge that transforms inbox chaos into organized voice summaries for startup founders",
          "url": "https://pookai.com",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "49",
            "priceCurrency": "USD",
            "description": "Founder Tier - Monthly subscription"
          },
          "creator": {
            "@type": "Organization",
            "name": "PookAi Team"
          },
          "featureList": [
            "AI email categorization",
            "Daily voice call summaries",
            "Gmail integration", 
            "Privacy-first design",
            "Startup-focused priorities"
          ]
        }}
      />
      
      <div className="min-h-screen flex flex-col bg-background text-foreground font-primary">
        {/* Navigation */}
        <CleanNavigation currentPage="/" />

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
              <button 
                onClick={handleGetStarted}
                className="neopop-button neopop-button-primary text-lg px-10 py-4 font-medium"
              >
                Scan My Inbox Now
                <motion.span
                  className="ml-3"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>

            {/* Feature Preview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div 
                className="neopop-card rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center neopop-button">
                  <Brain className="text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">Smart Categorization</h3>
                <p className="text-muted-foreground font-light leading-relaxed">AI sorts your emails: "Call me", "Remind me", "Keep quiet", "Why did I sign up for this?"</p>
              </motion.div>
              
              <motion.div 
                className="neopop-card rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center neopop-button">
                  <Phone className="text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">Daily Voice Calls</h3>
                <p className="text-muted-foreground font-light leading-relaxed">Your AI calls you at 9am: "Hey, you've got 3 investor emails and your app is down"</p>
              </motion.div>
              
              <motion.div 
                className="neopop-card rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center neopop-button">
                  <Lock className="text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl mb-4 text-foreground">Privacy First</h3>
                <p className="text-muted-foreground font-light leading-relaxed">We don't sell your data like others. Your inbox secrets stay secret.</p>
              </motion.div>
            </motion.div>

            {/* Quick Access & Internal Links Section */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-muted-foreground mb-6">Explore PookAi Features</p>
              
              {/* Primary Action Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="neopop-button neopop-button-secondary p-4 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  <h3 className="font-semibold text-foreground mb-1">Email Dashboard</h3>
                  <p className="text-sm text-muted-foreground">View categorized emails</p>
                </button>
                
                <button
                  onClick={() => setLocation("/scanning")}
                  className="neopop-button neopop-button-secondary p-4 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  <h3 className="font-semibold text-foreground mb-1">Scan Emails</h3>
                  <p className="text-sm text-muted-foreground">AI email analysis</p>
                </button>
                
                <button
                  onClick={() => setLocation("/call-config")}
                  className="neopop-button neopop-button-secondary p-4 rounded-lg text-center hover:scale-105 transition-transform"
                >
                  <h3 className="font-semibold text-foreground mb-1">Voice Setup</h3>
                  <p className="text-sm text-muted-foreground">Configure voice calls</p>
                </button>
              </div>

              {/* Footer Links */}
              <div className="text-sm text-muted-foreground">
                <p className="mb-4">Learn more about our platform</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setLocation("/privacy")} 
                    className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <span className="text-border">•</span>
                  <button 
                    onClick={() => setLocation("/security")} 
                    className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                  >
                    Security Features
                  </button>
                  <span className="text-border">•</span>
                  <button 
                    onClick={() => setLocation("/support")} 
                    className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                  >
                    Get Support
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}