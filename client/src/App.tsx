import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import PublicLanding from "@/pages/public-landing";
import Dashboard from "@/pages/dashboard";
import GuidedApp from "@/pages/guided-app";
import EmailScanning from "@/pages/email-scanning";
import PhoneVerification from "@/pages/phone-verification";
import CallConfig from "@/pages/call-config";
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
      <Route path="/demo" component={PublicLanding} />
      
      {/* Default to public landing page */}
      <Route path="/" component={PublicLanding} />
      
      {/* Protected routes with authentication check */}
      <Route path="/dashboard" component={AuthenticatedRoute} />
      <Route path="/scanning" component={AuthenticatedRoute} />
      <Route path="/phone-verification" component={AuthenticatedRoute} />
      <Route path="/call-config" component={AuthenticatedRoute} />
      
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
    return <PublicLanding />;
  }
  
  // Route to specific pages based on path
  const path = window.location.pathname;
  
  switch (path) {
    case '/phone-verification':
      return <PhoneVerification />;
    case '/call-config':
      return <CallConfig />;
    case '/dashboard':
      return <Dashboard />;
    case '/scanning':
      return <EmailScanning />;
    default:
      // Always show the guided onboarding flow for all users
      return <GuidedApp />;
  }
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
