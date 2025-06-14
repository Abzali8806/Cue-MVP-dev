import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  role: string;
  usagePurpose: string;
  profileImageUrl?: string;
}

export default function Profile() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/profile'],
    queryFn: async () => {
      const response = await apiRequest('/api/auth/profile');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load profile data</p>
            <p className="text-sm text-gray-600 mt-2">Please ensure your FastAPI backend is running</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">
                      {user?.firstName} {user?.lastName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Company</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {user?.companyName || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Role</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {user?.role || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Usage Purpose</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {user?.usagePurpose || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                  {user?.industry || "Not specified"}
                </span>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/register'}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/settings'}
                >
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={() => window.location.href = '/api/auth/logout'}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}