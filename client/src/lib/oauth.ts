// OAuth 2.0 Implementation with CSRF Protection
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generate cryptographically secure state parameter for CSRF protection
const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const isOAuthConfigured = (): boolean => {
  return !!(GOOGLE_CLIENT_ID && GITHUB_CLIENT_ID && API_BASE_URL);
};

export const initiateGoogleLogin = (): void => {
  if (!GOOGLE_CLIENT_ID || !API_BASE_URL) {
    throw new Error('Google OAuth not properly configured');
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${API_BASE_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
    state: state
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const initiateGitHubLogin = (): void => {
  if (!GITHUB_CLIENT_ID || !API_BASE_URL) {
    throw new Error('GitHub OAuth not properly configured');
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${API_BASE_URL}/auth/github/callback`,
    response_type: 'code',
    scope: 'user:email',
    state: state
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
};