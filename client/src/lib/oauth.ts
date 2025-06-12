// OAuth configuration with real credentials only
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

export const isOAuthConfigured = () => {
  return !!(GOOGLE_CLIENT_ID || GITHUB_CLIENT_ID);
};

export const getGoogleOAuthUrl = () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google OAuth not configured');
  }
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline'
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const getGitHubOAuthUrl = () => {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GitHub OAuth not configured');
  }
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'user:email'
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};