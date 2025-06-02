import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, CheckCircle } from "lucide-react";

interface PhoneSetupProps {
  onPhoneVerified?: () => void;
}

export default function PhoneSetup({ onPhoneVerified }: PhoneSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

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
    onSuccess: () => {
      setIsCodeSent(true);
      toast({
        title: "Code sent!",
        description: "Check your phone for the verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const response = await fetch('/api/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, code }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Invalid verification code');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsVerified(true);
      toast({
        title: "Phone verified!",
        description: "Your phone number has been successfully verified.",
      });
      if (onPhoneVerified) {
        onPhoneVerified();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Please check your code and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendCode = () => {
    if (phoneNumber.trim()) {
      sendCodeMutation.mutate(phoneNumber);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode.trim()) {
      verifyCodeMutation.mutate({ phone: phoneNumber, code: verificationCode });
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Phone Verified!</h2>
            <p className="text-gray-400">
              Your phone number has been successfully verified. mailieAI can now call you with important updates.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6 flex items-center justify-center">
      <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Phone className="w-5 h-5" />
            <span>Phone Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCodeSent ? (
            <>
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button
                onClick={handleSendCode}
                disabled={!phoneNumber.trim() || sendCodeMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {sendCodeMutation.isPending ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="code" className="text-white">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerifyCode}
                disabled={!verificationCode.trim() || verifyCodeMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {verifyCodeMutation.isPending ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button
                onClick={() => {
                  setIsCodeSent(false);
                  setVerificationCode('');
                }}
                variant="outline"
                className="w-full border-zinc-700 text-gray-400 hover:bg-zinc-800"
              >
                Change Phone Number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}