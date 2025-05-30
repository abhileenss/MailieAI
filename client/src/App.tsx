import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import EmailScan from "@/pages/email-scan";
import Personalization from "@/pages/personalization";
import CallConfig from "@/pages/call-config";
import FinalSetup from "@/pages/final-setup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/email-scan" component={EmailScan} />
      <Route path="/personalization" component={Personalization} />
      <Route path="/call-config" component={CallConfig} />
      <Route path="/final-setup" component={FinalSetup} />
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
