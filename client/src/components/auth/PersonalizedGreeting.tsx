import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Clock } from "lucide-react";

export default function PersonalizedGreeting() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserDisplayName = () => {
    // Use custom display name if set, otherwise fall back to profile name
    if (user.displayName) {
      return user.displayName;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "there";
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 border-2 border-blue-200 dark:border-blue-700">
            <AvatarImage src={user.profileImageUrl} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {getTimeBasedGreeting()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              Welcome back, {getUserDisplayName()}!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ready to create your next workflow automation?
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}