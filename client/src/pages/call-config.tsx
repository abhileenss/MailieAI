import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Phone, Mic, Settings, Clock, Download, Play, Pause, Volume2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { SEOHead } from "@/components/seo-head";
import { useQuery, useMutation } from "@tanstack/react-query";

interface CallScript {
  intro: string;
  emailSummary: string;
  actionItems: string[];
  outro: string;
  estimatedDuration: string;
}

export default function CallConfig() {
  const [, setLocation] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['call-me', 'remind-me']);
  const [callTime, setCallTime] = useState('morning');
  const [voiceStyle, setVoiceStyle] = useState('professional');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationMethod, setNotificationMethod] = useState('call');
  const [generatedScript, setGeneratedScript] = useState<CallScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch processed emails
  const { data: emailData, isLoading } = useQuery({
    queryKey: ['/api/emails/processed']
  });

  // Generate call script mutation
  const generateScriptMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/calls/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderIds: Object.values(config.emails).flat().map((sender: any) => sender.id),
          callType: 'daily-digest',
          preferences: config.preferences
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate script');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedScript(data.script);
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    }
  });

  const generateCallScript = () => {
    if (!emailData?.success) return;
    
    setIsGenerating(true);
    
    const selectedEmails = Object.entries(emailData.categorizedSenders)
      .filter(([category]) => selectedCategories.includes(category))
      .reduce((acc, [category, senders]) => {
        acc[category] = senders;
        return acc;
      }, {} as any);

    generateScriptMutation.mutate({
      emails: selectedEmails,
      preferences: {
        callTime,
        voiceStyle,
        phoneNumber
      }
    });
  };

  const scheduleCall = async () => {
    if (!generatedScript || !phoneNumber) return;
    
    try {
      const response = await fetch('/api/voice/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          script: generatedScript,
          scheduledTime: callTime,
          categories: selectedCategories
        })
      });
      
      if (response.ok) {
        alert('Call scheduled successfully!');
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Failed to schedule call:', error);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your email data...</p>
        </div>
      </div>
    );
  }

  if (!emailData?.success || emailData.totalSenders === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation currentPage="/call-config" />
        <div className="max-w-4xl mx-auto p-6 pt-20 text-center">
          <h1 className="text-3xl font-bold mb-4">No Emails Found</h1>
          <p className="text-muted-foreground mb-6">
            Please scan your emails first to generate call scripts.
          </p>
          <Button onClick={() => setLocation('/scanning')}>
            Scan Emails
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Voice Call Configuration - PookAi | Personalized AI Call Scripts"
        description="Configure your AI voice calls with personalized scripts based on your email analysis. Schedule calls and customize voice preferences."
        canonical="https://pookai.com/call-config"
        keywords="voice calls, AI call scripts, email voice assistant, call scheduling, personalized voice assistant"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <Navigation currentPage="/call-config" />
        
        <div className="max-w-6xl mx-auto p-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              Voice Call Configuration
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Generate personalized call scripts from your {emailData.totalSenders} processed email senders.
              Choose what matters most and we'll call you with a summary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Call Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Email Categories to Include
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(emailData.categoryStats).map(([category, count]) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm capitalize">
                            {category.replace('-', ' ')} ({count})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notification Method */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      How would you like to be notified?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        variant={notificationMethod === 'call' ? 'default' : 'outline'}
                        onClick={() => setNotificationMethod('call')}
                        className="flex items-center justify-center py-3"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Voice Call
                      </Button>
                      <Button 
                        variant={notificationMethod === 'sms' ? 'default' : 'outline'}
                        onClick={() => setNotificationMethod('sms')}
                        className="flex items-center justify-center py-3"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                      <Button 
                        variant={notificationMethod === 'whatsapp' ? 'default' : 'outline'}
                        onClick={() => setNotificationMethod('whatsapp')}
                        className="flex items-center justify-center py-3"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                        </svg>
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Call Time */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preferred {notificationMethod === 'call' ? 'Call' : 'Message'} Time
                    </label>
                    <Select value={callTime} onValueChange={setCallTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Style */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Voice Style
                    </label>
                    <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>

                  <Button
                    onClick={generateCallScript}
                    disabled={isGenerating || selectedCategories.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Script...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Generate Call Script
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generated Script Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Generated Call Script
                    </span>
                    {generatedScript && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={togglePlayback}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!generatedScript ? (
                    <div className="text-center py-12">
                      <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Configure your preferences and generate a personalized call script
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Estimated Duration: {generatedScript.estimatedDuration}</span>
                        <span className="flex items-center">
                          <Volume2 className="w-4 h-4 mr-1" />
                          {voiceStyle} voice
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Introduction</h4>
                          <p className="text-sm bg-muted p-3 rounded">
                            {generatedScript.intro}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Email Summary</h4>
                          <p className="text-sm bg-muted p-3 rounded">
                            {generatedScript.emailSummary}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Action Items</h4>
                          <ul className="text-sm bg-muted p-3 rounded space-y-1">
                            {generatedScript.actionItems.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Closing</h4>
                          <p className="text-sm bg-muted p-3 rounded">
                            {generatedScript.outro}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={scheduleCall}
                        disabled={!phoneNumber}
                        className="w-full"
                        size="lg"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}