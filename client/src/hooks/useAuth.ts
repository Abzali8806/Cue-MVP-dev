import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  displayName?: string;
  provider?: 'google' | 'github';
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
} {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Query to check current authentication status
  // Disabled until backend is ready to prevent fetch errors
  const { data: authData, isLoading: isCheckingAuth } = useQuery<AuthResponse>({
    queryKey: ['/api/auth/me'],
    enabled: false, // Disabled until FastAPI backend is connected
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem('authToken');
      window.location.href = '/';
    },
  });

  // Initialize auth check on mount
  useEffect(() => {
    // Check for auth token or OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // OAuth callback - store token and redirect
      localStorage.setItem('authToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsInitialized(true);
    } else {
      // Normal auth check
      setIsInitialized(true);
    }
  }, []);

  // Set up axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Token will be handled by the apiRequest function in queryClient
    }
  }, [authData]);

  const user = authData?.user || null;
  const isLoading = !isInitialized || isCheckingAuth || logoutMutation.isPending;
  const isAuthenticated = !!user;

  const login = () => {
    // Redirect to FastAPI OAuth endpoints will be handled by Login page
    console.log("OAuth login initiated");
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}