import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/theme";
import { useAuth } from "@/hooks/useAuth";

import WorkflowGenerator from "@/pages/WorkflowBuilder";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import Profile from "@/pages/Profile";
import AuthCallback from "@/components/auth/AuthCallback";

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show registration if authenticated but missing profile data
  const needsRegistration = isAuthenticated && user && (!(user as any).firstName || !(user as any).companyName);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (needsRegistration) {
    return <Registration />;
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <>
          <Route path="/" component={WorkflowGenerator} />
          <Route path="/history" component={History} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
        </>
      ) : (
        <Route path="/" component={Login} />
      )}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Registration} />
      <Route path="/auth/callback" component={AuthCallback} />

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
