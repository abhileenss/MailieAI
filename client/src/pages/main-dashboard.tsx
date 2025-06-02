import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Phone, 
  Settings, 
  Mail, 
  Play,
  Edit3,
  User,
  LogOut,
  ArrowLeft,
  TestTube
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

interface ProcessedEmailsResponse {
  success: boolean;
  totalSenders: number;
  categorizedSenders: Record<string, EmailSender[]>;
  categoryStats: Record<string, number>;
}

const categories = {
  'call-me': { title: 'Call Me For This', color: 'bg-red-500 text-white' },
  'remind-me': { title: 'Remind Me For This', color: 'bg-orange-500 text-white' },
  'newsletter': { title: 'Newsletter', color: 'bg-blue-500 text-white' },
  'why-did-i-signup': { title: 'Why Did I Sign Up?', color: 'bg-gray-500 text-white' },
  'keep-quiet': { title: 'Keep But Don\'t Care', color: 'bg-green-500 text-white' },
  'dont-tell-anyone': { title: "Don't Tell Anyone", color: 'bg-purple-500 text-white' }
};

export default function MainDashboard() {
  const [, setLocation] = useLocation();
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [callScript, setCallScript] = useState("Hey! PookAi here - your new AI email sidekick. Quick test call to make sure everything's connected. Ready to tackle your inbox together? Sweet! Setup complete.");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth() || {};

  // Fetch processed emails
  const { data: processedEmails, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Test call mutation
  const testCallMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/calls/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: callScript }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate test call');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test call initiated!",
        description: "You should receive a call shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Test call failed",
        description: "Please check your phone number or try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleBackToCategorization = () => {
    setLocation('/guided-app');
  };

  const handleTestCall = () => {
    testCallMutation.mutate();
  };

  const saveScript = () => {
    setIsEditingScript(false);
    toast({
      title: "Script saved!",
      description: "Your call script has been updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-16 h-16 animate-pulse text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  const totalSenders = processedEmails?.totalSenders || 0;
  const callMeCount = processedEmails?.categoryStats?.['call-me'] || 0;
  const remindMeCount = processedEmails?.categoryStats?.['remind-me'] || 0;
  const newsletterCount = processedEmails?.categoryStats?.['newsletter'] || 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">PookAi Dashboard</h1>
              <p className="text-gray-400">Your AI email assistant is active</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToCategorization}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit Categories
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Email Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 text-center">
                    <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{totalSenders}</p>
                    <p className="text-xs text-gray-400">Total Senders</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 text-center">
                    <Phone className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{callMeCount}</p>
                    <p className="text-xs text-gray-400">Call Me</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 text-center">
                    <Settings className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{remindMeCount}</p>
                    <p className="text-xs text-gray-400">Remind Me</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 text-center">
                    <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{newsletterCount}</p>
                    <p className="text-xs text-gray-400">Newsletters</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
              <div className="space-y-3">
                {Object.entries(processedEmails?.categoryStats || {}).map(([category, count]) => {
                  const categoryInfo = categories[category as keyof typeof categories];
                  if (!categoryInfo || count === 0) return null;
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                      <span className="text-white font-medium">{categoryInfo.title}</span>
                      <Badge className={categoryInfo.color}>{count} senders</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Call Script & Testing */}
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Call Script</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingScript(!isEditingScript)}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingScript ? (
                  <div className="space-y-3">
                    <Textarea
                      value={callScript}
                      onChange={(e) => setCallScript(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                      placeholder="Enter what PookAi should say during calls..."
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={saveScript}
                        className="bg-orange-400 hover:bg-orange-500 text-black"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingScript(false)}
                        className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm leading-relaxed bg-zinc-800 p-3 rounded-lg">
                      {callScript}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Call */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Test Your Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Test your voice setup and hear how PookAi will sound during actual calls.
                </p>
                <Button
                  onClick={handleTestCall}
                  disabled={testCallMutation.isPending}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold"
                >
                  {testCallMutation.isPending ? (
                    "Initiating call..."
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Call Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  {user?.email || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Voice assistant active
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              PookAi © 2025 - Your AI Email Assistant
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-green-400">● Active</span>
              <span className="text-xs text-gray-500">Last sync: Just now</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}