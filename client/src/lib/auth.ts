// FastAPI OAuth integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authConfig = {
  fastApiBaseUrl: API_BASE_URL
};

// Redirect to FastAPI OAuth endpoints
export const initiateGoogleLogin = (): void => {
  const { fastApiBaseUrl } = authConfig;
  window.location.href = `${fastApiBaseUrl}/auth/google`;
};

export const initiateGithubLogin = (): void => {
  const { fastApiBaseUrl } = authConfig;
  window.location.href = `${fastApiBaseUrl}/auth/github`;
};

// Handle OAuth callback from FastAPI
export const handleOAuthCallback = async (): Promise<boolean> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return false;
    }
    
    if (success === 'true') {
      // FastAPI handles session creation, just clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return false;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Always redirect to home after logout
  window.location.href = '/';
};