import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { handleOAuthCallback } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { isLoading } = useAuth();

  useEffect(() => {
    const token = handleOAuthCallback();
    
    if (token) {
      // Successful authentication - redirect to main app
      setLocation('/');
    } else {
      // Failed authentication - redirect to login with error
      setLocation('/login?error=authentication_failed');
    }
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}