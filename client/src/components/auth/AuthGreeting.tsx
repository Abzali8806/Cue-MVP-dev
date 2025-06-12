import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";

export default function AuthGreeting() {
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">
            {user.displayName || user.firstName || user.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = '/login'}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign in
      </Button>
    </div>
  );
}