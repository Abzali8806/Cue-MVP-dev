// Simplified auth hook for FastAPI backend integration
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  // TODO: Replace with actual FastAPI backend authentication when available
  // This is a placeholder that always returns unauthenticated state
  const user: User | null = null;
  const isLoading = false;
  const isAuthenticated = false;

  const login = () => {
    // TODO: Implement FastAPI backend login integration
    console.log("Login will be handled by FastAPI backend");
  };

  const logout = () => {
    // TODO: Implement FastAPI backend logout integration
    console.log("Logout will be handled by FastAPI backend");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}