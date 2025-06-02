import { useState } from "react";
import { Phone, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function PhoneSetup() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [voicePreference, setVoicePreference] = useState('rachel');
  const [callTiming, setCallTiming] = useState('morning');
  const { toast } = useToast();

  // Send verification code
  const sendCodeMutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await fetch('/api/phone/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationSent(true);
      if (data.demoCode) {
        toast({
          title: "Demo mode active",
          description: `Use verification code: ${data.demoCode}`,
        });
      } else {
        toast({
          title: "Verification code sent",
          description: "Check your phone for the verification code.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Failed to send code",
        description: "Please try again or check your phone number.",
        variant: "destructive",
      });
    }
  });

  // Verify phone number
  const verifyCodeMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const response = await fetch('/api/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, code: code }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Invalid verification code');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsPhoneVerified(true);
      toast({
        title: "Phone verified!",
        description: "Your phone number has been successfully verified.",
      });
    },
    onError: () => {
      toast({
        title: "Invalid code",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendCode = () => {
    // Format phone number for Twilio (ensure it starts with +)
    let formatted = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (formatted.startsWith('91') && formatted.length === 12) {
      // Indian number starting with 91
      formatted = '+' + formatted;
    } else if (formatted.length === 10) {
      // US number
      formatted = '+1' + formatted;
    } else if (!formatted.startsWith('+')) {
      // Add + if not present
      formatted = '+' + formatted;
    }
    
    if (formatted.length >= 12) {
      setFormattedPhone(formatted); // Store the formatted phone
      sendCodeMutation.mutate(formatted);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode.length >= 4) {
      // Use the same formatted phone number that was used for sending
      verifyCodeMutation.mutate({ phone: formattedPhone, code: verificationCode });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Configure your preferences and generate a personalized call script</h1>
          <p className="text-gray-400">Set up your phone number and voice preferences for PookAi calls</p>
        </div>

        <div className="space-y-6">
          {/* Phone Verification */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Phone Verification</span>
                {isPhoneVerified && <Check className="w-5 h-5 text-green-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                    disabled={isPhoneVerified}
                  />
                  <Button
                    onClick={handleSendCode}
                    disabled={phoneNumber.length < 10 || sendCodeMutation.isPending || isPhoneVerified}
                    className="bg-orange-400 hover:bg-orange-500 text-black"
                  >
                    {sendCodeMutation.isPending ? "Sending..." : "Send Code"}
                  </Button>
                </div>
              </div>

              {verificationSent && !isPhoneVerified && (
                <div>
                  <Label htmlFor="code" className="text-gray-300">Verification Code</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleVerifyCode}
                      disabled={verificationCode.length < 4 || verifyCodeMutation.isPending}
                      className="bg-orange-400 hover:bg-orange-500 text-black"
                    >
                      {verifyCodeMutation.isPending ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              )}

              {isPhoneVerified && (
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Phone number verified successfully</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Preferences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Voice & Call Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Voice Style</Label>
                <Select value={voicePreference} onValueChange={setVoicePreference}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="rachel">Rachel (Professional Female)</SelectItem>
                    <SelectItem value="josh">Josh (Professional Male)</SelectItem>
                    <SelectItem value="bella">Bella (Friendly Female)</SelectItem>
                    <SelectItem value="antoni">Antoni (Friendly Male)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Call Timing</Label>
                <Select value={callTiming} onValueChange={setCallTiming}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                    <SelectItem value="immediate">Immediate (for urgent emails only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Setup Status */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className={`flex items-center space-x-2 ${isPhoneVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                {isPhoneVerified ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>Phone {isPhoneVerified ? 'verified' : 'verification required'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}