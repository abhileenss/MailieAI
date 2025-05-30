import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Mic, Shield, Brain, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  const navigateToEmailScan = () => {
    setLocation("/email-scan");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-80"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
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
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              AI calls you daily
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your voice-first productivity assistant that scans your inbox and calls you every day with what actually matters.
            </p>
            
            {/* Privacy Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Shield className="text-green-400 w-4 h-4" />
              <span className="text-sm text-gray-300">Privacy-first • End-to-end encrypted</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                onClick={navigateToEmailScan}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                style={{
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Connect Gmail</span>
                  <motion.span
                    className="text-sm"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </Button>
              
              <Button
                onClick={navigateToEmailScan}
                variant="outline"
                className="group bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <span>Connect Work Email</span>
                  <motion.span
                    className="text-sm"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="relative z-10 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Brain className="text-white w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Smart Analysis</h3>
              <p className="text-sm text-gray-400">AI scans your inbox and identifies what's actually important</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Phone className="text-white w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Daily Voice Calls</h3>
              <p className="text-sm text-gray-400">Personalized daily briefings delivered by voice</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Lock className="text-white w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Zero Storage</h3>
              <p className="text-sm text-gray-400">Your data stays yours - we never store your emails</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
