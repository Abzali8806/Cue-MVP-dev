import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        // Handle OAuth errors
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => setLocation('/login'), 3000);
          return;
        }

        // Validate state parameter for CSRF protection
        const storedState = sessionStorage.getItem('oauth_state');
        if (state && storedState && state !== storedState) {
          setStatus('error');
          setMessage('Invalid state parameter. Possible CSRF attack detected.');
          sessionStorage.removeItem('oauth_state');
          setTimeout(() => setLocation('/login'), 3000);
          return;
        }

        // Validate JWT token
        if (!token) {
          setStatus('error');
          setMessage('No authentication token received.');
          setTimeout(() => setLocation('/login'), 3000);
          return;
        }

        // Store token and update auth state
        localStorage.setItem('accessToken', token);
        sessionStorage.removeItem('oauth_state');
        
        // Decode JWT to get user info (basic client-side parsing)
        const payload = JSON.parse(atob(token.split('.')[1]));
        login(payload);

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to dashboard after successful authentication
        setTimeout(() => setLocation('/'), 1500);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Authentication processing failed. Please try again.');
        setTimeout(() => setLocation('/login'), 3000);
      }
    };

    handleCallback();
  }, [setLocation, login]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getAlertVariant = () => {
    switch (status) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle>
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Welcome to Cue!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant={getAlertVariant()}>
            <AlertDescription className="text-center">
              {message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}