import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, Clock, Zap, Shield, AlertTriangle, TrendingUp, Calendar, Bell, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/navigation";

export default function Personalization() {
  const [, setLocation] = useLocation();
  
  // Smart preferences with user choice between Call/Digest
  const [preferences, setPreferences] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('pookai-preferences');
    return saved ? JSON.parse(saved) : {
      "urgent-financial": "call-me",
      "investor-updates": "call-me", 
      "customer-issues": "call-me",
      "team-urgent": "digest",
      "partnership-deals": "coming-soon",
      "product-launches": "coming-soon"
    };
  });

  const [meetingReminders, setMeetingReminders] = useState({
    timing: "30-minutes",
    frequency: "all-meetings",
    method: "call-and-digest"
  });

  // Founder preference categories
  const preferenceCategories = [
    {
      id: "urgent-financial",
      label: "Payment Failures & Financial Alerts",
      description: "Stripe failures, banking issues, revenue drops",
      icon: <Zap className="w-5 h-5" />,
      color: "from-red-500 to-orange-500",
      defaultValue: "call-me"
    },
    {
      id: "investor-updates", 
      label: "Investor & Accelerator Communications",
      description: "Y Combinator, VCs, board member emails",
      icon: <Brain className="w-5 h-5" />,
      color: "from-blue-500 to-purple-500",
      defaultValue: "call-me"
    },
    {
      id: "customer-issues",
      label: "Customer Complaints & Escalations", 
      description: "Angry customers, product issues, support tickets",
      icon: <Shield className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      defaultValue: "call-me"
    },
    {
      id: "team-urgent",
      label: "Team Emergency Notifications",
      description: "Slack alerts, production down, security issues", 
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "from-amber-500 to-yellow-500",
      defaultValue: "digest"
    },
    {
      id: "partnership-deals",
      label: "Partnership & Deal Updates",
      description: "Business development, contracts, negotiations",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-indigo-500 to-blue-500",
      defaultValue: "coming-soon"
    },
    {
      id: "product-launches",
      label: "Product & Feature Announcements",
      description: "Launch updates, feature releases, roadmap changes",
      icon: <Clock className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      defaultValue: "coming-soon"
    }
  ];

  const handlePreferenceChange = (categoryId: string, value: string) => {
    const updatedPreferences = {
      ...preferences,
      [categoryId]: value
    };
    setPreferences(updatedPreferences);
    localStorage.setItem('pookai-preferences', JSON.stringify(updatedPreferences));
  };

  const navigateToCallConfig = () => {
    setLocation("/call-config");
  };

  const getPreferenceDisplay = (value: string) => {
    switch(value) {
      case "call-me": return { label: "Call Me", color: "text-primary", bg: "bg-primary/20" };
      case "digest": return { label: "Daily Digest", color: "text-muted-foreground", bg: "bg-muted/40" };
      case "coming-soon": return { label: "Coming Soon", color: "text-primary", bg: "bg-primary/10" };
      default: return { label: "Off", color: "text-muted-foreground", bg: "bg-border/40" };
    }
  };

  return (
    <>
      <SEOHead 
        title="Personalize Your Concierge - Smart Founder Defaults | PookAi"
        description="Configure your AI concierge with smart defaults designed for founders. Set preferences for payment alerts, investor updates, customer issues, and meeting reminders."
        canonical="https://pookai.com/personalization"
        keywords="founder preferences, AI concierge settings, email priority configuration, startup productivity dashboard"
      />
      
      <div className="min-h-screen bg-background text-foreground font-primary">
        <Navigation currentPage="/personalization" />
        
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
              Your Concierge Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Smart defaults optimized for founders. Choose how you want to be notified for each type of communication.
            </p>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
            
            {/* Left Column - Email Preferences */}
            <div className="xl:col-span-2 space-y-6">
              <motion.div 
                className="neopop-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-amber-400 flex items-center">
                  <Mail className="w-6 h-6 mr-3" />
                  Email Priorities
                </h2>
                
                <div className="space-y-4">
                  {preferenceCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} flex-shrink-0`}>
                            {category.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-1">{category.label}</h3>
                            <p className="text-sm text-gray-400">{category.description}</p>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          {category.defaultValue === "coming-soon" ? (
                            <div className="px-3 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-sm font-medium">
                              Coming Soon
                            </div>
                          ) : (
                            <Select
                              value={preferences[category.id] || "off"}
                              onValueChange={(value) => handlePreferenceChange(category.id, value)}
                            >
                              <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="call-me">
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-red-400" />
                                    <span>Call Me</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="digest">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    <span>Daily Digest</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="off">
                                  <span className="text-gray-400">Off</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Meeting & Summary */}
            <div className="space-y-6">
              
              {/* Meeting Reminders */}
              <motion.div 
                className="bg-gray-900 border border-amber-600/20 rounded-xl p-3 md:p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-base font-semibold mb-2 text-amber-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Meeting Reminders
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">When:</label>
                      <Select value={meetingReminders.timing} onValueChange={(value) => setMeetingReminders(prev => ({...prev, timing: value}))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-minutes">15 min</SelectItem>
                          <SelectItem value="30-minutes">30 min</SelectItem>
                          <SelectItem value="1-hour">1 hour</SelectItem>
                          <SelectItem value="2-hours">2 hours</SelectItem>
                          <SelectItem value="1-day">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-400">How:</label>
                      <Select value={meetingReminders.method} onValueChange={(value) => setMeetingReminders(prev => ({...prev, method: value}))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call-only">Call</SelectItem>
                          <SelectItem value="digest-only">Digest</SelectItem>
                          <SelectItem value="call-and-digest">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">Which meetings:</label>
                    <Select value={meetingReminders.frequency} onValueChange={(value) => setMeetingReminders(prev => ({...prev, frequency: value}))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-meetings">All meetings</SelectItem>
                        <SelectItem value="important-only">Important only</SelectItem>
                        <SelectItem value="external-only">External only</SelectItem>
                        <SelectItem value="investor-calls">Investor calls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>

              {/* Configuration Summary */}
              <motion.div 
                className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="font-semibold mb-4 text-amber-300 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Your Configuration
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Immediate calls:</span>
                    <span className="text-green-400 font-medium">
                      {Object.values(preferences).filter(v => v === "call-me").length} categories
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Daily digest:</span>
                    <span className="text-blue-400 font-medium">
                      {Object.values(preferences).filter(v => v === "digest").length} categories
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Meeting reminders:</span>
                    <span className="text-amber-400 font-medium">
                      {meetingReminders.timing.replace('-', ' ')} before
                    </span>
                  </div>
                  <div className="border-t border-amber-500/20 pt-3 mt-3">
                    <p className="text-gray-400 text-xs">
                      Everything else gets sorted into "Keep Quiet" automatically.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Continue Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              onClick={navigateToCallConfig}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Configure Voice Settings
              <motion.span
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}