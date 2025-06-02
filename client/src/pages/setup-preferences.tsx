import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { 
  Phone, 
  Mail, 
  Calendar, 
  Newspaper, 
  Tag, 
  Settings, 
  Clock, 
  Bell,
  Save,
  ArrowRight
} from "lucide-react";

interface UserPreferences {
  newsletters: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  promotional: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  events: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  tools: { action: 'call' | 'digest' | 'ignore'; callTiming?: number };
  morningCall: { enabled: boolean; time: string; timezone: string };
  eventReminders: { enabled: boolean; defaultTiming: number; workshopTiming: number; meetingTiming: number };
  voiceId: string;
  callSpeed: number;
}

interface SetupPreferencesProps {
  onComplete?: () => void;
}

export default function SetupPreferences({ onComplete }: SetupPreferencesProps = {}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [preferences, setPreferences] = useState<UserPreferences>({
    newsletters: { action: 'digest' },
    promotional: { action: 'ignore' },
    events: { action: 'call', callTiming: 15 },
    tools: { action: 'digest' },
    spam: { action: 'ignore' },
    morningCall: {
      enabled: true,
      time: '08:00',
      timezone: 'America/Los_Angeles'
    },
    eventReminders: {
      enabled: true,
      defaultTiming: 15,
      workshopTiming: 30,
      meetingTiming: 10
    },
    voiceId: 'rachel',
    callSpeed: 1.0
  });

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences saved!",
        description: "Proceeding to phone verification.",
      });
      // If this is being used in guided flow, don't redirect
      if (window.location.pathname === '/setup') {
        setLocation('/dashboard');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    savePreferencesMutation.mutate(preferences);
    if (onComplete) {
      onComplete();
    }
  };

  const updatePreference = (category: keyof UserPreferences, field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: value
      }
    }));
  };

  const ActionSelector = ({ 
    category, 
    value, 
    onChange 
  }: { 
    category: string;
    value: 'call' | 'digest' | 'ignore';
    onChange: (value: 'call' | 'digest' | 'ignore') => void;
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="call">📞 Call me immediately</SelectItem>
        <SelectItem value="digest">📧 Include in daily digest</SelectItem>
        <SelectItem value="ignore">🤫 Keep quiet</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Perfect Your mailieAI Experience
          </h1>
          <p className="text-gray-400">
            Set up your email preferences and call timing to get exactly what you need, when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Type Preferences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Mail className="w-5 h-5" />
                <span>Email Type Handling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Newsletter Sources */}
              <div>
                <Label className="text-white font-medium flex items-center space-x-2 mb-3">
                  <Newspaper className="w-4 h-4" />
                  <span>Newsletter Sources</span>
                </Label>
                <ActionSelector
                  category="newsletters"
                  value={preferences.newsletters.action}
                  onChange={(value) => updatePreference('newsletters', 'action', value)}
                />
                {preferences.newsletters.action === 'call' && (
                  <div className="mt-3">
                    <Label className="text-gray-400 text-sm">Call timing (minutes after receipt)</Label>
                    <Slider
                      value={[preferences.newsletters.callTiming || 5]}
                      onValueChange={([value]) => updatePreference('newsletters', 'callTiming', value)}
                      max={60}
                      min={1}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {preferences.newsletters.callTiming || 5} minutes
                    </div>
                  </div>
                )}
              </div>

              {/* Promotional Emails */}
              <div>
                <Label className="text-white font-medium flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4" />
                  <span>Promotional Emails</span>
                </Label>
                <ActionSelector
                  category="promotional"
                  value={preferences.promotional.action}
                  onChange={(value) => updatePreference('promotional', 'action', value)}
                />
              </div>

              {/* Events & Calendar */}
              <div>
                <Label className="text-white font-medium flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Events & Calendar Invites</span>
                </Label>
                <ActionSelector
                  category="events"
                  value={preferences.events.action}
                  onChange={(value) => updatePreference('events', 'action', value)}
                />
                {preferences.events.action === 'call' && (
                  <div className="mt-3">
                    <Label className="text-gray-400 text-sm">Call timing (minutes before event)</Label>
                    <Slider
                      value={[preferences.events.callTiming || 15]}
                      onValueChange={([value]) => updatePreference('events', 'callTiming', value)}
                      max={120}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {preferences.events.callTiming || 15} minutes before
                    </div>
                  </div>
                )}
              </div>

              {/* Tools/Platforms */}
              <div>
                <Label className="text-white font-medium flex items-center space-x-2 mb-3">
                  <Settings className="w-4 h-4" />
                  <span>Tools/Platforms (Notion, LinkedIn, etc.)</span>
                </Label>
                <ActionSelector
                  category="tools"
                  value={preferences.tools.action}
                  onChange={(value) => updatePreference('tools', 'action', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Call Timing & Preferences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Phone className="w-5 h-5" />
                <span>Call Timing & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Morning Call */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white font-medium flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Morning Digest Call</span>
                  </Label>
                  <Switch
                    checked={preferences.morningCall.enabled}
                    onCheckedChange={(checked) => updatePreference('morningCall', 'enabled', checked)}
                  />
                </div>
                
                {preferences.morningCall.enabled && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-sm">Call time</Label>
                      <Select
                        value={preferences.morningCall.time}
                        onValueChange={(value) => updatePreference('morningCall', 'time', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="07:30">7:30 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="08:30">8:30 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="09:30">9:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Reminders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white font-medium flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Event Reminders</span>
                  </Label>
                  <Switch
                    checked={preferences.eventReminders.enabled}
                    onCheckedChange={(checked) => updatePreference('eventReminders', 'enabled', checked)}
                  />
                </div>

                {preferences.eventReminders.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Meeting reminders</Label>
                      <Slider
                        value={[preferences.eventReminders.meetingTiming]}
                        onValueChange={([value]) => updatePreference('eventReminders', 'meetingTiming', value)}
                        max={60}
                        min={5}
                        step={5}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {preferences.eventReminders.meetingTiming} minutes before
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">Workshop/event reminders</Label>
                      <Slider
                        value={[preferences.eventReminders.workshopTiming]}
                        onValueChange={([value]) => updatePreference('eventReminders', 'workshopTiming', value)}
                        max={120}
                        min={15}
                        step={15}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {preferences.eventReminders.workshopTiming} minutes before
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Settings */}
              <div>
                <Label className="text-white font-medium mb-3 block">Voice Settings</Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-sm">Voice</Label>
                    <Select
                      value={preferences.voiceId}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, voiceId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rachel">Rachel (Female, Professional)</SelectItem>
                        <SelectItem value="adam">Adam (Male, Warm)</SelectItem>
                        <SelectItem value="domi">Domi (Female, Energetic)</SelectItem>
                        <SelectItem value="elli">Elli (Female, Calm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm">Speech speed</Label>
                    <Slider
                      value={[preferences.callSpeed]}
                      onValueChange={([value]) => setPreferences(prev => ({ ...prev, callSpeed: value }))}
                      max={1.3}
                      min={0.7}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {preferences.callSpeed}x speed
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}