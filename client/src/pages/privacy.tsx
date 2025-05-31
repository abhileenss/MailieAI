import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
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
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Your privacy is our priority. Here's how we protect and handle your data.
          </p>
        </motion.div>

        {/* Privacy Principles */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: <Lock className="w-6 h-6" />, title: "End-to-End Encryption", desc: "All data encrypted in transit and at rest" },
            { icon: <Eye className="w-6 h-6" />, title: "Zero-Knowledge Architecture", desc: "We process data locally when possible" },
            { icon: <Database className="w-6 h-6" />, title: "Data Minimization", desc: "We only collect what's absolutely necessary" },
            { icon: <CheckCircle className="w-6 h-6" />, title: "Your Control", desc: "Delete your data anytime, instantly" }
          ].map((principle, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                {principle.icon}
              </div>
              <h3 className="font-semibold mb-2">{principle.title}</h3>
              <p className="text-sm text-gray-400">{principle.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Data We Collect */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">What Data We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email Metadata</h3>
                <p className="text-gray-300 text-sm md:text-base">Sender information, subject lines, and timestamps to categorize your inbox. We never store email content.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Preference Settings</h3>
                <p className="text-gray-300 text-sm md:text-base">Your categorization choices and notification preferences to personalize your experience.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Voice Interaction Data</h3>
                <p className="text-gray-300 text-sm md:text-base">Voice recordings are processed locally when possible and automatically deleted after processing.</p>
              </div>
            </div>
          </div>

          {/* How We Protect Your Data */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-green-400">How We Protect Your Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Technical Safeguards</h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-1">
                  <li>• AES-256 encryption for all stored data</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• Zero-knowledge architecture where possible</li>
                  <li>• Regular security audits and penetration testing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Access Controls</h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-1">
                  <li>• Multi-factor authentication required</li>
                  <li>• Role-based access for our team</li>
                  <li>• Audit logs for all data access</li>
                  <li>• Automatic session timeouts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Third-Party Integrations */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Third-Party Integrations</h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm md:text-base">We integrate with email providers and voice services to deliver our functionality:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Email Providers</h4>
                  <p className="text-gray-400 text-sm">Gmail, Outlook - Read-only access for sender identification only</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Voice Services</h4>
                  <p className="text-gray-400 text-sm">OpenAI, Twilio - Processed data is encrypted and immediately deleted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Your Privacy Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Data Access & Control</h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-1">
                  <li>• Export all your data anytime</li>
                  <li>• Delete your account and data instantly</li>
                  <li>• Modify or correct any stored information</li>
                  <li>• Opt out of specific data processing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-1">
                  <li>• Request details about data processing</li>
                  <li>• Receive notifications of policy changes</li>
                  <li>• Access logs of your data usage</li>
                  <li>• Contact our privacy team directly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Legal Compliance</h2>
            <p className="text-gray-300 text-sm md:text-base mb-4">
              We comply with major privacy regulations including GDPR, CCPA, and other applicable data protection laws. 
              Our voice calling features are designed to meet TCPA requirements in the US and TRAI regulations in India.
            </p>
            <p className="text-gray-400 text-sm">
              Last updated: May 31, 2025. We'll notify you of any significant changes to this policy.
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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