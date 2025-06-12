// OAuth configuration - connects to FastAPI backend
export const getGoogleOAuthUrl = () => {
  // In production, this will redirect to your FastAPI backend OAuth endpoint
  // which handles the actual Google OAuth flow with real credentials
  return '/auth/google'; // FastAPI backend endpoint
};

export const getGitHubOAuthUrl = () => {
  // In production, this will redirect to your FastAPI backend OAuth endpoint  
  // which handles the actual GitHub OAuth flow with real credentials
  return '/auth/github'; // FastAPI backend endpoint
};