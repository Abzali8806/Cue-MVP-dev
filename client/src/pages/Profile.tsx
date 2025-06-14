import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth, type User } from "@/hooks/useAuth";
import { User as UserIcon, Building2, Briefcase, Target, Calendar } from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center py-12">
            <CardContent>
              <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Please sign in to view your profile</h2>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const typedUser = user as User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {typedUser.profileImageUrl ? (
                    <img
                      src={typedUser.profileImageUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">
                      {typedUser.firstName} {typedUser.lastName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {typedUser.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Company</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {typedUser.companyName || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Role</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {typedUser.role || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Usage Purpose</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {typedUser.usagePurpose || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Member Since</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(typedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Industry & Actions Card */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {typedUser.industry || "Not specified"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-500">© 2025 Cue</span>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}