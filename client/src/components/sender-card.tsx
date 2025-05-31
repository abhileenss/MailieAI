import { motion } from "framer-motion";
import { EmailSender } from "@/data/mock-data";

interface SenderCardProps {
  sender: EmailSender;
  isSelected: boolean;
  onSelect: () => void;
}

export function SenderCard({ sender, isSelected, onSelect }: SenderCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return 'fas fa-newspaper';
      case 'tool':
        return 'fas fa-cog';
      case 'meeting':
        return 'fas fa-calendar';
      case 'promotional':
        return 'fas fa-bullhorn';
      case 'personal':
        return 'fas fa-user';
      default:
        return 'fas fa-envelope';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'call-me':
        return 'bg-red-500/20 text-red-400';
      case 'remind-me':
        return 'bg-blue-500/20 text-blue-400';
      case 'keep-quiet':
        return 'bg-gray-500/20 text-gray-400';
      case 'why-did-i-signup':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'dont-tell-anyone':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-600/20 text-gray-500';
    }
  };

  return (
    <motion.div
      className={`bg-gray-800 border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-700 hover:border-blue-500'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <i className={`${getTypeIcon(sender.type)} text-white text-sm`}></i>
          </div>
          <div>
            <h4 className="font-medium text-white">{sender.name}</h4>
            <p className="text-xs text-gray-400">{sender.domain}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{sender.count}</div>
          <div className="text-xs text-gray-400">emails</div>
        </div>
      </div>
      
      {sender.category !== 'unassigned' && (
        <div className={`text-xs px-2 py-1 rounded mb-2 ${getCategoryColor(sender.category)}`}>
          {sender.category === 'call-me' && 'Call Me For This'}
          {sender.category === 'remind-me' && 'Remind Me For This'}
          {sender.category === 'keep-quiet' && 'Keep But Don\'t Care'}
          {sender.category === 'why-did-i-signup' && 'Why Did I Sign Up For This?'}
          {sender.category === 'dont-tell-anyone' && 'Don\'t Tell Anyone'}
        </div>
      )}
      
      <div className="text-sm text-gray-300">
        <p className="font-medium truncate">{sender.latestSubject}</p>
        <p className="text-xs text-gray-500 mt-1">{sender.latestDate}</p>
      </div>
    </motion.div>
  );
}