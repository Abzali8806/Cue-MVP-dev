// FastAPI OAuth integration
export const authConfig = {
  fastApiBaseUrl: import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8000'
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
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    
    if (token && userData) {
      // Parse user data received from FastAPI OAuth callback
      const user = JSON.parse(decodeURIComponent(userData));
      
      // Send to our Express backend to create session
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      }
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
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};