import { motion } from "framer-motion";
import { EmailSummary } from "@/data/mock-data";

interface SummaryCardProps {
  summary: EmailSummary;
  isSelected: boolean;
  onSelect: () => void;
}

export function SummaryCard({ summary, isSelected, onSelect }: SummaryCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/20 text-blue-400',
      red: 'bg-red-500/20 text-red-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      green: 'bg-green-500/20 text-green-400'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <motion.div
      className={`bg-gray-900 border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-700 hover:border-blue-500'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${getColorClasses(summary.color)} rounded-lg flex items-center justify-center`}>
          <i className={`${summary.icon}`}></i>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{summary.count}</div>
          <div className="text-xs text-gray-400">
            {summary.type === 'newsletters' ? 'subscriptions' :
             summary.type === 'meetings' ? 'missed' :
             summary.type === 'spam' ? 'sources' :
             'upcoming'}
          </div>
        </div>
      </div>
      <h3 className="font-semibold mb-2">{summary.title}</h3>
      <p className="text-sm text-gray-400 mb-3">{summary.description}</p>
      <div className="text-xs text-gray-500">
        {summary.examples.map((example, index) => (
          <span key={index} className="bg-gray-700 px-2 py-1 rounded mr-2">
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
