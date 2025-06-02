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
      subtitle: "Help us understand your priorities",
      options: [
        { value: 'founder-ceo', label: 'Founder / CEO', icon: Building },
        { value: 'executive', label: 'Executive / Manager', icon: Users },
        { value: 'professional', label: 'Professional / Individual', icon: Brain },
        { value: 'other', label: 'Other', icon: Target }
      ]
    },
    {
      title: "What needs your immediate attention?",
      subtitle: "Select your top priorities",
      multiSelect: true,
      options: [
        { value: 'investors', label: 'Investor Communications', icon: Target },
        { value: 'customers', label: 'Customer Issues', icon: Users },
        { value: 'team', label: 'Team Updates', icon: Users },
        { value: 'billing', label: 'Payment & Billing', icon: Building },
        { value: 'security', label: 'Security Alerts', icon: Lock },
        { value: 'personal', label: 'Personal Important', icon: Mail }
      ]
    },
    {
      title: "How should we notify you?",
      subtitle: "Choose your preferred style",
      options: [
        { value: 'daily', label: 'Daily morning summary call', icon: Phone, description: 'Perfect for busy schedules' },
        { value: 'immediate', label: 'Immediate alerts for urgent items', icon: Zap, description: 'Never miss critical emails' },
        { value: 'text-first', label: 'Text summary, call if urgent', icon: Mail, description: 'Best of both worlds' }
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
      const fieldMap = ['role', 'priorityTypes', 'communicationStyle'];
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
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navigation Header */}
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-400 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold">PookAi</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
          <a href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
          <a href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
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
            <div className="inline-flex items-center px-6 py-3 bg-orange-400/20 rounded-full border border-orange-400/30 mb-10">
              <span className="text-sm font-semibold text-orange-200">AI Email Intelligence for Busy Professionals</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-10 leading-tight tracking-tight">
              Stop Missing What
              <br />
              <span className="text-orange-400">
                Actually Matters
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-14 max-w-5xl mx-auto leading-relaxed font-medium">
              Your AI concierge calls you daily with urgent emails, filters promotional noise, 
              and gives you back <span className="text-orange-400 font-bold">2+ hours</span> of focused time every day.
            </p>
            
            {/* Enhanced CTA Section */}
            <div className="flex flex-col items-center space-y-8 mb-16">
              <motion.button 
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-black text-black bg-orange-400 rounded-lg shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Start 30-Second Setup
                  <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-gray-300 text-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">30-second setup</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                  <span className="font-medium">Enterprise privacy</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Join 500+ professionals who saved 10+ hours this week</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white/20 -ml-2 first:ml-0"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="group bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center hover:border-orange-400/40 transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-orange-400 rounded-lg mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Brain className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">Smart Categories</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                "Call Me For This", "Why Did I Sign Up?", "Don't Tell Anyone" - categories that actually make sense for your workflow
              </p>
            </div>
            
            <div className="group bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center hover:border-orange-400/40 transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-orange-400 rounded-lg mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Phone className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">Voice Intelligence</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                "Hey, 3 investor emails need responses and your payment processor is down" - delivered naturally by voice
              </p>
            </div>
            
            <div className="group bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center hover:border-orange-400/40 transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-orange-400 rounded-lg mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Lock className="text-black w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">Enterprise Privacy</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Zero data selling, zero surveillance. Your email content stays completely private and secure
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
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Connect Gmail</h3>
                <p className="text-gray-300">Secure OAuth connection to your email</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-white">AI Categorizes</h3>
                <p className="text-gray-300">Smart categorization of all your emails</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-black font-bold text-xl mb-4">3</div>
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
      <footer className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black" />
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