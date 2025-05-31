import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Lightbulb, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/voice-input";
import { mockSuggestions } from "@/data/mock-data";

export default function Personalization() {
  const [, setLocation] = useLocation();
  const [importanceText, setImportanceText] = useState("");
  const [scheduleText, setScheduleText] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleVoiceTranscription = (text: string) => {
    setImportanceText(text);
  };

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(id) 
        ? prev.filter(suggestionId => suggestionId !== id)
        : [...prev, id]
    );
  };

  const navigateToCallConfig = () => {
    setLocation("/call-config");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-4">What's important to you?</h1>
          <p className="text-gray-400">Every founder is different. Help your concierge understand your chaos.</p>
        </motion.div>

        {/* Voice Input Section */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xs">Voice Coming Soon</span>
            </div>
            <p className="text-gray-400">Click to speak or type below</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">What's important to you today?</label>
              <Textarea
                value={importanceText}
                onChange={(e) => setImportanceText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                placeholder="I'm a startup founder, so I need to prioritize investor communications, customer complaints, and urgent team updates. Please filter out promotional emails and most newsletters unless they're from Y Combinator or other accelerators."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Describe your typical founder chaos</label>
              <Textarea
                value={scheduleText}
                onChange={(e) => setScheduleText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                placeholder="I'm usually up by 6 AM checking emails, have back-to-back meetings from 10-4, and do my best work late at night. Investors expect immediate responses, but I forget to reply to newsletters for weeks."
              />
            </div>
          </div>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-semibold mb-4 flex items-center">
            <Lightbulb className="text-amber-400 mr-2 w-5 h-5" />
            AI Suggestions Based on Your Inbox
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                  selectedSuggestions.includes(suggestion.id)
                    ? 'border-2 border-green-500 bg-green-500/10'
                    : 'border border-gray-700 hover:bg-gray-700'
                }`}
                onClick={() => toggleSuggestion(suggestion.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-gray-400">{suggestion.description}</p>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: selectedSuggestions.includes(suggestion.id) ? 180 : 0,
                      scale: selectedSuggestions.includes(suggestion.id) ? 1.1 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedSuggestions.includes(suggestion.id) ? (
                      <Check className="text-green-400 w-5 h-5" />
                    ) : (
                      <Plus className="text-gray-400 w-5 h-5" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={navigateToCallConfig}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Configure Voice Calls
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
