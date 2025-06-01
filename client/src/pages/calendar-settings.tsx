import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Phone, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  attendees: string[];
  location?: string;
}

interface CallSettings {
  enablePreMeetingCalls: boolean;
  minutesBefore: number;
  onlyWithExternalAttendees: boolean;
  minimumMeetingDuration: number;
  excludeKeywords: string[];
}

export default function CalendarSettings() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<CallSettings>({
    enablePreMeetingCalls: false,
    minutesBefore: 15,
    onlyWithExternalAttendees: true,
    minimumMeetingDuration: 30,
    excludeKeywords: ['standup', 'daily', 'internal']
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingEvents();
    loadUserSettings();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/calendar/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  };

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/calendar/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your calendar call preferences have been updated"
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      const response = await fetch('/api/calendar/auth-url');
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect calendar",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Calendar Integration</h1>
            <p className="text-muted-foreground">
              Set up calls before important meetings
            </p>
          </div>
          <Button onClick={connectCalendar} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Connect Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Pre-Meeting Call Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Pre-Meeting Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically call before meetings
                  </p>
                </div>
                <Switch
                  checked={settings.enablePreMeetingCalls}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, enablePreMeetingCalls: checked})
                  }
                />
              </div>

              {settings.enablePreMeetingCalls && (
                <>
                  <div>
                    <Label>Call me how many minutes before meeting?</Label>
                    <Select
                      value={settings.minutesBefore.toString()}
                      onValueChange={(value) => 
                        setSettings({...settings, minutesBefore: parseInt(value)})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Only External Meetings</Label>
                      <p className="text-sm text-muted-foreground">
                        Skip internal team meetings
                      </p>
                    </div>
                    <Switch
                      checked={settings.onlyWithExternalAttendees}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, onlyWithExternalAttendees: checked})
                      }
                    />
                  </div>

                  <div>
                    <Label>Minimum meeting duration for calls</Label>
                    <Select
                      value={settings.minimumMeetingDuration.toString()}
                      onValueChange={(value) => 
                        setSettings({...settings, minimumMeetingDuration: parseInt(value)})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button 
                onClick={saveSettings} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Connect your calendar to see upcoming meetings
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.start).toLocaleString()}
                        </div>
                        {event.attendees.length > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                      {settings.enablePreMeetingCalls && (
                        <Phone className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call Preview */}
        {settings.enablePreMeetingCalls && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Scan Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    We monitor your upcoming meetings automatically
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Schedule Call</h3>
                  <p className="text-sm text-muted-foreground">
                    Call you {settings.minutesBefore} minutes before meeting starts
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Voice Briefing</h3>
                  <p className="text-sm text-muted-foreground">
                    Get meeting details and relevant email context
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}