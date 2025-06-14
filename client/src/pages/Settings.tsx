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

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const { clearWorkspace } = useWorkspacePersistence();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      setIsLoggingOut(true);
      try {
        logout();
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
              <ProfileManagement />
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
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-blue-50 dark:bg-gray-900 h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
            <div className="text-center space-y-6 sm:space-y-8 mb-12">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight px-2">
                  Settings
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                  Configure your Cue experience and manage your account
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link href="/">
                  <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium">
                    Back to Workflow
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
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
                    Unable to load profile information. Please try refreshing the page.
                  </AlertDescription>
                </Alert>
              )}

              {/* Preferences */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <SettingsIcon className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-gray-900 dark:text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Receive updates about your workflows
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-gray-900 dark:text-white">Auto-save Workflows</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Automatically save your progress
                      </p>
                    </div>
                    <Switch
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-gray-900 dark:text-white">Dark Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Toggle dark theme
                      </p>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Download className="h-5 w-5 mr-2" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Export Workflows</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Download all your workflows as JSON
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg border-gray-200 dark:border-gray-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400">Clear Workspace Data</h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Permanently delete all saved workflows and workspace data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleClearData} className="rounded-lg">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">About Cue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">Version</span>
                    <Badge variant="secondary" className="rounded-full">1.0.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">Documentation</span>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Docs
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">Support</span>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="bg-blue-50 dark:bg-gray-900 absolute bottom-0 left-0 right-0 pb-2">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 h-8">
                  <span className="text-center sm:text-left">© 2025 Cue</span>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs">
                    <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Privacy</span>
                    <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Terms</span>
                    <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}