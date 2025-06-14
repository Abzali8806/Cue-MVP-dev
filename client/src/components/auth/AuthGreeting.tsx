import { useAuth, type User as UserType } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";

export default function AuthGreeting() {
  const { isAuthenticated, user, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isAuthenticated && user) {
    const typedUser = user as UserType;
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="h-3 w-3" />
          <span className="text-sm">
            {typedUser.firstName || typedUser.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm disabled:opacity-50"
        >
          {isLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => window.location.href = '/login'}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex items-center gap-1.5"
      >
        <LogIn className="h-3 w-3" />
        Sign in
      </button>
      <button
        onClick={() => window.location.href = '/signup'}
        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors px-3 py-1.5 rounded text-sm font-medium"
      >
        Sign up
      </button>
    </div>
  );
}