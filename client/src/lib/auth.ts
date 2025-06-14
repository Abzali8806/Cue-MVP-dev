// OAuth configuration for FastAPI backend integration
export const authConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'user:email',
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
};

// OAuth provider URLs for FastAPI backend
export const getOAuthUrl = (provider: 'google' | 'github'): string => {
  return `${authConfig.apiBaseUrl}/auth/${provider}`;
};

// Handle OAuth callback from FastAPI
export const handleOAuthCallback = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  if (error) {
    console.error('OAuth error:', error);
    return null;
  }
  
  if (token) {
    localStorage.setItem('authToken', token);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }
  
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// Get stored auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Clear authentication
export const clearAuth = (): void => {
  localStorage.removeItem('authToken');
};