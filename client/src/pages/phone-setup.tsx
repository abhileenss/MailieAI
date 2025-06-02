import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Phone, CheckCircle } from "lucide-react";

interface PhoneSetupProps {
  onComplete: () => void;
}

export default function PhoneSetup({ onComplete }: PhoneSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const handleSendVerification = async () => {
    try {
      setIsVerifying(true);
      const response = await fetch('/api/phone/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
        credentials: 'include'
      });

      if (response.ok) {
        setVerificationSent(true);
        toast({
          title: "Verification sent!",
          description: "Check your phone for the verification code.",
        });
      } else {
        throw new Error('Failed to send verification');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('/api/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
        credentials: 'include'
      });

      if (response.ok) {
        setIsVerified(true);
        toast({
          title: "Phone verified!",
          description: "Your phone number has been verified successfully.",
        });
        setTimeout(onComplete, 1500);
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Phone Verified!</h3>
          <p className="text-gray-400">Your phone number has been verified successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Phone Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            disabled={verificationSent}
          />
        </div>

        {!verificationSent ? (
          <Button
            onClick={handleSendVerification}
            disabled={!phoneNumber || isVerifying}
            className="w-full bg-orange-400 hover:bg-orange-500 text-black"
          >
            {isVerifying ? "Sending..." : "Send Verification Code"}
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <Button
              onClick={handleVerifyCode}
              disabled={!verificationCode}
              className="w-full bg-orange-400 hover:bg-orange-500 text-black"
            >
              Verify Phone
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}