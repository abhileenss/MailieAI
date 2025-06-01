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

                  {/* Call Time */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preferred Call Time
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