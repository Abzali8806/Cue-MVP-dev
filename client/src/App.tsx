import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/theme";

import WorkflowGenerator from "@/pages/WorkflowBuilder";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Registration from "@/pages/Registration";
import Profile from "@/pages/Profile";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WorkflowGenerator} />
      <Route path="/signup" component={SignUp} />
      <Route path="/onboarding" component={Registration} />
      <Route path="/login" component={Login} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
