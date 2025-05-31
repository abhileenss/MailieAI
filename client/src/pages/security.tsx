import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle, Eye, Database, CheckCircle, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Security() {
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
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Security</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            How we protect your data and ensure secure voice AI interactions.
          </p>
        </motion.div>

        {/* Security Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: <Shield className="w-6 h-6" />, title: "Enterprise-Grade Security", desc: "Military-level encryption and security protocols" },
            { icon: <Eye className="w-6 h-6" />, title: "Zero-Knowledge Processing", desc: "Your data stays private, even from us" },
            { icon: <AlertTriangle className="w-6 h-6" />, title: "Threat Monitoring", desc: "24/7 security monitoring and incident response" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Security Measures */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Voice AI Security */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-red-400">Voice AI Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Voice Authentication
                </h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-2">
                  <li>• Voiceprint analysis for caller verification</li>
                  <li>• Multi-factor authentication for sensitive operations</li>
                  <li>• Real-time voice deepfake detection</li>
                  <li>• Background noise analysis for security</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Processing Security
                </h3>
                <ul className="text-gray-300 text-sm md:text-base space-y-2">
                  <li>• Edge processing to minimize data transmission</li>
                  <li>• Ephemeral voice data with automatic deletion</li>
                  <li>• Encrypted audio streams end-to-end</li>
                  <li>• Secure API integrations with voice providers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Email Security */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-green-400">Email Data Protection</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Secure Email Integration</h3>
                <p className="text-gray-300 text-sm md:text-base mb-3">
                  We use OAuth 2.0 for secure email provider connections, ensuring your credentials never pass through our systems.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Data Minimization</h4>
                    <p className="text-gray-400 text-sm">Only sender metadata is processed, never email content</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300 mb-1">Encrypted Storage</h4>
                    <p className="text-gray-400 text-sm">All sender data encrypted with AES-256</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Risks & Mitigation */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Known Risks & Our Response</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-red-400 mb-2">Voice Data Vulnerabilities</h3>
                <p className="text-gray-300 text-sm md:text-base mb-2">
                  Voice recordings may capture unintended background conversations or sensitive information.
                </p>
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="font-medium text-green-300 mb-1">Our Mitigation:</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Local voice processing when possible</li>
                    <li>• Automatic deletion after processing</li>
                    <li>• Voice activity detection to minimize recording</li>
                    <li>• User-controlled recording permissions</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-400 mb-2">API Integration Risks</h3>
                <p className="text-gray-300 text-sm md:text-base mb-2">
                  Multiple third-party integrations increase the attack surface for potential data breaches.
                </p>
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="font-medium text-green-300 mb-1">Our Mitigation:</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Minimal necessary permissions for all integrations</li>
                    <li>• Regular security audits of third-party services</li>
                    <li>• Encrypted API communications (TLS 1.3)</li>
                    <li>• Fallback systems for service interruptions</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-blue-400 mb-2">Performance vs Security Trade-offs</h3>
                <p className="text-gray-300 text-sm md:text-base mb-2">
                  Voice AI latency requirements sometimes conflict with maximum security measures.
                </p>
                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="font-medium text-green-300 mb-1">Our Approach:</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Adaptive security based on content sensitivity</li>
                    <li>• Edge computing for latency-critical operations</li>
                    <li>• Progressive security enhancement options</li>
                    <li>• User control over security vs performance balance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Compliance & Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Current Compliance</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm md:text-base">GDPR (EU)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm md:text-base">CCPA (California)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm md:text-base">TCPA (US Voice Calling)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm md:text-base">TRAI (India Voice Calling)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Security Practices</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm md:text-base">Regular penetration testing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm md:text-base">24/7 security monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm md:text-base">Incident response procedures</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm md:text-base">Employee security training</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Security Team */}
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-red-300">Security Concerns?</h2>
            <p className="text-gray-300 text-sm md:text-base mb-4">
              If you discover a security vulnerability or have concerns about our security practices, 
              please contact our security team immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = 'mailto:security@pookai.com'}
              >
                Report Security Issue
              </Button>
              <Button 
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 text-white"
                onClick={() => setLocation("/support")}
              >
                Contact Support
              </Button>
            </div>
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