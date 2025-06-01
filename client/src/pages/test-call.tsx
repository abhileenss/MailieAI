import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Volume2, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function TestCall() {
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('rachel');
  const [callResult, setCallResult] = useState<any>(null);
  const { toast } = useToast();

  const testEmailData = {
    category: "call-me",
    senders: [
      {
        name: "100x Engineers",
        email: "buildathon@100xengineers.com",
        emailCount: 13,
        latestSubject: "100x Engineers Weekly Newsletter",
        domain: "100xengineers.com"
      },
      {
        name: "McKinsey & Company", 
        email: "insights@mckinsey.com",
        emailCount: 14,
        latestSubject: "Weekly Industry Insights",
        domain: "mckinsey.com"
      }
    ]
  };

  const voiceOptions = [
    { id: 'rachel', name: 'Rachel (Professional Female)', description: 'Clear, professional tone' },
    { id: 'adam', name: 'Adam (Professional Male)', description: 'Authoritative, business-like' },
    { id: 'domi', name: 'Domi (Energetic Female)', description: 'Upbeat and enthusiastic' },
    { id: 'josh', name: 'Josh (Casual Male)', description: 'Friendly and approachable' }
  ];

  const makeTestCall = async () => {
    setIsCallInProgress(true);
    
    try {
      const response = await fetch('/api/calls/make-instant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: "+918112273271",
          voiceId: selectedVoice,
          callType: "reminder",
          emailData: testEmailData
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setCallResult(result);
        toast({
          title: "Call Initiated Successfully!",
          description: `Call ID: ${result.callSid}`
        });
      } else {
        toast({
          title: "Call Failed",
          description: result.message || "Failed to initiate call",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make test call",
        variant: "destructive"
      });
    } finally {
      setIsCallInProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Test Reminder Call</h1>
          <p className="text-muted-foreground">
            Test the outbound calling system with your real email data
          </p>
        </motion.div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Data for Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testEmailData.senders.map((sender, index) => (
                <div key={index} className="p-3 bg-muted rounded border">
                  <div className="font-medium">{sender.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {sender.emailCount} emails • Latest: "{sender.latestSubject}"
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Voice Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-xs text-muted-foreground">{voice.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Call Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded">
              <div className="text-sm text-muted-foreground">Phone Number:</div>
              <div className="font-medium">+91 8112273271</div>
            </div>
            
            <Button 
              onClick={makeTestCall}
              disabled={isCallInProgress}
              className="w-full"
              size="lg"
            >
              {isCallInProgress ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Initiating Call...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Make Test Reminder Call
                </>
              )}
            </Button>

            {callResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800 mb-2">Call Initiated Successfully!</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>Call ID: {callResult.callSid}</div>
                  <div>Status: {callResult.status}</div>
                  <div>Voice: {selectedVoice}</div>
                  <div>Message: {callResult.message}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          This will make an actual call to your phone using Twilio and ElevenLabs
          with a personalized script based on your real email data.
        </div>
      </div>
    </div>
  );
}