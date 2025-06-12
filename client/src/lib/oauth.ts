// OAuth configuration for production deployment
export const getGoogleOAuthUrl = () => {
  // For production: Connect to your FastAPI backend OAuth endpoint
  return 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_CALLBACK_URL&response_type=code&scope=openid%20email%20profile';
};

export const getGitHubOAuthUrl = () => {
  // For production: Connect to your FastAPI backend OAuth endpoint  
  return 'https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=YOUR_CALLBACK_URL&scope=user:email';
};