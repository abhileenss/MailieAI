import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/summary-card";
import { mockEmailSummaries, EmailSummary } from "@/data/mock-data";

export default function EmailScan() {
  const [, setLocation] = useLocation();
  const [selectedItems, setSelectedItems] = useState<EmailSummary[]>([]);

  const handleSelectSummary = (summary: EmailSummary) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(item => item.id === summary.id);
      if (isSelected) {
        return prev.filter(item => item.id !== summary.id);
      } else {
        return [...prev, summary];
      }
    });
  };

  const navigateToPersonalization = () => {
    setLocation("/personalization");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Inbox Analysis Complete</h1>
              <p className="text-gray-400">We've analyzed your last 30 days of email activity</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Scan Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {mockEmailSummaries.map((summary, index) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <SummaryCard
                summary={summary}
                isSelected={selectedItems.some(item => item.id === summary.id)}
                onSelect={() => handleSelectSummary(summary)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Items */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-semibold mb-4 flex items-center">
            <Star className="text-amber-400 mr-2 w-5 h-5" />
            Your Priority Items
          </h3>
          <div className="space-y-3">
            {selectedItems.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <p>Click on the summary cards above to add items to your priority list</p>
              </div>
            ) : (
              selectedItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3">
                    <Star className="text-amber-400 w-4 h-4" />
                    <div>
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-gray-400 ml-2">({item.count} items)</span>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Call Priority</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={navigateToPersonalization}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Continue to Personalization
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
