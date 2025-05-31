import { motion } from "framer-motion";
import { EmailSender, categoryBuckets } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, DollarSign } from "lucide-react";

interface EmailPreviewProps {
  sender: EmailSender | null;
  onCategoryChange: (senderId: string, category: string) => void;
}

export function EmailPreview({ sender, onCategoryChange }: EmailPreviewProps) {
  if (!sender) {
    return (
      <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-8 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <i className="fas fa-envelope text-4xl mb-4"></i>
          </motion.div>
          <p>Select a sender to preview their latest email</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter':
        return 'bg-blue-500/20 text-blue-400';
      case 'tool':
        return 'bg-green-500/20 text-green-400';
      case 'meeting':
        return 'bg-purple-500/20 text-purple-400';
      case 'promotional':
        return 'bg-orange-500/20 text-orange-400';
      case 'personal':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {sender.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{sender.name}</h3>
            <p className="text-sm text-gray-400">{sender.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${getTypeColor(sender.type)}`}>
            {sender.type}
          </span>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
            {sender.count} emails
          </span>
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-white">{sender.latestSubject}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">{sender.latestDate}</span>
            <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{sender.latestPreview}</p>
        
        {/* Action icons based on type */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            {sender.type === 'meeting' && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Meeting scheduled</span>
              </div>
            )}
            {(sender.type === 'tool' && sender.name === 'Stripe') && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>Payment received</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Assignment */}
      <div className="space-y-4">
        <h4 className="font-medium text-white">How should I handle emails from {sender.name}?</h4>
        <div className="grid grid-cols-1 gap-3">
          {categoryBuckets.map((bucket) => (
            <motion.button
              key={bucket.id}
              className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                sender.category === bucket.id
                  ? `${bucket.color} border-current`
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
              onClick={() => onCategoryChange(sender.id, bucket.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium">{bucket.title}</div>
              <div className="text-sm opacity-80">{bucket.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}