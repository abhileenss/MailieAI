import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { UserRoundCheck, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VoiceSelector } from "@/components/voice-selector";
import { mockVoiceOptions } from "@/data/mock-data";

export default function CallConfig() {
  const [, setLocation] = useLocation();
  const [selectedVoice, setSelectedVoice] = useState("sarah");
  const [callTime, setCallTime] = useState("9:00 AM");
  const [timeZone, setTimeZone] = useState("PST");
  const [frequency, setFrequency] = useState("daily");
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigateToFinalSetup = () => {
    setLocation("/final-setup");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-primary">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-semibold mb-4 tracking-tight">Configure Your Daily Calls <span className="text-sm bg-primary/20 text-primary px-3 py-1 neopop-button font-medium">Coming Soon</span></h1>
          <p className="text-muted-foreground">Preview how your AI concierge will call you daily with personalized updates</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Selection */}
          <motion.div 
            className="neopop-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-6 flex items-center">
              <UserRoundCheck className="text-primary mr-2 w-5 h-5" />
              Choose Your AI Voice
            </h3>
            
            <VoiceSelector
              voices={mockVoiceOptions}
              selectedVoice={selectedVoice}
              onSelect={setSelectedVoice}
            />
          </motion.div>

          {/* Call Schedule */}
          <motion.div 
            className="neopop-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-semibold mb-6 flex items-center">
              <Clock className="text-green-400 mr-2 w-5 h-5" />
              Schedule Your Calls
            </h3>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2">Preferred Call Time</Label>
                <Select value={callTime} onValueChange={setCallTime}>
                  <SelectTrigger className="w-full bg-gray-800 border border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600">
                    <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                    <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                    <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Time Zone</Label>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger className="w-full bg-gray-800 border border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600">
                    <SelectItem value="PST">Pacific (PST/PDT)</SelectItem>
                    <SelectItem value="MST">Mountain (MST/MDT)</SelectItem>
                    <SelectItem value="CST">Central (CST/CDT)</SelectItem>
                    <SelectItem value="EST">Eastern (EST/EDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Call Frequency</Label>
                <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" className="border-blue-500 text-blue-500" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekdays" id="weekdays" className="border-blue-500 text-blue-500" />
                    <Label htmlFor="weekdays">Weekdays only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" className="border-blue-500 text-blue-500" />
                    <Label htmlFor="custom">Custom schedule</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Phone Verification */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="font-semibold mb-4 flex items-center">
            <Shield className="text-green-400 mr-2 w-5 h-5" />
            Phone Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2">Phone Number</Label>
              <div className="flex">
                <Select defaultValue="+1">
                  <SelectTrigger className="w-20 bg-gray-800 border border-gray-600 border-r-0 rounded-r-none text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600">
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+33">+33</SelectItem>
                    <SelectItem value="+49">+49</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-l-none text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium">
                Send Verification Code
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={navigateToFinalSetup}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Complete Setup
            <motion.span
              className="ml-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✓
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
