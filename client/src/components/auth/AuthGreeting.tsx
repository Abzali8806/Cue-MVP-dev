import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function AuthGreeting() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const wasAuthenticatedRef = useRef(false);
  const hasShownGreetingRef = useRef(false);

  useEffect(() => {
    // Check if user just signed in (was not authenticated, now is)
    if (!isLoading && isAuthenticated && user && !wasAuthenticatedRef.current && !hasShownGreetingRef.current) {
      const displayName = user.firstName || user.email?.split('@')[0] || 'there';
      const provider = user.provider === 'google' ? 'Google' : 'GitHub';
      
      toast({
        title: `Welcome, ${displayName}!`,
        description: `Successfully signed in with ${provider}. Your workflows from this session have been saved to your account.`,
        duration: 5000,
      });
      
      hasShownGreetingRef.current = true;
    }
    
    // Update previous authentication state
    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, isLoading, user, toast]);

  // Reset greeting flag when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      hasShownGreetingRef.current = false;
    }
  }, [isAuthenticated, isLoading]);

  return null; // This component doesn't render anything
}