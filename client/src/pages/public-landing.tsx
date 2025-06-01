import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Phone, Lock, ArrowRight, Mail, Users, Building, Clock, Target, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  role: string;
  industry: string;
  priorityTypes: string[];
  communicationStyle: string;
  voicePreference: string;
  referralSource: string;
}

interface OnboardingOption {
  value: string;
  label: string;
  icon: any;
  description?: string;
}

interface OnboardingStep {
  title: string;
  subtitle: string;
  multiSelect?: boolean;
  options: OnboardingOption[];
}

export default function PublicLanding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    role: '',
    industry: '',
    priorityTypes: [],
    communicationStyle: '',
    voicePreference: '',
    referralSource: ''
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      title: "What's your role?",
      subtitle: "Help us understand your work",
      options: [
        { value: 'founder', label: 'Founder / Business Owner', icon: Building },
        { value: 'manager', label: 'Manager / Team Lead', icon: Users },
        { value: 'designer', label: 'Designer / Creative', icon: Brain },
        { value: 'developer', label: 'Developer / Engineer', icon: Target },
        { value: 'consultant', label: 'Consultant / Freelancer', icon: Zap },
        { value: 'other', label: 'Other', icon: Users }
      ]
    },
    {
      title: "What industry are you in?",
      subtitle: "This helps us understand your email patterns",
      options: [
        { value: 'technology', label: 'Technology / Software', icon: Brain },
        { value: 'finance', label: 'Finance / Banking', icon: Building },
        { value: 'healthcare', label: 'Healthcare / Medical', icon: Users },
        { value: 'education', label: 'Education / Training', icon: Target },
        { value: 'consulting', label: 'Consulting / Services', icon: Zap },
        { value: 'other', label: 'Other Industry', icon: Building }
      ]
    },
    {
      title: "What emails need your attention most?",
      subtitle: "Select all that apply",
      multiSelect: true,
      options: [
        { value: 'clients', label: 'Client Communications', icon: Users },
        { value: 'team', label: 'Team Updates', icon: Users },
        { value: 'billing', label: 'Billing & Payments', icon: Building },
        { value: 'security', label: 'Security & Alerts', icon: Lock },
        { value: 'partnerships', label: 'Business Opportunities', icon: Target },
        { value: 'personal', label: 'Personal Important', icon: Mail }
      ]
    },
    {
      title: "How do you prefer notifications?",
      subtitle: "Choose your communication style",
      options: [
        { value: 'immediate', label: 'Immediate alerts for urgent items', icon: Phone },
        { value: 'daily', label: 'Daily summary calls', icon: Clock },
        { value: 'text-first', label: 'Text summary then call if needed', icon: Mail },
        { value: 'minimal', label: 'Only critical emergencies', icon: Brain }
      ]
    },
    {
      title: "Choose your AI voice",
      subtitle: "Pick your preferred voice for call summaries",
      options: [
        { value: 'morgan-freeman', label: 'Morgan Freeman', icon: Phone, description: 'Deep, authoritative voice' },
        { value: 'naval-ravikant', label: 'Naval Ravikant', icon: Brain, description: 'Calm, philosophical tone' },
        { value: 'joe-rogan', label: 'Joe Rogan', icon: Users, description: 'Conversational, engaging style' },
        { value: 'andrew-schulz', label: 'Andrew Schulz', icon: Zap, description: 'Energetic, direct delivery' },
        { value: 'amitabh-bachchan', label: 'Amitabh Bachchan', icon: Target, description: 'Distinguished, commanding presence' },
        { value: 'priyanka-chopra', label: 'Priyanka Chopra', icon: Mail, description: 'Professional, clear articulation' }
      ]
    },
    {
      title: "How did you hear about us?",
      subtitle: "Help us improve our outreach",
      options: [
        { value: 'search', label: 'Google Search', icon: Target },
        { value: 'social', label: 'Social Media', icon: Users },
        { value: 'friend', label: 'Friend / Colleague', icon: Users },
        { value: 'article', label: 'Article / Blog Post', icon: Mail },
        { value: 'ad', label: 'Advertisement', icon: Zap },
        { value: 'other', label: 'Other', icon: Brain }
      ]
    }
  ];

  const handleStepAnswer = (value: string) => {
    const currentStepData = onboardingSteps[currentStep];
    
    if (currentStepData.multiSelect) {
      const currentValues = userProfile.priorityTypes || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      
      setUserProfile(prev => ({
        ...prev,
        priorityTypes: updatedValues
      }));
    } else {
      const fieldMap = ['role', 'industry', 'priorityTypes', 'communicationStyle', 'voicePreference', 'referralSource'];
      const field = fieldMap[currentStep] as keyof UserProfile;
      
      setUserProfile(prev => ({
        ...prev,
        [field]: value
      }));
      
      setTimeout(() => {
        if (currentStep < onboardingSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          handleCompleteOnboarding();
        }
      }, 500);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    window.location.href = "/api/login";
  };

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    const currentStepData = onboardingSteps[currentStep];
    
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <div className="p-6">
          <h2 className="text-2xl font-bold">PookAi Setup</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl mx-auto w-full">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {onboardingSteps.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="neopop-card p-8">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold mb-4">{currentStepData.title}</CardTitle>
                  <p className="text-xl text-muted-foreground">{currentStepData.subtitle}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStepData.options.map((option) => {
                      const Icon = option.icon;
                      const isSelected = currentStepData.multiSelect 
                        ? userProfile.priorityTypes.includes(option.value)
                        : false;
                      
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => handleStepAnswer(option.value)}
                          className={`neopop-button p-6 rounded-xl text-left hover:scale-105 transition-all duration-200 ${
                            isSelected ? 'neopop-button-primary' : 'neopop-button-secondary'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary-foreground' : 'bg-primary'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                isSelected ? 'text-primary' : 'text-primary-foreground'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold text-lg">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {option.description}
                                </div>
                              )}
                              {isSelected && currentStepData.multiSelect && (
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {currentStepData.multiSelect && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={() => {
                          if (currentStep < onboardingSteps.length - 1) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            handleCompleteOnboarding();
                          }
                        }}
                        disabled={userProfile.priorityTypes.length === 0}
                        className="neopop-button neopop-button-primary px-8 py-3"
                      >
                        Continue
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        {userProfile.priorityTypes.length} selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">PookAi</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
          <a href="/security" className="text-gray-300 hover:text-white transition-colors">Security</a>
          <a href="/support" className="text-gray-300 hover:text-white transition-colors">Support</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-8">
              <span className="text-sm font-medium text-purple-200">New: Voice-first email intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Stop Missing What
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Actually Matters
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Your AI concierge calls you daily with what's urgent, filters the noise, 
              and gives you back hours of focused time every day.
            </p>
            
            {/* Enhanced CTA Section */}
            <div className="flex flex-col items-center space-y-6 mb-12">
              <motion.button 
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Scan My Inbox Now
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </motion.button>
              
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>2-minute setup</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Privacy first</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Categories</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                "Call Me For This", "Why Did I Sign Up?", "Don't Tell Anyone" - categories that make sense for busy professionals
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Phone className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Daily Voice Calls</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                "Hey, 3 investor emails need responses and your payment processor is down" - delivered by voice
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Privacy First</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                No data selling, no surveillance. Your inbox secrets stay between you and your AI concierge
              </p>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Connect Gmail</h3>
                <p className="text-gray-300">Secure OAuth connection to your email</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI Categorizes</h3>
                <p className="text-gray-300">Smart categorization of all your emails</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Daily Voice Summary</h3>
                <p className="text-gray-300">Get called with what actually matters</p>
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-400 mb-6">Trusted by founders at</p>
            <div className="flex justify-center items-center space-x-8 text-gray-300 text-lg">
              <span>YC Companies</span>
              <span>•</span>
              <span>500 Startups</span>
              <span>•</span>
              <span>Techstars</span>
              <span>•</span>
              <span>AngelList</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PookAi</span>
              </div>
              <p className="text-gray-400">
                Your AI email concierge for busy professionals
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="#demo" className="block text-gray-400 hover:text-white transition-colors">Demo</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/security" className="block text-gray-400 hover:text-white transition-colors">Security</a>
                <a href="/support" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="mailto:hello@pookai.com" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PookAi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}