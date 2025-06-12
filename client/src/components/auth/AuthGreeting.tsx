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
      // Try different approaches to get the user's name
      let displayName = 'there';
      
      if (user.firstName) {
        displayName = user.firstName;
      } else if (user.email) {
        // Extract name from email (before @)
        displayName = user.email.split('@')[0];
        // Capitalize first letter if it's all lowercase
        if (displayName === displayName.toLowerCase()) {
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        }
      }
      
      const provider = user.provider === 'google' ? 'Google' : 
                      user.provider === 'github' ? 'GitHub' : 
                      user.provider;
      
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