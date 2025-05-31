import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SenderCard } from "@/components/sender-card";
import { EmailPreview } from "@/components/email-preview";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { mockEmailSenders, EmailSender } from "@/data/mock-data";

export default function EmailScan() {
  const [, setLocation] = useLocation();
  const [emailSenders, setEmailSenders] = useState<EmailSender[]>(() => {
    const saved = localStorage.getItem('pookai-email-senders');
    return saved ? JSON.parse(saved) : mockEmailSenders;
  });
  const [selectedSender, setSelectedSender] = useState<EmailSender | null>(null);

  const handleCategoryChange = (senderId: string, category: string) => {
    const updatedSenders = emailSenders.map(sender => 
      sender.id === senderId 
        ? { ...sender, category: category as EmailSender['category'] }
        : sender
    );
    setEmailSenders(updatedSenders);
    localStorage.setItem('pookai-email-senders', JSON.stringify(updatedSenders));
    
    // Update selected sender if it's the one being modified
    if (selectedSender?.id === senderId) {
      setSelectedSender(prev => prev ? { ...prev, category: category as EmailSender['category'] } : null);
    }
  };

  const categorizedSenders = emailSenders.filter(sender => sender.category !== 'unassigned');
  const unassignedSenders = emailSenders.filter(sender => sender.category === 'unassigned');

  const navigateToPersonalization = () => {
    setLocation("/personalization");
  };

  return (
    <>
      <SEOHead 
        title="Email Scan - Categorize Your Inbox | PookAi"
        description="Scan and categorize your email senders with PookAi's smart AI. Sort emails into 'Call Me', 'Remind Me', and other founder-focused categories for better productivity."
        canonical="https://pookai.com/email-scan"
        keywords="email categorization, inbox management, email sorting, AI email assistant, email productivity, startup email tools"
      />
      
      <div className="min-h-screen bg-background text-foreground font-primary">
        <Navigation currentPage="/email-scan" />
        
        <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold mb-3 tracking-tight">Your Inbox, Decoded</h1>
              <p className="text-muted-foreground text-lg">Found {emailSenders.length} email senders flooding your inbox. Time to take control.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 neopop-button text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Analysis Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout - Unroll.me Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Panel - Sender List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Email Senders ({unassignedSenders.length} unassigned)</h3>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                Select to categorize
              </span>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {unassignedSenders.length > 0 ? (
                unassignedSenders.map((sender, index) => (
                  <motion.div
                    key={sender.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <SenderCard
                      sender={sender}
                      isSelected={selectedSender?.id === sender.id}
                      onSelect={() => setSelectedSender(sender)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">All Done!</h3>
                  <p className="text-sm">All senders have been categorized.</p>
                  <p className="text-xs mt-1 text-gray-500">Ready to configure your preferences.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel - Email Preview & Categorization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <EmailPreview 
              sender={selectedSender}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>
        </div>

        {/* Categorized Senders Summary */}
        {categorizedSenders.length > 0 && (
          <motion.div 
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="font-semibold mb-4 flex items-center">
              <Star className="text-amber-400 mr-2 w-5 h-5" />
              Your Concierge Rules ({categorizedSenders.length} configured)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedSenders.map((sender) => (
                <motion.div
                  key={sender.id}
                  className="bg-gray-800 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{sender.name}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">{sender.count}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {sender.category === 'call-me' && '📞 Call Me For This'}
                    {sender.category === 'remind-me' && '🔔 Remind Me For This'}
                    {sender.category === 'keep-quiet' && '🤫 Keep But Don\'t Care'}
                    {sender.category === 'why-did-i-signup' && '🤦 Why Did I Sign Up For This?'}
                    {sender.category === 'dont-tell-anyone' && '🤐 Don\'t Tell Anyone'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={navigateToPersonalization}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            disabled={categorizedSenders.length === 0}
          >
            {categorizedSenders.length === 0 
              ? 'Categorize some senders first' 
              : `Continue with ${categorizedSenders.length} rules`
            }
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
        </div>
      </div>
    </>
  );
}
