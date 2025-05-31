import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mic, Shield, Brain, Phone, Lock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToEmailScan = () => {
    setLocation("/email-scan");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-80"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="text-white text-sm" />
            </div>
            <span className="text-xl font-semibold">PookAi</span>
          </motion.div>
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
              <button onClick={() => setLocation("/privacy")} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => setLocation("/security")} className="hover:text-white transition-colors">Security</button>
              <button onClick={() => setLocation("/support")} className="hover:text-white transition-colors">Support</button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-900 border-t border-gray-700 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-6 py-4 space-y-3">
              <button 
                onClick={() => { setLocation("/privacy"); setMobileMenuOpen(false); }} 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => { setLocation("/security"); setMobileMenuOpen(false); }} 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Security
              </button>
              <button 
                onClick={() => { setLocation("/support"); setMobileMenuOpen(false); }} 
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Support
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
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
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stop drowning in email chaos. Your AI concierge calls you daily with what actually matters, 
              filters the noise, and keeps you focused on building.
            </p>
          </motion.div>

          <motion.div 
            className="mb-12"
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
        </div>
      </div>
    </div>
  );
}