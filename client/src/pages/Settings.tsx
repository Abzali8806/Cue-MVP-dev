import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Shield, 
  LogOut,
  ExternalLink,
  Settings as SettingsIcon,
  Download,
  Trash2,
  Sun,
  Moon
} from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "../lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspacePersistence } from "@/hooks/useWorkspacePersistence";
import ProfileManagement from "@/components/auth/ProfileManagement";
import AuthGreeting from "@/components/auth/AuthGreeting";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading } = useAuth();
  const { clearWorkspace } = useWorkspacePersistence();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      setIsLoggingOut(true);
      try {
        window.location.href = "/api/logout";
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to clear all workspace data? This action cannot be undone.")) {
      clearWorkspace();
      alert("All workspace data has been cleared.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Header matching main page */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/?tab=input" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm sm:text-base">C</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cue</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                Workflow Generator
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                My Workflows
              </Link>
              <span className="text-blue-600 font-medium px-2 py-1 rounded">
                Settings
              </span>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <AuthGreeting />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-blue-50 dark:bg-gray-900 min-h-[calc(100vh-7rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="space-y-6 sm:space-y-8 mb-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Configure your Cue experience and manage your account
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Management */}
            {user ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <ProfileManagement />
                </div>
                
                {/* Account Actions */}
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Sign Out</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Sign out of your account
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-2 rounded-lg border-gray-200 dark:border-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert className="bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 rounded-xl">
                <AlertDescription className="text-gray-900 dark:text-white">
                  Please sign in to access profile settings.
                </AlertDescription>
              </Alert>
            )}

            {/* Application Settings */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <SettingsIcon className="h-5 w-5" />
                  Application Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive notifications about workflow updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                {/* Auto Save */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto Save</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Automatically save your work as you type
                    </p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">Clear All Data</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Remove all saved workflows and settings
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleClearData}
                    className="flex items-center space-x-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-500">© 2025 Cue</span>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}