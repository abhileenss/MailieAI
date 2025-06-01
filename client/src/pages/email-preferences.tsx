import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Settings, 
  Phone, 
  MessageSquare, 
  Bell, 
  BellOff, 
  Edit3, 
  Save, 
  X,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CleanNavigation } from "@/components/clean-navigation";
import { SEOHead } from "@/components/seo-head";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface UserPreference {
  senderId: string;
  category: string;
  enableCalls: boolean;
  enableSMS: boolean;
  priority: 'high' | 'medium' | 'low' | 'none';
  customNotes?: string;
}

const categoryOptions = [
  { value: 'call-me', label: '📞 Call Me', description: 'Urgent emails that need immediate attention' },
  { value: 'remind-me', label: '⏰ Remind Me', description: 'Important emails to follow up on' },
  { value: 'keep-quiet', label: '🔇 Keep Quiet', description: 'Low priority, check when convenient' },
  { value: 'newsletter', label: '📰 Newsletter', description: 'Regular updates and newsletters' },
  { value: 'why-did-i-signup', label: '🤷 Why Did I Sign Up?', description: 'Questionable subscriptions' },
  { value: 'dont-tell-anyone', label: '🤫 Don\'t Tell Anyone', description: 'Personal or sensitive emails' }
];

export default function EmailPreferences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [editingPreferences, setEditingPreferences] = useState<Record<string, UserPreference>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Fetch email senders
  const { data: emailData, isLoading } = useQuery({
    queryKey: ['/api/emails/processed']
  });

  // Fetch user preferences
  const { data: preferences = [] } = useQuery<UserPreference[]>({
    queryKey: ['/api/user/preferences']
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (prefs: UserPreference[]) => 
      apiRequest('/api/user/preferences', { method: 'POST', body: prefs }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/preferences'] });
      toast({
        title: "Preferences Updated",
        description: "Your email preferences have been saved successfully."
      });
      setEditingPreferences({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  const allSenders = emailData?.categorizedSenders 
    ? Object.values(emailData.categorizedSenders).flat()
    : [];

  // Filter senders based on search and category
  const filteredSenders = allSenders.filter(sender => {
    const matchesSearch = sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sender.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || sender.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getPreferenceForSender = (senderId: string): UserPreference => {
    const existing = preferences.find(p => p.senderId === senderId);
    const editing = editingPreferences[senderId];
    
    if (editing) return editing;
    
    return existing || {
      senderId,
      category: allSenders.find(s => s.id === senderId)?.category || 'keep-quiet',
      enableCalls: false,
      enableSMS: false,
      priority: 'low',
      customNotes: ''
    };
  };

  const updateEditingPreference = (senderId: string, updates: Partial<UserPreference>) => {
    const current = getPreferenceForSender(senderId);
    setEditingPreferences(prev => ({
      ...prev,
      [senderId]: { ...current, ...updates }
    }));
  };

  const savePreferences = () => {
    const prefsToSave = Object.values(editingPreferences);
    updatePreferencesMutation.mutate(prefsToSave);
  };

  const cancelEditing = () => {
    setEditingPreferences({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your email preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Email Preferences - PookAi | Customize Your AI Email Assistant"
        description="Take full control of your AI email assistant. Choose which emails get calls, SMS alerts, and custom categorization. Your email, your rules."
        canonical="https://pookai.com/preferences"
        keywords="email preferences, AI customization, email controls, notification settings, email management"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <CleanNavigation currentPage="/preferences" />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Email Preferences</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl">
              You have complete control. Choose exactly which emails get calls, SMS alerts, and how they're categorized. 
              All suggestions are just that - suggestions. You decide everything.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Email Controls
                  {Object.keys(editingPreferences).length > 0 && (
                    <div className="flex gap-2">
                      <Button onClick={savePreferences} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Search Senders</Label>
                    <input
                      type="text"
                      placeholder="Search by name, email, or domain..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <Label>Filter by Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      {filteredSenders.length} of {allSenders.length} senders
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Senders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {filteredSenders.map((sender) => {
              const preference = getPreferenceForSender(sender.id);
              const isEditing = editingPreferences[sender.id];
              
              return (
                <Card key={sender.id} className={isEditing ? 'border-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Sender Info */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-lg">{sender.name}</h3>
                        <p className="text-sm text-muted-foreground">{sender.email}</p>
                        <p className="text-xs text-muted-foreground">{sender.domain}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{sender.emailCount} emails</Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(sender.lastEmailDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <Select 
                          value={preference.category} 
                          onValueChange={(value) => updateEditingPreference(sender.id, { category: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div>{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Communication Preferences */}
                      <div>
                        <Label className="text-sm font-medium">Notifications</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">Voice Calls</span>
                            </div>
                            <Switch
                              checked={preference.enableCalls}
                              onCheckedChange={(checked) => 
                                updateEditingPreference(sender.id, { enableCalls: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm">SMS Alerts</span>
                            </div>
                            <Switch
                              checked={preference.enableSMS}
                              onCheckedChange={(checked) => 
                                updateEditingPreference(sender.id, { enableSMS: checked })
                              }
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Priority</Label>
                            <Select 
                              value={preference.priority} 
                              onValueChange={(value: any) => updateEditingPreference(sender.id, { priority: value })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">🔴 High</SelectItem>
                                <SelectItem value="medium">🟡 Medium</SelectItem>
                                <SelectItem value="low">🟢 Low</SelectItem>
                                <SelectItem value="none">⚫ None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Custom Notes */}
                      <div>
                        <Label className="text-sm font-medium">Custom Notes</Label>
                        <Textarea
                          placeholder="Add personal notes about this sender..."
                          value={preference.customNotes || ''}
                          onChange={(e) => updateEditingPreference(sender.id, { customNotes: e.target.value })}
                          className="mt-1 min-h-[80px]"
                        />
                      </div>
                    </div>

                    {/* Warning for High Priority */}
                    {preference.enableCalls && (
                      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            You'll receive voice calls for emails from {sender.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {filteredSenders.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Settings className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Senders Found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}