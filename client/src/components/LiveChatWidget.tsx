import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export default function LiveChatWidget() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hi! How can we help you today? Please fill in your details below and we\'ll get back to you quickly.',
      timestamp: new Date()
    }
  ]);
  
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    subject: '',
    message: '',
    supportType: 'general' as 'general' | 'technical' | 'founder-feedback'
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/support/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Add confirmation message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: 'Thank you! Your message has been sent to our support team. We\'ll respond to your email within 24 hours.',
        timestamp: new Date()
      }]);
      
      // Reset form
      setFormData({
        userEmail: '',
        userName: '',
        subject: '',
        message: '',
        supportType: 'general'
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at info.glitchowt@gmail.com",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!formData.message.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: formData.message,
      timestamp: new Date()
    }]);
    
    // Ensure subject is set if empty
    const dataToSend = {
      ...formData,
      subject: formData.subject || formData.message.slice(0, 50) + (formData.message.length > 50 ? '...' : '')
    };
    
    // Send email
    sendEmailMutation.mutate(dataToSend);
  };

  const handleQuickMessage = (message: string, type: 'general' | 'technical' | 'founder-feedback') => {
    setFormData(prev => ({
      ...prev,
      message,
      supportType: type,
      subject: message.slice(0, 50) + (message.length > 50 ? '...' : '')
    }));
  };

  return (
    <>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 500 
            }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Mailie Support</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="h-96 flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-gray-700">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-600 hover:bg-gray-800"
                      onClick={() => handleQuickMessage("I need help with Gmail connection", 'technical')}
                    >
                      Gmail Issue
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-600 hover:bg-gray-800"
                      onClick={() => handleQuickMessage("I have a feature request", 'founder-feedback')}
                    >
                      Feature Request
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-gray-600 hover:bg-gray-800"
                      onClick={() => handleQuickMessage("General question about the service", 'general')}
                    >
                      General Help
                    </Button>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="p-4 border-t border-gray-700 bg-gray-800 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Your name"
                      value={formData.userName}
                      onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-sm"
                    />
                    <Input
                      placeholder="Your email"
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-sm"
                    />
                  </div>
                  
                  <Select 
                    value={formData.supportType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, supportType: value as any }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="founder-feedback">Founder Feedback</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-sm resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!formData.message.trim() || sendEmailMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600 px-3"
                    >
                      {sendEmailMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    Messages are sent to info.glitchowt@gmail.com
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}