import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Clock, 
  Volume2, 
  MessageSquare,
  Settings,
  Play,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '@/components/sidebar';

export default function CallConfig() {
  const [config, setConfig] = useState({
    phoneNumber: '',
    callTime: '09:00',
    voiceType: 'professional',
    enableWhatsApp: true,
    customScript: '',
    callFrequency: 'daily'
  });

  const handleSave = () => {
    // Save configuration
    console.log('Saving config:', config);
  };

  const handleTestCall = () => {
    // Test voice call
    console.log('Testing call with config:', config);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Voice Call Configuration</h1>
              <p className="text-slate-600 mt-1">
                Set up AI-powered voice summaries and WhatsApp notifications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleTestCall}>
                <Play className="w-4 h-4 mr-2" />
                Test Call
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phone Configuration */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={config.phoneNumber}
                    onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="callTime">Preferred Call Time</Label>
                  <Input
                    id="callTime"
                    type="time"
                    value={config.callTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, callTime: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="callFrequency">Call Frequency</Label>
                  <Select value={config.callFrequency} onValueChange={(value) => setConfig(prev => ({ ...prev, callFrequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="urgent-only">Urgent Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Voice Configuration */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="voiceType">Voice Type</Label>
                  <Select value={config.voiceType} onValueChange={(value) => setConfig(prev => ({ ...prev, voiceType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>WhatsApp Notifications</Label>
                    <p className="text-sm text-slate-600">Send summary via WhatsApp</p>
                  </div>
                  <Switch
                    checked={config.enableWhatsApp}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableWhatsApp: checked }))}
                  />
                </div>

                <Button variant="outline" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Preview Voice Sample
                </Button>
              </CardContent>
            </Card>

            {/* Custom Script */}
            <Card className="bg-white border-slate-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Custom Script (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="customScript">Custom Introduction Script</Label>
                  <Textarea
                    id="customScript"
                    placeholder="Add a custom introduction or specific instructions for your AI voice calls..."
                    value={config.customScript}
                    onChange={(e) => setConfig(prev => ({ ...prev, customScript: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}