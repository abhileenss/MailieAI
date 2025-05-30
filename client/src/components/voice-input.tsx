import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

interface VoiceInputProps {
  onTranscription?: (text: string) => void;
}

export function VoiceInput({ onTranscription }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        // Simulate transcription
        const mockTranscription = "I'm a startup founder, so I need to prioritize investor communications, customer feedback, and urgent team updates. Please filter out promotional emails and most newsletters.";
        onTranscription?.(mockTranscription);
      }, 3000);
    }
  };

  return (
    <div className="text-center mb-6">
      <motion.div
        className={`w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer ${
          isRecording ? 'animate-pulse' : ''
        }`}
        onClick={toggleRecording}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: isRecording ? '0 0 30px rgba(99, 102, 241, 0.6)' : '0 0 20px rgba(99, 102, 241, 0.3)'
        }}
      >
        {isRecording ? (
          <Square className="text-white text-2xl" fill="currentColor" />
        ) : (
          <Mic className="text-white text-2xl" />
        )}
      </motion.div>
      <p className="text-gray-400">Click to speak or type below</p>
    </div>
  );
}
