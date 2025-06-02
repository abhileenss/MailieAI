import { useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Phone, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users directly to the app
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/guided-app');
    }
  }, [isAuthenticated, setLocation]);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-400/5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl translate-x-48 translate-y-48 pointer-events-none"></div>
      
      {/* Navigation Header */}
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-400 rounded-lg flex items-center justify-center shadow-lg shadow-orange-400/25">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold">mailieAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
          <a href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
          <a href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Additional gradient elements for hero */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-orange-400/20 via-orange-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Main Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-orange-400/20 rounded-full border border-orange-400/30 mb-10">
              <span className="text-sm font-semibold text-orange-200">AI Email Intelligence for Busy Professionals</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-10 leading-tight tracking-tight">
              Stop Missing What
              <br />
              <span className="text-orange-400">
                Actually Matters
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-14 max-w-5xl mx-auto leading-relaxed font-medium">
              Your AI concierge calls you daily with urgent emails, filters promotional noise, 
              and gives you back <span className="text-orange-400 font-bold">2+ hours</span> of focused time every day.
            </p>
            
            {/* Enhanced CTA Section */}
            <div className="flex flex-col items-center space-y-8 mb-16">
              <motion.button 
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-black text-black bg-orange-400 rounded-lg shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Start 30-Second Setup
                  <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-300 text-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">30-second setup</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">Enterprise privacy</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Join 500+ professionals who saved 10+ hours this week</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white/20 -ml-2 first:ml-0"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="group bg-gradient-to-br from-zinc-900/90 via-zinc-800/50 to-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-10 text-center hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-400/10 transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-orange-400/25 relative z-10">
                <Brain className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white relative z-10">Smart Categories</h3>
              <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                "Call Me For This", "Why Did I Sign Up?", "Don't Tell Anyone" - categories that actually make sense for your workflow
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-zinc-900/90 via-zinc-800/50 to-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-10 text-center hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-400/10 transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-orange-400/25 relative z-10">
                <Phone className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white relative z-10">Voice Intelligence</h3>
              <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                "Hey, 3 investor emails need responses and your payment processor is down" - delivered naturally by voice
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-zinc-900/90 via-zinc-800/50 to-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-10 text-center hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-400/10 transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-orange-400/25 relative z-10">
                <Lock className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white relative z-10">Enterprise Privacy</h3>
              <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                Zero data selling, zero surveillance. Your email content stays completely private and secure
              </p>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Connect Gmail</h3>
                <p className="text-gray-300">Secure OAuth connection to your email</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI Categorizes</h3>
                <p className="text-gray-300">Smart categorization of all your emails</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Daily Voice Summary</h3>
                <p className="text-gray-300">Get called with what actually matters</p>
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-400 mb-6">Trusted by founders at</p>
            <div className="flex justify-center items-center space-x-8 text-gray-300 text-lg">
              <span>YC Companies</span>
              <span>•</span>
              <span>500 Startups</span>
              <span>•</span>
              <span>Techstars</span>
              <span>•</span>
              <span>AngelList</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">PookAi</span>
              </div>
              <p className="text-gray-400">
                Your AI email concierge for busy professionals
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="#demo" className="block text-gray-400 hover:text-white transition-colors">Demo</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/security" className="block text-gray-400 hover:text-white transition-colors">Security</a>
                <a href="/support" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="mailto:hello@pookai.com" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PookAi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}