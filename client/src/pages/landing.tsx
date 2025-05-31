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
      
      <div className="min-h-screen flex flex-col relative bg-black text-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-80"></div>
        
        {/* Navigation */}
        <Navigation currentPage="/" />

        {/* Hero Section */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Founder's
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Concierge
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                Stop drowning in email chaos. Your AI concierge calls you daily with what actually matters, 
                filters the noise, and keeps you focused on building.
              </p>
            </motion.div>

            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                onClick={navigateToEmailScan}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                Scan My Inbox Now
                <motion.span
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>

            {/* Feature Preview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Brain className="text-white w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Smart Categorization</h3>
                <p className="text-sm text-gray-400">AI sorts your emails: "Call me", "Remind me", "Keep quiet", "Why did I sign up for this?"</p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Phone className="text-white w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Daily Voice Calls <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded ml-1">Coming Soon</span></h3>
                <p className="text-sm text-gray-400">Your AI calls you at 9am: "Hey, you've got 3 investor emails and your app is down"</p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Lock className="text-white w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-gray-400">We don't sell your data like others. Your inbox secrets stay secret.</p>
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