import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/theme";
import { useAuth } from "@/hooks/useAuth";
import WorkflowBuilder from "@/pages/WorkflowBuilder";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <>
          <Route path="/" component={WorkflowBuilder} />
          <Route path="/history" component={History} />
          <Route path="/settings" component={Settings} />
          <Route path="/login" component={() => { window.location.href = '/'; return null; }} />
          <Route path="/signup" component={() => { window.location.href = '/'; return null; }} />
        </>
      ) : (
        <>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={() => { window.location.href = '/login'; return null; }} />
        </>
      )}
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
