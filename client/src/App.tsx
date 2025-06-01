import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import SimpleLanding from "@/pages/simple-landing";
import Dashboard from "@/pages/dashboard";
import GuidedApp from "@/pages/guided-app";
import EmailScanning from "@/pages/email-scanning";
import TestCall from "@/pages/test-call";
import GmailConnect from "@/pages/gmail-connect";
import PhoneVerify from "@/pages/phone-verify";
import EmailDashboard from "@/pages/email-dashboard";
import CalendarSettings from "@/pages/calendar-settings";
import Privacy from "@/pages/privacy";
import Security from "@/pages/security";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes - no authentication required */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/security" component={Security} />
      <Route path="/support" component={Support} />
      <Route path="/demo" component={SimpleLanding} />
      
      {/* Default to public landing page */}
      <Route path="/" component={SimpleLanding} />
      
      {/* Protected routes with authentication check */}
      <Route path="/dashboard" component={AuthenticatedRoute} />
      <Route path="/scanning" component={AuthenticatedRoute} />
      <Route path="/test-call" component={AuthenticatedRoute} />
      <Route path="/gmail-connect" component={AuthenticatedRoute} />
      <Route path="/phone-verify" component={AuthenticatedRoute} />
      <Route path="/email-dashboard" component={AuthenticatedRoute} />
      <Route path="/calendar-settings" component={AuthenticatedRoute} />
      <Route path="/full-dashboard" component={AuthenticatedRoute} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    window.location.href = '/api/login';
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  // Check current path to render appropriate component
  const currentPath = window.location.pathname;
  
  if (currentPath === '/test-call') {
    return <TestCall />;
  }
  
  if (currentPath === '/dashboard') {
    return <GuidedApp />;
  }
  
  if (currentPath === '/scanning') {
    return <EmailScanning />;
  }
  
  if (currentPath === '/gmail-connect') {
    return <GmailConnect />;
  }
  
  if (currentPath === '/phone-verify') {
    return <PhoneVerify />;
  }
  
  if (currentPath === '/email-dashboard') {
    return <EmailDashboard />;
  }
  
  if (currentPath === '/calendar-settings') {
    return <CalendarSettings />;
  }
  
  if (currentPath === '/full-dashboard') {
    return <Dashboard />;
  }
  
  return <GuidedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
