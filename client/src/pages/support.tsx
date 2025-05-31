import { motion } from "framer-motion";
import { MessageCircle, Mail, Book, Headphones, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Support() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            We're here to help you get the most out of your AI concierge.
          </p>
        </motion.div>

        {/* Quick Support Options */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { 
              icon: <MessageCircle className="w-6 h-6" />, 
              title: "Live Chat", 
              desc: "Get instant help from our team",
              action: "Start Chat",
              color: "from-blue-500 to-cyan-500"
            },
            { 
              icon: <Mail className="w-6 h-6" />, 
              title: "Email Support", 
              desc: "Detailed help via email",
              action: "Send Email",
              color: "from-purple-500 to-pink-500"
            },
            { 
              icon: <Book className="w-6 h-6" />, 
              title: "Documentation", 
              desc: "Self-service guides and tutorials",
              action: "Browse Docs",
              color: "from-green-500 to-emerald-500"
            }
          ].map((option, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (option.title === "Email Support") {
                  window.location.href = 'mailto:support@pookai.com';
                } else if (option.title === "Live Chat") {
                  // Placeholder for live chat integration
                  alert("Live chat coming soon! Please email support@pookai.com for now.");
                } else {
                  // Placeholder for documentation
                  alert("Documentation coming soon! Please email support@pookai.com for help.");
                }
              }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                {option.icon}
              </div>
              <h3 className="font-semibold mb-2">{option.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{option.desc}</p>
              <Button 
                size="sm" 
                className={`bg-gradient-to-r ${option.color} hover:opacity-90 text-white border-0`}
              >
                {option.action}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How does PookAi access my emails?",
                answer: "We use secure OAuth 2.0 authentication to connect to your email provider. We only read sender information and metadata - never the actual content of your emails."
              },
              {
                question: "Is my voice data stored permanently?",
                answer: "No. Voice recordings are processed locally when possible and automatically deleted after processing. We never store voice data longer than necessary for the immediate interaction."
              },
              {
                question: "Can I control which emails trigger calls?",
                answer: "Absolutely! You have complete control over categorization rules and can adjust them anytime. You decide what's urgent enough for a call versus what goes in your daily digest."
              },
              {
                question: "What if I want to stop using the service?",
                answer: "You can delete your account and all associated data instantly from your settings. We follow strict data deletion policies and will permanently remove all your information."
              },
              {
                question: "How much does PookAi cost?",
                answer: "We're currently in beta testing. Pricing will be announced before general availability, and beta users will receive special early adopter benefits."
              },
              {
                question: "Which email providers are supported?",
                answer: "Currently we support Gmail and Outlook. Support for additional providers is coming soon based on user demand."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="font-semibold mb-3 text-blue-400">{faq.question}</h3>
                <p className="text-gray-300 text-sm md:text-base">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Response Times */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Support Response Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Critical Issues</h3>
              <p className="text-2xl font-bold text-green-400 mb-1">&lt; 2 hours</p>
              <p className="text-sm text-gray-400">Security, data loss, service down</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">General Support</h3>
              <p className="text-2xl font-bold text-blue-400 mb-1">&lt; 24 hours</p>
              <p className="text-sm text-gray-400">Questions, feature requests</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Enhancement Ideas</h3>
              <p className="text-2xl font-bold text-purple-400 mb-1">&lt; 3 days</p>
              <p className="text-sm text-gray-400">Feature suggestions, feedback</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 md:p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">Still Need Help?</h2>
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Our founder-focused support team understands the unique challenges of running a startup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = 'mailto:support@pookai.com'}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button 
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 text-white"
                onClick={() => window.location.href = 'mailto:founders@pookai.com'}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Founder Feedback
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="bg-transparent border-gray-600 hover:bg-gray-800 text-white px-6 py-3"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}