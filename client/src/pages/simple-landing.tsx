import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Phone, Lock, ArrowRight } from "lucide-react";

export default function SimpleLanding() {
  const handleGetStarted = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop drowning in email chaos. Your AI assistant calls you with what actually matters, 
            filters the noise, and keeps you focused on what's important.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={handleGetStarted}
              className="text-xl px-12 py-6 font-semibold"
              size="lg"
            >
              Start My Setup
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <p className="text-lg text-muted-foreground">
              2-minute setup • No credit card needed
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Categories</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Call Me For This", "Why Did I Sign Up?", "Don't Tell Anyone" - categories that make sense for busy professionals
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Phone className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Daily Voice Calls</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Hey, 3 investor emails need responses and your payment processor is down" - delivered by voice
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No data selling, no surveillance. Your inbox secrets stay between you and your AI concierge
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}