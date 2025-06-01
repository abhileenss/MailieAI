import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Play, 
  Pause, 
  Clock, 
  User,
  AlertTriangle,
  CheckCircle,
  Settings,
  Volume2,
  PhoneCall
} from "lucide-react";

interface EmailSender {
  id: string;
  name: string;
  email: string;
  domain: string;
  emailCount: number;
  latestSubject: string;
  lastEmailDate: string;
  category: string;
}

interface CallScript {
  sender: EmailSender;
  script: string;
  estimatedDuration: string;
  urgencyLevel: 'high' | 'medium' | 'low';
  callType: 'immediate' | 'scheduled' | 'daily-digest';
}

export default function CallActionCenter() {
  const [selectedScript, setSelectedScript] = useState<CallScript | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch "Call Me" category senders
  const { data: processedEmails } = useQuery({
    queryKey: ['/api/emails/processed'],
  });

  // Get call-me senders from processed emails
  const callMeSenders = useMemo(() => {
    if (!processedEmails?.categorizedSenders) return [];
    return processedEmails.categorizedSenders['call-me'] || [];
  }, [processedEmails]);

  // Generate call scripts for each sender
  const callScripts: CallScript[] = useMemo(() => {
    return callMeSenders.map(sender => ({
      sender,
      script: generateCallScript(sender),
      estimatedDuration: estimateCallDuration(sender),
      urgencyLevel: determineUrgency(sender),
      callType: 'immediate'
    }));
  }, [callMeSenders]);

  // Trigger voice call mutation
  const triggerCallMutation = useMutation({
    mutationFn: async (script: CallScript) => {
      const response = await fetch('/api/voice/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: script.sender.id,
          phoneNumber: '+1234567890', // This should come from user preferences
          script: script.script,
          callType: script.callType
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger call');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Call Initiated",
        description: "Your voice call has been scheduled and will begin shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/calls/logs'] });
    },
    onError: (error) => {
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please check your phone number settings.",
        variant: "destructive",
      });
    }
  });

  function generateCallScript(sender: EmailSender): string {
    const companyName = sender.domain.split('.')[0];
    return `Hello! This is your PookAi assistant with an urgent update about ${companyName}. 
    
You have ${sender.emailCount} emails from ${sender.name}, with the latest being: "${sender.latestSubject}".
    
This was marked as requiring immediate attention. The last email was received ${getTimeAgo(sender.lastEmailDate)}.

Would you like me to read the email content, or should I send you the summary via WhatsApp?`;
  }

  function estimateCallDuration(sender: EmailSender): string {
    const baseTime = 30; // 30 seconds base
    const emailCountTime = Math.min(sender.emailCount * 5, 60); // 5 seconds per email, max 60
    const total = baseTime + emailCountTime;
    return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
  }

  function determineUrgency(sender: EmailSender): 'high' | 'medium' | 'low' {
    const recentHours = (Date.now() - new Date(sender.lastEmailDate).getTime()) / (1000 * 60 * 60);
    if (recentHours < 2) return 'high';
    if (recentHours < 24) return 'medium';
    return 'low';
  }

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  if (callScripts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardHeader>
            <PhoneCall className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No Urgent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have any emails marked as "Call Me For This" right now.
            </p>
            <Button onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Phone className="w-6 h-6 mr-3 text-primary" />
              Call Action Center
            </h1>
            <p className="text-muted-foreground">
              {callScripts.length} urgent email{callScripts.length !== 1 ? 's' : ''} requiring immediate attention
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Voice Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Call Scripts List */}
        <div className="w-1/2 border-r border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium">Pending Calls</h2>
          </div>
          
          <div className="space-y-3 p-4">
            {callScripts.map((script, index) => (
              <Card 
                key={script.sender.id}
                className={`cursor-pointer transition-all ${
                  selectedScript?.sender.id === script.sender.id 
                    ? 'ring-2 ring-primary' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedScript(script)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{script.sender.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={getUrgencyColor(script.urgencyLevel)}
                        >
                          {script.urgencyLevel} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {script.sender.emailCount} emails • {script.sender.domain}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Latest: {script.sender.latestSubject}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{script.estimatedDuration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(script.sender.lastEmailDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Call Script Preview & Actions */}
        <div className="w-1/2 flex flex-col">
          {selectedScript ? (
            <>
              {/* Script Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedScript.sender.name}</h2>
                    <p className="text-muted-foreground">{selectedScript.sender.email}</p>
                  </div>
                  <Badge className={getUrgencyColor(selectedScript.urgencyLevel)}>
                    {selectedScript.urgencyLevel} priority
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedScript.estimatedDuration}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedScript.sender.emailCount} emails
                  </span>
                </div>
              </div>

              {/* Script Preview */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Call Script Preview</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Edit Script' : 'Preview Mode'}
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border">
                  {isPreviewMode ? (
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {selectedScript.script}
                    </div>
                  ) : (
                    <textarea
                      value={selectedScript.script}
                      onChange={(e) => {
                        setSelectedScript({
                          ...selectedScript,
                          script: e.target.value
                        });
                      }}
                      className="w-full h-64 bg-transparent border-0 resize-none focus:outline-none text-sm"
                      placeholder="Edit your call script..."
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>This call will be initiated immediately</p>
                    <p>Estimated duration: {selectedScript.estimatedDuration}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedScript(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => triggerCallMutation.mutate(selectedScript)}
                      disabled={triggerCallMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {triggerCallMutation.isPending ? 'Initiating...' : 'Start Call'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select a call script</h3>
                <p className="text-sm text-muted-foreground">
                  Choose an email from the left to preview and initiate the call
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}