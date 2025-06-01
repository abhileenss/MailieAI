import { motion } from "framer-motion";
import { Brain, Phone, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl text-slate-900">PookAi</span>
            </div>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900 leading-tight">
              Your Founder's
              <br />
              <span className="text-blue-600">AI Concierge</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
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
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6"
            >
              Scan My Inbox Now
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Feature Preview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div 
              className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-slate-900">Smart Categorization</h3>
              <p className="text-slate-600 leading-relaxed">
                AI sorts your emails: "Call me", "Remind me", "Keep quiet", "Why did I sign up for this?"
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Phone className="text-white w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-slate-900">Daily Voice Calls</h3>
              <p className="text-slate-600 leading-relaxed">
                Your AI calls you at 9am: "Hey, you've got 3 investor emails and your app is down"
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-16 h-16 bg-purple-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-slate-900">Privacy First</h3>
              <p className="text-slate-600 leading-relaxed">
                We don't sell your data like others. Your inbox secrets stay secret.
              </p>
            </motion.div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Transform Your Inbox?</h3>
              <p className="text-slate-600 mb-6">
                Connect your Gmail and let our AI start organizing your emails today
              </p>
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Connect Gmail & Start Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}