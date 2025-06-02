import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Bell, ArrowRight, ArrowLeft, CheckCircle, Clock, Briefcase, CreditCard, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

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
  categorizedSenders: {
    'call-me': EmailSender[];
    'remind-me': EmailSender[];
    'keep-quiet': EmailSender[];
    'newsletter': EmailSender[];
    'why-did-i-signup': EmailSender[];
    'dont-tell-anyone': EmailSender[];
    'unassigned': EmailSender[];
  };
  categoryStats: Record<string, number>;
}

interface EmailCategory {
  category: string;
  count: number;
  examples: string[];
  icon: any;
  description: string;
}

interface NotificationPreference {
  category: string;
  morningCall: boolean;
  digestSummary: boolean;
  urgentAlerts: boolean;
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [step, setStep] = useState(1); // 1: Categories, 2: Preview, 3: Complete

  // Fetch processed emails to show categories
  const { data: emailData, isLoading } = useQuery<ProcessedEmailsResponse>({
    queryKey: ['/api/emails/processed'],
    enabled: true
  });

  const categoryMap: Record<string, EmailCategory> = {
    'call-me': {
      category: 'call-me',
      count: 0,
      examples: [],
      icon: Phone,
      description: 'Urgent emails that need immediate attention'
    },
    'remind-me': {
      category: 'remind-me', 
      count: 0,
      examples: [],
      icon: Bell,
      description: 'Important reminders and follow-ups'
    },
    'newsletter': {
      category: 'newsletter',
      count: 0,
      examples: [],
      icon: Mail,
      description: 'Newsletters and regular updates'
    },
    'why-did-i-signup': {
      category: 'why-did-i-signup',
      count: 0,
      examples: [],
      icon: Users,
      description: 'Subscriptions you might want to review'
    },
    'dont-tell-anyone': {
      category: 'dont-tell-anyone',
      count: 0,
      examples: [],
      icon: Briefcase,
      description: 'Private and confidential communications'
    }
  };

  useEffect(() => {
    if (emailData?.categorizedSenders) {
      const categories: EmailCategory[] = [];
      
      Object.entries(emailData.categorizedSenders).forEach(([category, senders]) => {
        if (categoryMap[category] && Array.isArray(senders) && senders.length > 0) {
          categories.push({
            ...categoryMap[category],
            count: senders.length,
            examples: senders.slice(0, 3).map((s: EmailSender) => s.name || s.email)
          });
        }
      });

      // Initialize preferences
      const initialPrefs = categories.map(cat => ({
        category: cat.category,
        morningCall: cat.category === 'call-me' || cat.category === 'remind-me',
        digestSummary: true,
        urgentAlerts: cat.category === 'call-me'
      }));
      
      setPreferences(initialPrefs);
    }
  }, [emailData]);

  const updatePreference = (category: string, field: keyof NotificationPreference, value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.category === category 
          ? { ...pref, [field]: value }
          : pref
      )
    );
  };

  const getActiveCategories = () => {
    return preferences.filter(pref => 
      pref.morningCall || pref.digestSummary || pref.urgentAlerts
    );
  };

  const generateSampleTranscript = () => {
    const activeCategories = getActiveCategories();
    const totalEmails = activeCategories.reduce((sum, pref) => {
      const category = Object.values(categoryMap).find(c => c.category === pref.category);
      return sum + (category?.count || 0);
    }, 0);

    return `"Good morning! This is your PookAi assistant with your daily email digest. 

You have ${totalEmails} emails across ${activeCategories.length} important categories:

${activeCategories.map(pref => {
  const category = Object.values(categoryMap).find(c => c.category === pref.category);
  return `• ${category?.count || 0} ${category?.description?.toLowerCase()}`;
}).join('\n')}

${activeCategories.some(p => p.urgentAlerts) ? 'You have urgent items that need immediate attention in your "Call Me" category.' : ''}

Would you like me to go through each category in detail? This call will take about 3-4 minutes."`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your email categories...</p>
        </div>
      </div>
    );
  }

  const availableCategories = Object.values(categoryMap).filter(cat => 
    emailData?.categorizedSenders?.[cat.category]?.length > 0
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4">Choose Your Notification Preferences</h1>
              <p className="text-xl text-gray-300">
                We've categorized your {emailData?.totalSenders || 0} email senders. 
                Choose which categories you want included in your daily calls and digests.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {availableCategories.map((category, index) => {
                const pref = preferences.find(p => p.category === category.category);
                const Icon = category.icon;

                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-zinc-900 border-zinc-800 p-6">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <CardTitle className="text-white capitalize text-lg">
                              {category.category.replace('-', ' ')}
                            </CardTitle>
                            <p className="text-sm text-gray-400">{category.count} senders</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{category.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          Examples: {category.examples.slice(0, 2).join(', ')}
                          {category.examples.length > 2 && '...'}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category.category}-morning`}
                            checked={pref?.morningCall || false}
                            onCheckedChange={(checked) => 
                              updatePreference(category.category, 'morningCall', checked as boolean)
                            }
                          />
                          <label htmlFor={`${category.category}-morning`} className="text-sm text-gray-300">
                            Include in morning call
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category.category}-digest`}
                            checked={pref?.digestSummary || false}
                            onCheckedChange={(checked) => 
                              updatePreference(category.category, 'digestSummary', checked as boolean)
                            }
                          />
                          <label htmlFor={`${category.category}-digest`} className="text-sm text-gray-300">
                            Include in daily digest
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category.category}-urgent`}
                            checked={pref?.urgentAlerts || false}
                            onCheckedChange={(checked) => 
                              updatePreference(category.category, 'urgentAlerts', checked as boolean)
                            }
                          />
                          <label htmlFor={`${category.category}-urgent`} className="text-sm text-gray-300">
                            Send urgent alerts
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <Button
                onClick={() => setStep(2)}
                disabled={getActiveCategories().length === 0}
                className="bg-orange-400 text-black hover:bg-orange-500 flex items-center space-x-2"
              >
                <span>Preview Your Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4">Your Call Preview</h1>
              <p className="text-xl text-gray-300">
                Here's exactly what your morning call will sound like
              </p>
            </motion.div>

            <Card className="bg-zinc-900 border-zinc-800 p-8 mb-8">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Sample Morning Call</CardTitle>
                    <p className="text-gray-400">Expected duration: 3-4 minutes</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-black/30 rounded-lg p-6 border border-zinc-700">
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {generateSampleTranscript()}
                  </pre>
                </div>
                
                <div className="mt-6 p-4 bg-orange-400/10 rounded-lg border border-orange-400/20">
                  <div className="flex items-center space-x-2 text-orange-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Call Schedule: Daily at 8:00 AM</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    You can change this time in your dashboard settings
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Categories</span>
              </Button>
              
              <Button
                onClick={() => setStep(3)}
                className="bg-orange-400 text-black hover:bg-orange-500 flex items-center space-x-2"
              >
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Complete Summary
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Setup Complete!</h1>
            <p className="text-xl text-gray-300">
              Your PookAi email concierge is ready to work
            </p>
          </motion.div>

          <Card className="bg-zinc-900 border-zinc-800 p-8 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl mb-6">Your Configuration Summary</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Email Processing</h3>
                <p className="text-gray-300">
                  ✓ {emailData?.totalSenders || 0} email senders categorized and processed
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Active Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getActiveCategories().map(pref => {
                    const category = Object.values(categoryMap).find(c => c.category === pref.category);
                    return (
                      <div key={pref.category} className="bg-black/30 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center">
                            <category.icon className="w-3 h-3 text-black" />
                          </div>
                          <span className="font-medium capitalize">
                            {pref.category.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          {pref.morningCall && <div>✓ Morning calls</div>}
                          {pref.digestSummary && <div>✓ Daily digest</div>}
                          {pref.urgentAlerts && <div>✓ Urgent alerts</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Call Schedule</h3>
                <p className="text-gray-300">
                  ✓ Daily morning calls at 8:00 AM
                  <br />
                  ✓ Estimated duration: 3-4 minutes
                  <br />
                  ✓ Voice: Natural AI assistant
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-orange-400 text-black hover:bg-orange-500 px-8 py-3 text-lg font-semibold"
            >
              Continue to Dashboard
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              You can modify these settings anytime in your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}