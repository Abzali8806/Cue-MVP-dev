import { useAuth, type User as UserType } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, User, ChevronDown } from "lucide-react";

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
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Get Started
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => window.location.href = '/login?mode=signin'}
            className="cursor-pointer"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => window.location.href = '/login?mode=signup'}
            className="cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            Sign Up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}