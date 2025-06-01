import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import EmailScanning from "@/pages/email-scanning";
import EmailScan from "@/pages/email-scan";
import EmailDashboard from "@/pages/email-dashboard";
import EmailDiscovery from "@/pages/email-discovery";
import Personalization from "@/pages/personalization";
import CallConfig from "@/pages/call-config";
import FinalSetup from "@/pages/final-setup";
import Privacy from "@/pages/privacy";
import Security from "@/pages/security";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
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

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={EmailDiscovery} />
          <Route path="/scanning" component={EmailScanning} />
          <Route path="/email-scan" component={EmailScan} />
          <Route path="/discovery" component={EmailDiscovery} />
          <Route path="/dashboard" component={EmailDashboard} />
          <Route path="/personalization" component={Personalization} />
          <Route path="/call-config" component={CallConfig} />
          <Route path="/final-setup" component={FinalSetup} />
        </>
      )}
      <Route path="/privacy" component={Privacy} />
      <Route path="/security" component={Security} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
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
