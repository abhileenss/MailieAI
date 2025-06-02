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
  TestTube,
  Clock,
  CreditCard,
  Calendar,
  Newspaper,
  Tag,
  Archive,
  HelpCircle
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
  'call-me': { 
    title: 'Call Me For This', 
    color: 'bg-red-500 text-white',
    bgColor: 'bg-red-500/20 border-red-500',
    description: 'Urgent emails that need immediate attention'
  },
  'remind-me': { 
    title: 'Remind Me For This', 
    color: 'bg-orange-500 text-white',
    bgColor: 'bg-orange-500/20 border-orange-500',
    description: 'Important emails to follow up on'
  },
  'keep-quiet': { 
    title: 'Keep But Don\'t Care', 
    color: 'bg-green-500 text-white',
    bgColor: 'bg-green-500/20 border-green-500',
    description: 'Archive but don\'t notify'
  },
  'why-did-i-signup': { 
    title: 'Why Did I Sign Up?', 
    color: 'bg-gray-500 text-white',
    bgColor: 'bg-gray-500/20 border-gray-500',
    description: 'Unwanted subscriptions to review'
  },
  'dont-tell-anyone': { 
    title: "Don't Tell Anyone", 
    color: 'bg-purple-500 text-white',
    bgColor: 'bg-purple-500/20 border-purple-500',
    description: 'Personal emails in work inbox'
  }
};

export default function MainDashboard() {
  const [, setLocation] = useLocation();
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [callScript, setCallScript] = useState("Hey! mailieAI here. Quick update: McKinsey: Project timeline discussion. 100xEngineers: Buildathon invitation. These look important. Thanks for using mailieAI!");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth() || {};

  // Fetch processed emails
  const { data: processedEmails, isLoading, refetch: refetchEmails } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
  });

  // Email refresh mutation
  const refreshEmailsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/emails/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh emails');
      }
      
      return data;
    },
    onSuccess: () => {
      refetchEmails();
      toast({
        title: "Emails refreshed!",
        description: "Your email data has been updated with the latest information.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh failed",
        description: error.message || "Failed to refresh email data.",
        variant: "destructive",
      });
    }
  });

  // Test call mutation
  const testCallMutation = useMutation({
    mutationFn: async () => {
      console.log('=== FRONTEND: Starting test call mutation ===');
      console.log('callScript:', callScript);
      
      const response = await fetch('/api/calls/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: callScript }),
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Test call response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate test call');
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Test call success:', data);
      toast({
        title: "Call initiated successfully!",
        description: `Calling ${user?.phone || 'your verified number'}. You should receive a call within 30 seconds.`,
      });
    },
    onError: (error: any) => {
      console.error('Test call error:', error);
      toast({
        title: "Call failed",
        description: error.message || "Please check your phone number is verified and try again.",
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

  const handleTestCall = async () => {
    console.log('Test call button clicked');
    console.log('testCallMutation:', testCallMutation);
    console.log('testCallMutation.mutate:', testCallMutation.mutate);
    try {
      testCallMutation.mutate();
    } catch (error) {
      console.error('Error calling testCallMutation.mutate:', error);
    }
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

  // Helper function to get category icon
  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case 'call-me': return Phone;
      case 'remind-me': return Clock;
      case 'keep-quiet': return Archive;
      case 'why-did-i-signup': return HelpCircle;
      case 'dont-tell-anyone': return User;
      default: return Mail;
    }
  };

  const totalSenders = processedEmails?.totalSenders || 0;
  const callMeCount = processedEmails?.categoryStats?.['call-me'] || 0;
  const remindMeCount = processedEmails?.categoryStats?.['remind-me'] || 0;
  const keepQuietCount = processedEmails?.categoryStats?.['keep-quiet'] || 0;
  const whySignupCount = processedEmails?.categoryStats?.['why-did-i-signup'] || 0;
  const dontTellCount = processedEmails?.categoryStats?.['dont-tell-anyone'] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-300 rounded-full blur-xl"></div>
      </div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 backdrop-blur-md border-b border-zinc-700/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">mailieAI Dashboard</h1>
              <p className="text-orange-300/80 font-medium">Your AI email assistant is active</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => refreshEmailsMutation.mutate()}
                disabled={refreshEmailsMutation.isPending}
                className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4 mr-2" />
                {refreshEmailsMutation.isPending ? "Refreshing..." : "Refresh Emails"}
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToCategorization}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit Categories
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 transition-all duration-200 hover:scale-105 active:scale-95"
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
                    <Archive className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{keepQuietCount}</p>
                    <p className="text-xs text-gray-400">Keep Quiet</p>
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
                    onClick={() => {
                      console.log('Edit button clicked, current state:', isEditingScript);
                      setIsEditingScript(!isEditingScript);
                    }}
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
                      placeholder="Enter what mailieAI should say during calls..."
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
                  Test your voice setup and hear how mailieAI will sound during actual calls.
                </p>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('=== BUTTON CLICKED ===');
                    handleTestCall();
                  }}
                  disabled={testCallMutation.isPending}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-400/25"
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
              mailieAI © 2025 - Your AI Email Assistant
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