import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { VoiceOption } from "@/data/mock-data";

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
}

export function VoiceSelector({ voices, selectedVoice, onSelect }: VoiceSelectorProps) {
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'female':
        return 'fas fa-female';
      case 'male':
        return 'fas fa-male';
      default:
        return 'fas fa-genderless';
    }
  };

  return (
    <div className="space-y-4">
      {voices.map((voice) => (
        <motion.div
          key={voice.id}
          className={`bg-gray-800 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
            selectedVoice === voice.id 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-600 hover:border-blue-500'
          }`}
          onClick={() => onSelect(voice.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${voice.color} rounded-full flex items-center justify-center`}>
                <User className="text-white w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">{voice.name}</h4>
                <p className="text-sm text-gray-400">{voice.description}</p>
              </div>
            </div>
            <button className="text-blue-500 hover:text-blue-400 transition-colors">
              <Play className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
