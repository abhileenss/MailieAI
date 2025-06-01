import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Phone, Lock, ArrowRight, Mail, Users, Building, Clock, Target, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  role: string;
  companyStage: string;
  emailVolume: string;
  priorityTypes: string[];
  communicationStyle: string;
  urgencyPreference: string;
}

export default function PublicLanding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    role: '',
    companyStage: '',
    emailVolume: '',
    priorityTypes: [],
    communicationStyle: '',
    urgencyPreference: ''
  });

  const onboardingSteps = [
    {
      title: "What's your role?",
      subtitle: "Help us understand your responsibilities",
      options: [
        { value: 'founder-ceo', label: 'Founder / CEO', icon: Building },
        { value: 'founder-cto', label: 'Founder / CTO', icon: Brain },
        { value: 'founder-other', label: 'Co-founder / Other', icon: Users },
        { value: 'executive', label: 'Executive / C-Level', icon: Target }
      ]
    },
    {
      title: "What stage is your company?",
      subtitle: "This helps us understand your communication patterns",
      options: [
        { value: 'idea', label: 'Idea / Pre-seed', icon: Zap },
        { value: 'seed', label: 'Seed Stage', icon: Building },
        { value: 'series-a', label: 'Series A+', icon: Target },
        { value: 'established', label: 'Established Company', icon: Users }
      ]
    },
    {
      title: "How many emails do you get daily?",
      subtitle: "Let's gauge your inbox volume",
      options: [
        { value: '50-100', label: '50-100 emails', icon: Mail },
        { value: '100-200', label: '100-200 emails', icon: Mail },
        { value: '200-500', label: '200-500 emails', icon: Mail },
        { value: '500+', label: '500+ emails', icon: Mail }
      ]
    },
    {
      title: "What requires your immediate attention?",
      subtitle: "Select all that apply",
      multiSelect: true,
      options: [
        { value: 'investors', label: 'Investor Communications', icon: Target },
        { value: 'customers', label: 'Customer Issues', icon: Users },
        { value: 'team', label: 'Team Emergencies', icon: Users },
        { value: 'payments', label: 'Payment/Billing Issues', icon: Building },
        { value: 'security', label: 'Security Alerts', icon: Lock },
        { value: 'partnerships', label: 'Partnership Opportunities', icon: Building }
      ]
    },
    {
      title: "How do you prefer urgent updates?",
      subtitle: "Choose your communication style",
      options: [
        { value: 'immediate-call', label: 'Immediate phone call', icon: Phone },
        { value: 'scheduled-call', label: 'Scheduled daily calls', icon: Clock },
        { value: 'text-first', label: 'Text summary first, then call', icon: Mail },
        { value: 'flexible', label: 'Flexible based on urgency', icon: Brain }
      ]
    }
  ];

  const handleStepAnswer = (value: string) => {
    const currentStepData = onboardingSteps[currentStep];
    
    if (currentStepData.multiSelect) {
      const currentValues = userProfile.priorityTypes || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      setUserProfile(prev => ({
        ...prev,
        priorityTypes: updatedValues
      }));
    } else {
      const fieldMap = ['role', 'companyStage', 'emailVolume', 'priorityTypes', 'communicationStyle'];
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Your Founder's
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                AI Concierge
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop drowning in email chaos. Your AI concierge calls you daily with what actually matters, 
              filters the noise, and keeps you focused on building your startup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={handleGetStarted}
                className="neopop-button neopop-button-primary text-xl px-12 py-6 font-semibold"
              >
                Start My Setup
                <ArrowRight className="ml-3 w-6 h-6" />
              </button>
              <p className="text-lg text-muted-foreground">
                2-minute setup • No credit card needed
              </p>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="neopop-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Categories</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Call Me For This", "Why Did I Sign Up?", "Don't Tell Anyone" - categories that make sense for founders
              </p>
            </Card>
            
            <Card className="neopop-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Phone className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Daily Voice Calls</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Hey, 3 investor emails need responses and your payment processor is down" - delivered by voice
              </p>
            </Card>
            
            <Card className="neopop-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No data selling, no surveillance. Your inbox secrets stay between you and your AI concierge
              </p>
            </Card>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-muted-foreground mb-6">Trusted by founders at</p>
            <div className="flex justify-center items-center space-x-8 text-muted-foreground text-lg">
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
    </div>
  );
}