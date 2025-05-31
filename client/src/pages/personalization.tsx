import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Brain, Clock, Zap, Shield, AlertTriangle, TrendingUp, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Personalization() {
  const [, setLocation] = useLocation();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "urgent-financial", "investor-updates", "customer-issues"
  ]);
  const [meetingReminders, setMeetingReminders] = useState({
    timing: "30-minutes",
    frequency: "all-meetings",
    method: "call-and-digest"
  });

  // Smart defaults based on founder patterns from email categorization
  const founderPreferences = [
    {
      id: "urgent-financial",
      label: "Payment failures & financial alerts",
      description: "Stripe failures, banking issues, revenue drops",
      icon: <Zap className="w-5 h-5" />,
      category: "Call Me Immediately",
      defaultSelected: true,
      color: "from-red-500 to-orange-500"
    },
    {
      id: "investor-updates", 
      label: "Investor & accelerator communications",
      description: "Y Combinator, VCs, board member emails",
      icon: <Brain className="w-5 h-5" />,
      category: "Call Me Immediately", 
      defaultSelected: true,
      color: "from-blue-500 to-purple-500"
    },
    {
      id: "customer-issues",
      label: "Customer complaints & escalations", 
      description: "Angry customers, product issues, support tickets",
      icon: <Shield className="w-5 h-5" />,
      category: "Call Me Immediately",
      defaultSelected: true,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "team-urgent",
      label: "Team emergency notifications",
      description: "Slack alerts, production down, security issues", 
      icon: <AlertTriangle className="w-5 h-5" />,
      category: "Call Me Immediately",
      defaultSelected: false,
      color: "from-amber-500 to-yellow-500"
    },
    {
      id: "partnership-deals",
      label: "Partnership & deal updates",
      description: "Business development, contracts, negotiations",
      icon: <TrendingUp className="w-5 h-5" />,
      category: "Daily Digest",
      defaultSelected: false,
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: "product-launches",
      label: "Product & feature announcements",
      description: "Launch updates, feature releases, roadmap changes",
      icon: <Clock className="w-5 h-5" />,
      category: "Daily Digest",
      defaultSelected: false,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handlePreferenceToggle = (preferenceId: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const navigateToCallConfig = () => {
    setLocation("/call-config");
  };

  const immediatePreferences = founderPreferences.filter(p => p.category === "Call Me Immediately");
  const digestPreferences = founderPreferences.filter(p => p.category === "Daily Digest");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-4">Smart Founder Defaults</h1>
          <p className="text-gray-400">Based on your email patterns, we've pre-selected what most founders need. Adjust as needed.</p>
        </motion.div>

        {/* Immediate Call Preferences */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4 text-red-400">
            📞 Call Me Immediately For:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {immediatePreferences.map((pref, index) => (
              <motion.div
                key={pref.id}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-300 border-2 ${
                  selectedPreferences.includes(pref.id)
                    ? 'border-green-400 bg-green-500/10'
                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handlePreferenceToggle(pref.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${pref.color}`}>
                    {pref.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{pref.label}</h4>
                    <p className="text-sm text-gray-400">{pref.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPreferences.includes(pref.id) 
                      ? 'border-green-400 bg-green-400' 
                      : 'border-gray-500'
                  }`}>
                    {selectedPreferences.includes(pref.id) && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Digest Preferences */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-semibold mb-4 text-blue-400">
            📋 Include in Daily Digest:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digestPreferences.map((pref, index) => (
              <motion.div
                key={pref.id}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-300 border-2 ${
                  selectedPreferences.includes(pref.id)
                    ? 'border-blue-400 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handlePreferenceToggle(pref.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${pref.color}`}>
                    {pref.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{pref.label}</h4>
                    <p className="text-sm text-gray-400">{pref.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPreferences.includes(pref.id) 
                      ? 'border-blue-400 bg-blue-400' 
                      : 'border-gray-500'
                  }`}>
                    {selectedPreferences.includes(pref.id) && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meeting & Event Reminders */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="font-semibold mb-4 text-purple-400 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Meeting & Event Reminders
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reminder Timing */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Remind me before:</label>
              <Select value={meetingReminders.timing} onValueChange={(value) => setMeetingReminders(prev => ({...prev, timing: value}))}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-minutes">15 minutes</SelectItem>
                  <SelectItem value="30-minutes">30 minutes</SelectItem>
                  <SelectItem value="1-hour">1 hour</SelectItem>
                  <SelectItem value="2-hours">2 hours</SelectItem>
                  <SelectItem value="1-day">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Which meetings:</label>
              <Select value={meetingReminders.frequency} onValueChange={(value) => setMeetingReminders(prev => ({...prev, frequency: value}))}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-meetings">All meetings</SelectItem>
                  <SelectItem value="important-only">Important only</SelectItem>
                  <SelectItem value="external-only">External only</SelectItem>
                  <SelectItem value="investor-calls">Investor calls only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reminder Method */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">How to remind:</label>
              <Select value={meetingReminders.method} onValueChange={(value) => setMeetingReminders(prev => ({...prev, method: value}))}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call-only">Call me</SelectItem>
                  <SelectItem value="digest-only">Daily digest only</SelectItem>
                  <SelectItem value="call-and-digest">Both call & digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center text-purple-300 text-sm">
              <Bell className="w-4 h-4 mr-2" />
              <span>
                I'll {meetingReminders.method === 'call-only' ? 'call you' : meetingReminders.method === 'digest-only' ? 'include in digest' : 'call you and include in digest'} 
                {' '}{meetingReminders.timing.replace('-', ' ')} before {meetingReminders.frequency.replace('-', ' ')}.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Smart Summary */}
        <motion.div 
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="font-semibold mb-3 text-blue-300">Your Concierge Summary:</h3>
          <p className="text-gray-300 text-sm">
            We'll call you immediately for <span className="text-green-400 font-medium">{selectedPreferences.filter(id => immediatePreferences.find(p => p.id === id)).length} types</span> of urgent updates, 
            include <span className="text-blue-400 font-medium">{selectedPreferences.filter(id => digestPreferences.find(p => p.id === id)).length} categories</span> in your daily digest,
            and remind you about meetings <span className="text-purple-400 font-medium">{meetingReminders.timing.replace('-', ' ')}</span> in advance.
          </p>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={navigateToCallConfig}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Configure Call Schedule
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}