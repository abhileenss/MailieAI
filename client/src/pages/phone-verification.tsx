import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Volume2, Play, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: string;
}

export default function PhoneVerification() {
  const [step, setStep] = useState(1); // 1: Phone, 2: Voice, 3: Test Call
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const voiceOptions: VoiceOption[] = [
    { id: "rachel", name: "Rachel", description: "Professional female voice", gender: "female" },
    { id: "josh", name: "Josh", description: "Friendly male voice", gender: "male" },
    { id: "arnold", name: "Arnold", description: "Authoritative male voice", gender: "male" },
    { id: "bella", name: "Bella", description: "Warm female voice", gender: "female" },
    { id: "adam", name: "Adam", description: "Clear male voice", gender: "male" }
  ];

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber })
      });

      if (response.ok) {
        toast({
          title: "Verification code sent",
          description: "Check your phone for the verification code"
        });
        setStep(2);
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: verificationCode })
      });

      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Phone verified successfully",
          description: "Your phone number has been verified"
        });
        setStep(3);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleTestCall = async () => {
    if (!selectedVoice) {
      toast({
        title: "Voice selection required",
        description: "Please select a voice for your calls",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/voice/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phoneNumber, 
          voiceId: selectedVoice,
          testMessage: "Hello! This is a test call from PookAi. Your voice preference has been set successfully."
        })
      });

      if (response.ok) {
        toast({
          title: "Test call initiated",
          description: "You should receive a test call shortly"
        });
        
        // Wait a moment then proceed to call configuration
        setTimeout(() => {
          window.location.href = "/call-config";
        }, 2000);
      } else {
        throw new Error("Failed to initiate test call");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make test call. You can still continue to setup.",
        variant: "destructive"
      });
      
      // Allow user to continue even if test call fails
      setTimeout(() => {
        window.location.href = "/call-config";
      }, 1000);
    }
    setIsLoading(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
              <p className="text-muted-foreground">
                We'll send you a verification code to confirm your number
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-orange-400 text-black hover:bg-orange-500"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
              <p className="text-muted-foreground">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="flex-1 bg-orange-400 text-black hover:bg-orange-500"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl">Choose Your Voice</CardTitle>
              <p className="text-muted-foreground">
                Select the voice you'd like for your daily call summaries
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {voiceOptions.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedVoice === voice.id
                        ? "border-orange-400 bg-orange-400/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{voice.name}</h3>
                        <p className="text-sm text-muted-foreground">{voice.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
                          {voice.gender}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Preview voice logic would go here
                          }}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleTestCall}
                  disabled={isLoading || !selectedVoice}
                  className="flex-1 bg-orange-400 text-black hover:bg-orange-500"
                >
                  {isLoading ? "Calling..." : "Test Call & Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-400/5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl -translate-x-48 -translate-y-48 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl translate-x-48 translate-y-48 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold">Phone Verification</span>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? "bg-orange-400 text-black" : "bg-zinc-700 text-zinc-400"
          }`}>
            1
          </div>
          <div className={`h-1 w-8 ${step >= 2 ? "bg-orange-400" : "bg-zinc-700"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? "bg-orange-400 text-black" : "bg-zinc-700 text-zinc-400"
          }`}>
            2
          </div>
          <div className={`h-1 w-8 ${step >= 3 ? "bg-orange-400" : "bg-zinc-700"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 3 ? "bg-orange-400 text-black" : "bg-zinc-700 text-zinc-400"
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {renderStepContent()}
        </motion.div>
      </div>
    </div>
  );
}