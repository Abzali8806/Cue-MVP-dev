import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  displayName?: string;
  provider: string;
  providerId: string;
  rememberMe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error, isSuccess } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Show authentication feedback (only once per session)
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');
    if (isSuccess && user && !isLoading && !hasShownWelcome) {
      const typedUser = user as User;
      const name = typedUser.firstName || typedUser.email?.split('@')[0] || 'there';
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${name}`,
        variant: "default",
      });
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [isSuccess, user, isLoading, toast]);

  // Handle OAuth callback success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const authError = urlParams.get('auth_error');

    if (authSuccess === 'true') {
      toast({
        title: "Authentication Successful!",
        description: "You've been successfully signed in.",
        variant: "default",
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }

    if (authError) {
      toast({
        title: "Authentication Failed",
        description: "There was an issue signing you in. Please try again.",
        variant: "destructive",
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, queryClient]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
        variant: "default",
      });
      window.location.href = '/';
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { displayName?: string; rememberMe?: boolean }) => {
      return await apiRequest("PUT", "/api/auth/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    // Clear workspace persistence on logout if not remember me
    const typedUser = user as User;
    if (!typedUser?.rememberMe) {
      localStorage.removeItem('workspaceData');
      sessionStorage.removeItem('workspaceData');
    }
    logoutMutation.mutate();
  };

  const updateProfile = (profileData: { displayName?: string; rememberMe?: boolean }) => {
    updateProfileMutation.mutate(profileData);
  };

  return {
    user: user as User | null,
    isLoading,
    isAuthenticated: !!user && !error,
    logout,
    isLoggingOut: logoutMutation.isPending,
    updateProfile,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}