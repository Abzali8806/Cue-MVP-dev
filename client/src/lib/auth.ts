// FastAPI OAuth integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authConfig = {
  fastApiBaseUrl: API_BASE_URL
};

// Redirect to FastAPI OAuth endpoints
export const initiateGoogleLogin = (): void => {
  const { fastApiBaseUrl } = authConfig;
  window.location.href = `${fastApiBaseUrl}/auth/google/login`;
};

export const initiateGithubLogin = (): void => {
  const { fastApiBaseUrl } = authConfig;
  window.location.href = `${fastApiBaseUrl}/auth/github/login`;
};

// Handle OAuth callback from FastAPI
export const handleOAuthCallback = async (): Promise<boolean> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      return false;
    }
    
    if (token) {
      // Store JWT token from FastAPI
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return false;
  }
};

// Get JWT token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const token = getAuthToken();
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Clear token and redirect
  localStorage.removeItem('jwt_token');
  window.location.href = '/';
};