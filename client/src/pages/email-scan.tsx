import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle, Star, ArrowRight, AlertCircle, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SenderCard } from "@/components/sender-card";
import { EmailPreview } from "@/components/email-preview";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { EmailSender, categoryBuckets } from "@/data/mock-data";

export default function EmailScan() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedSender, setSelectedSender] = useState<EmailSender | null>(null);
  const queryClient = useQueryClient();

  // Fetch email senders from the database
  const { data: emailSenders = [], isLoading, error } = useQuery({
    queryKey: ['/api/emails/senders'],
    enabled: isAuthenticated,
    retry: 1
  });

  // Mutation for updating email categories
  const categorizeMutation = useMutation({
    mutationFn: async ({ senderId, category }: { senderId: string; category: string }) => {
      return apiRequest(`/api/emails/senders/${senderId}/category`, 'PATCH', { category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails/senders'] });
    }
  });

  const handleCategoryChange = (senderId: string, category: string) => {
    categorizeMutation.mutate({ senderId, category });
    
    // Update selected sender if it's the one being modified
    if (selectedSender?.id === senderId) {
      setSelectedSender(prev => prev ? { ...prev, category: category as EmailSender['category'] } : null);
    }
  };

  const categorizedSenders = emailSenders.filter(sender => sender.category !== 'unassigned');
  const unassignedSenders = emailSenders.filter(sender => sender.category === 'unassigned');

  // Calculate category statistics from real data
  const categoryStats = {
    'call-me': emailSenders.filter(s => s.category === 'call-me').length,
    'remind-me': emailSenders.filter(s => s.category === 'remind-me').length,
    'keep-quiet': emailSenders.filter(s => s.category === 'keep-quiet').length,
    'newsletter': emailSenders.filter(s => s.category === 'newsletter').length,
    'why-did-i-signup': emailSenders.filter(s => s.category === 'why-did-i-signup').length,
    'dont-tell-anyone': emailSenders.filter(s => s.category === 'dont-tell-anyone').length,
    'unassigned': unassignedSenders.length
  };

  const totalEmails = emailSenders.reduce((sum, sender) => sum + (sender.emailCount || sender.count || 0), 0);

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
              <p className="text-muted-foreground text-lg">Found {emailSenders.length} email senders with {totalEmails} total emails. AI categorized {categorizedSenders.length} senders.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 neopop-button text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Analysis Complete</span>
              </div>
            </div>
          </div>

          {/* User-Controlled Category Buckets */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Categorize Your Email Senders</h3>
                <p className="text-sm text-gray-400">Drag senders into buckets based on what YOU want to be called about</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{emailSenders.length} senders</span>
              </div>
            </div>
            
            {/* Category Buckets - User Choice */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryBuckets.map((bucket) => {
                const sendersInBucket = emailSenders.filter(s => s.category === bucket.id);
                return (
                  <motion.div
                    key={bucket.id}
                    className={`p-4 border-2 border-dashed rounded-xl min-h-[120px] ${bucket.color} transition-all duration-200 hover:border-solid`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{bucket.emoji}</span>
                      <div>
                        <h4 className="font-medium text-sm">{bucket.name}</h4>
                        <p className="text-xs opacity-70">{bucket.description}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{sendersInBucket.length}</div>
                      <div className="text-xs">senders</div>
                    </div>
                  </motion.div>
                );
              })}
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* AI Voice Script for "Call Me" Items */}
          <Button
            onClick={async () => {
              const callMeEmails = emailSenders.filter(s => s.category === 'call-me');
              if (callMeEmails.length === 0) {
                alert('No emails categorized as "Call Me" yet. Drag important senders into the "Call Me" bucket first.');
                return;
              }
              
              try {
                const response = await fetch('/api/calls/generate-script', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    senderIds: callMeEmails.map(s => s.id),
                    callType: 'user-priority'
                  })
                });
                
                if (response.ok) {
                  const data = await response.json();
                  alert(`AI Voice Script Generated!\n\nFrom your ${callMeEmails.length} "Call Me" senders:\n\n${data.script}\n\nThis script uses your actual email content.`);
                } else {
                  alert('Please re-authenticate with Gmail to generate voice scripts from your real email data.');
                }
              } catch (error) {
                alert('Error generating voice script from your categorized emails.');
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 neopop-button font-medium transition-all duration-300"
            disabled={emailSenders.filter(s => s.category === 'call-me').length === 0}
          >
            Generate Voice Script for "Call Me" Items
            <Star className="ml-2 w-4 h-4" />
          </Button>

          <Button
            onClick={navigateToPersonalization}
            className="bg-primary hover:bg-primary/90 text-background px-8 py-4 neopop-button font-medium transition-all duration-300 transform hover:scale-105"
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
