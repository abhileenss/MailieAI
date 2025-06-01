# PookAi UX Flow Revision Recommendations

## Recommended User Journey Flow

Based on the analysis of the current implementation and Tushar's feedback, here's the recommended UX flow revision to restore the intended guided journey:

### 1. Landing Page → Simple CTA
- **Keep the current landing page** with the "Scan My Inbox Now" CTA
- **Implementation:** No changes needed to `landing.tsx`

### 2. Auth Screen → Gmail Authorization
- **Keep the current OAuth flow** for Gmail authorization
- **Implementation:** No changes needed to the auth flow

### 3. Email Scanning Screen → Engaging Loading Experience
- **Enhance the loading screen** with cycling prompts and animations
- **Implementation:** Modify `email-scanning.tsx` to:
  - Add cycling prompts (8-10 different messages)
  - Implement a more engaging animation
  - Don't show exact progress percentages

```tsx
// email-scanning.tsx modifications
const loadingPrompts = [
  "Analyzing your email patterns...",
  "Identifying important senders...",
  "Detecting newsletters and subscriptions...",
  "Finding actionable emails...",
  "Categorizing by importance...",
  "Preparing your personalized dashboard...",
  "Almost there! Finalizing your email insights...",
  "Getting everything ready for you..."
];

// Cycle through prompts every 3-4 seconds
const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentPromptIndex((prev) => (prev + 1) % loadingPrompts.length);
  }, 3500);
  
  return () => clearInterval(interval);
}, []);

// In the render:
<p className="text-lg text-muted-foreground mb-8">
  {loadingPrompts[currentPromptIndex]}
</p>
```

### 4. Email Categories Preview → First Decision Point
- **Create a new screen** to show initial categorization before the dashboard
- **Implementation:** Create `email-categories-preview.tsx`:

```tsx
// New file: email-categories-preview.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { categoryConfig } from "@/lib/categoryConfig"; // Extract shared config

export default function EmailCategoriesPreview() {
  const [, setLocation] = useLocation();
  
  // Fetch initial categorization
  const { data: processedEmails, isLoading } = useQuery({
    queryKey: ['/api/emails/processed']
  });
  
  const handleContinue = () => {
    setLocation("/preferences");
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage="/preview" />
      
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-semibold text-center mb-2">
            Your Email Analysis Results
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            We've analyzed your inbox and categorized your emails. Here's what we found:
          </p>
          
          {isLoading ? (
            <div className="text-center">Loading your results...</div>
          ) : (
            <>
              {/* Category Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const count = processedEmails?.categoryStats[key] || 0;
                  return (
                    <Card key={key} className="neopop-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                            <config.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{config.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {count} {count === 1 ? 'sender' : 'senders'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-4">
                  Now, let's set up which categories you want to receive calls about,
                  and which ones you'd prefer to keep quiet.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleContinue}
                  className="neopop-button neopop-button-primary px-8 py-6 text-lg"
                >
                  Set My Preferences
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
```

### 5. Preferences Selection → Personalization Step
- **Create a new screen** for setting category and sender preferences
- **Implementation:** Create `preferences.tsx`:

```tsx
// New file: preferences.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { categoryConfig } from "@/lib/categoryConfig";
import { apiRequest } from "@/lib/queryClient";

export default function Preferences() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('call-me');
  const [preferences, setPreferences] = useState({
    categories: {
      'call-me': true,
      'remind-me': true,
      'keep-quiet': false,
      'newsletter': false,
      'why-did-i-signup': false,
      'dont-tell-anyone': false
    },
    senders: {}
  });
  
  // Fetch processed emails
  const { data: processedEmails, isLoading } = useQuery({
    queryKey: ['/api/emails/processed']
  });
  
  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: (prefs) => apiRequest('/api/user/preferences', {
      method: 'POST',
      body: JSON.stringify(prefs)
    })
  });
  
  const handleCategoryToggle = (category) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };
  
  const handleSenderToggle = (senderId) => {
    setPreferences(prev => ({
      ...prev,
      senders: {
        ...prev.senders,
        [senderId]: !prev.senders[senderId]
      }
    }));
  };
  
  const handleContinue = () => {
    savePreferencesMutation.mutate(preferences, {
      onSuccess: () => setLocation("/call-setup")
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage="/preferences" />
      
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-semibold text-center mb-2">
            Set Your Communication Preferences
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Choose which categories and senders you want to receive calls about
          </p>
          
          {/* Category Preferences */}
          <Card className="mb-8 neopop-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Category Preferences</h2>
              <p className="text-muted-foreground mb-6">
                Select which email categories you want to be notified about:
              </p>
              
              <div className="grid gap-4">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                        <config.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{config.title}</h3>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={preferences.categories[key]}
                      onCheckedChange={() => handleCategoryToggle(key)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Sender Preferences */}
          {!isLoading && processedEmails && (
            <Card className="mb-8 neopop-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Sender Preferences</h2>
                <p className="text-muted-foreground mb-6">
                  Fine-tune which specific senders you want to hear about:
                </p>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        {config.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const senders = processedEmails.categorizedSenders[key] || [];
                    
                    return (
                      <TabsContent key={key} value={key} className="mt-6">
                        {senders.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">
                            No senders in this category
                          </p>
                        ) : (
                          <div className="grid gap-4">
                            {senders.map(sender => (
                              <div key={sender.id} className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{sender.name}</h3>
                                  <p className="text-sm text-muted-foreground">{sender.email}</p>
                                </div>
                                <Switch 
                                  checked={preferences.senders[sender.id] ?? preferences.categories[key]}
                                  onCheckedChange={() => handleSenderToggle(sender.id)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={handleContinue}
              disabled={savePreferencesMutation.isPending}
              className="neopop-button neopop-button-primary px-8 py-6 text-lg"
            >
              Continue to Call Setup
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

### 6. Call Setup → Communication Preferences
- **Create a new screen** for configuring call settings
- **Implementation:** Create `call-setup.tsx`:

```tsx
// New file: call-setup.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";

export default function CallSetup() {
  const [, setLocation] = useLocation();
  const [communicationType, setCommunicationType] = useState("call");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callTime, setCallTime] = useState("09:00");
  const [callDays, setCallDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  
  // Save call settings mutation
  const saveCallSettingsMutation = useMutation({
    mutationFn: (settings) => apiRequest('/api/user/call-settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    })
  });
  
  const handleDayToggle = (day) => {
    setCallDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const handleContinue = () => {
    const settings = {
      communicationType,
      phoneNumber,
      callTime,
      callDays
    };
    
    saveCallSettingsMutation.mutate(settings, {
      onSuccess: () => setLocation("/dashboard")
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage="/call-setup" />
      
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-semibold text-center mb-2">
            Set Up Your Communication Preferences
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Choose how and when you want to receive updates about your important emails
          </p>
          
          <Card className="mb-8 neopop-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Communication Method</h2>
              
              <RadioGroup 
                value={communicationType} 
                onValueChange={setCommunicationType}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="call" 
                    id="call" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="call"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Phone className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <p className="font-medium">Phone Call</p>
                      <p className="text-sm text-muted-foreground">
                        Receive voice calls with your email updates
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="whatsapp" 
                    id="whatsapp" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="whatsapp"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <MessageSquare className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        Receive text summaries via WhatsApp
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="mb-8 neopop-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Phone Number</h2>
              <p className="text-muted-foreground mb-4">
                Enter the phone number where you want to receive updates:
              </p>
              
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Include country code. Example: +1 for US, +91 for India
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8 neopop-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-4">Schedule</h2>
              
              <div className="mb-6">
                <Label htmlFor="callTime" className="mb-2 block">
                  Preferred Time
                </Label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <Input
                    id="callTime"
                    type="time"
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Days of the Week</Label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries({
                    monday: "M",
                    tuesday: "T",
                    wednesday: "W",
                    thursday: "T",
                    friday: "F",
                    saturday: "S",
                    sunday: "S"
                  }).map(([day, label]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        callDays[day] 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleContinue}
              disabled={saveCallSettingsMutation.isPending || !phoneNumber}
              className="neopop-button neopop-button-primary px-8 py-6 text-lg"
            >
              Complete Setup
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

### 7. Dashboard → Final Destination
- **Modify the existing dashboard** to show configured preferences
- **Implementation:** Update `email-dashboard.tsx`:

```tsx
// Modifications to email-dashboard.tsx

// Add these sections to the dashboard
const PreferencesSection = () => {
  const { data: preferences } = useQuery({
    queryKey: ['/api/user/preferences']
  });
  
  const { data: callSettings } = useQuery({
    queryKey: ['/api/user/call-settings']
  });
  
  if (!preferences || !callSettings) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Communication Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium">
                  {callSettings.communicationType === 'call' ? 'Phone Call' : 'WhatsApp'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-medium">{callSettings.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{callSettings.callTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days:</span>
                <span className="font-medium">
                  {Object.entries(callSettings.callDays)
                    .filter(([, enabled]) => enabled)
                    .map(([day]) => day.substring(0, 3))
                    .join(', ')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Category Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(preferences.categories).map(([category, enabled]) => {
                const config = categoryConfig[category];
                if (!config) return null;
                
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      {config.title}
                    </span>
                    <Badge variant={enabled ? "default" : "outline"}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLocation("/preferences")}
        >
          Edit Preferences
        </Button>
      </div>
    </div>
  );
};

// Add this component to the dashboard render, before the Tabs component
<PreferencesSection />
```

## Backend Route Changes

### 1. Add User Preferences API

```typescript
// server/routes.ts - Add these routes

// Store user preferences
app.post('/api/user/preferences', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const preferences = req.body;
    await storage.saveUserPreferences(userId, preferences);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// Get user preferences
app.get('/api/user/preferences', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const preferences = await storage.getUserPreferences(userId);
    res.json(preferences || { categories: {}, senders: {} });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

// Store call settings
app.post('/api/user/call-settings', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const callSettings = req.body;
    await storage.saveUserCallSettings(userId, callSettings);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving call settings:', error);
    res.status(500).json({ error: 'Failed to save call settings' });
  }
});

// Get call settings
app.get('/api/user/call-settings', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const callSettings = await storage.getUserCallSettings(userId);
    res.json(callSettings || {
      communicationType: 'call',
      phoneNumber: '',
      callTime: '09:00',
      callDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    });
  } catch (error) {
    console.error('Error getting call settings:', error);
    res.status(500).json({ error: 'Failed to get call settings' });
  }
});
```

### 2. Update Storage Methods

```typescript
// server/storage.ts - Add these methods

// Save user preferences
async saveUserPreferences(userId: string, preferences: any): Promise<void> {
  const db = getDatabase();
  await db.run(
    'INSERT INTO user_preferences (user_id, preferences) VALUES (?, ?) ' +
    'ON CONFLICT (user_id) DO UPDATE SET preferences = ?',
    [userId, JSON.stringify(preferences), JSON.stringify(preferences)]
  );
}

// Get user preferences
async getUserPreferences(userId: string): Promise<any> {
  const db = getDatabase();
  const result = await db.get(
    'SELECT preferences FROM user_preferences WHERE user_id = ?',
    [userId]
  );
  
  return result ? JSON.parse(result.preferences) : null;
}

// Save user call settings
async saveUserCallSettings(userId: string, callSettings: any): Promise<void> {
  const db = getDatabase();
  await db.run(
    'INSERT INTO user_call_settings (user_id, settings) VALUES (?, ?) ' +
    'ON CONFLICT (user_id) DO UPDATE SET settings = ?',
    [userId, JSON.stringify(callSettings), JSON.stringify(callSettings)]
  );
}

// Get user call settings
async getUserCallSettings(userId: string): Promise<any> {
  const db = getDatabase();
  const result = await db.get(
    'SELECT settings FROM user_call_settings WHERE user_id = ?',
    [userId]
  );
  
  return result ? JSON.parse(result.settings) : null;
}
```

## Navigation Flow Updates

### 1. Update App.tsx to Include New Routes

```tsx
// client/src/App.tsx
import { Route, Switch } from "wouter";
import Landing from "./pages/landing";
import EmailScan from "./pages/email-scan";
import EmailScanning from "./pages/email-scanning";
import EmailCategoriesPreview from "./pages/email-categories-preview"; // New
import Preferences from "./pages/preferences"; // New
import CallSetup from "./pages/call-setup"; // New
import EmailDashboard from "./pages/email-dashboard";
import Privacy from "./pages/privacy";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/scan" component={EmailScan} />
      <Route path="/scanning" component={EmailScanning} />
      <Route path="/preview" component={EmailCategoriesPreview} /> {/* New */}
      <Route path="/preferences" component={Preferences} /> {/* New */}
      <Route path="/call-setup" component={CallSetup} /> {/* New */}
      <Route path="/dashboard" component={EmailDashboard} />
      <Route path="/privacy" component={Privacy} />
    </Switch>
  );
}
```

### 2. Update Auth Flow to Redirect to Scanning

```typescript
// server/routes.ts - Update the auth callback route

app.get('/api/auth/gmail/callback', async (req, res) => {
  try {
    // Existing auth code...
    
    // After successful auth, redirect to scanning page instead of dashboard
    res.redirect('/scanning');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect('/?error=auth_failed');
  }
});
```

### 3. Update Email Scanning Page to Redirect to Preview

```tsx
// client/src/pages/email-scanning.tsx - Update the completion handler

// When scanning is complete
if (scanStatus === 'complete') {
  // Redirect to preview page instead of dashboard
  setTimeout(() => {
    setLocation('/preview');
  }, 1000);
}
```

## Summary of Changes

1. **New Pages Added:**
   - Email Categories Preview (`/preview`)
   - Preferences Selection (`/preferences`)
   - Call Setup (`/call-setup`)

2. **Modified Pages:**
   - Email Scanning (enhanced loading experience)
   - Dashboard (added preferences display)

3. **New Backend Routes:**
   - `/api/user/preferences` (GET/POST)
   - `/api/user/call-settings` (GET/POST)

4. **Updated User Flow:**
   - Landing → Auth → Scanning → Preview → Preferences → Call Setup → Dashboard

These changes restore the intended guided journey while maintaining all the functionality of the current implementation. The user will now have a clear path through the setup process, with opportunities to personalize their experience before seeing the dashboard.
