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
        return 'bg-primary/20 text-primary';
      case 'remind-me':
        return 'bg-muted/40 text-muted-foreground';
      case 'keep-quiet':
        return 'bg-border/40 text-muted-foreground';
      case 'why-did-i-signup':
        return 'bg-primary/10 text-primary';
      case 'dont-tell-anyone':
        return 'bg-border/40 text-muted-foreground';
      default:
        return 'bg-border/40 text-muted-foreground';
    }
  };

  return (
    <motion.div
      className={`neopop-card p-4 cursor-pointer transition-all duration-300 font-primary ${
        isSelected 
          ? 'border-primary bg-primary/10' 
          : 'hover:shadow-neopop-hover'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary text-background neopop-button flex items-center justify-center">
            <i className={`${getTypeIcon(sender.type)} text-sm`}></i>
          </div>
          <div>
            <h4 className="font-medium text-foreground">{sender.name}</h4>
            <p className="text-xs text-muted-foreground">{sender.domain}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{sender.count}</div>
          <div className="text-xs text-muted-foreground">emails</div>
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
      
      <div className="text-sm text-foreground">
        <p className="font-medium truncate">{sender.latestSubject}</p>
        <p className="text-xs text-muted-foreground mt-1">{sender.latestDate}</p>
      </div>
    </motion.div>
  );
}