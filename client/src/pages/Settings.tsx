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
  Trash2
} from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "../lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspacePersistence } from "@/hooks/useWorkspacePersistence";
import ProfileManagement from "@/components/auth/ProfileManagement";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoggingOut } = useAuth();
  const { clearWorkspace } = useWorkspacePersistence();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      logout();
    }
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to clear all workspace data? This action cannot be undone.")) {
      clearWorkspace();
      alert("All workspace data has been cleared.");
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'github':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your Workflow Generator experience
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              Back to Workflow
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Profile Management */}
          {user ? (
            <div className="space-y-6">
              <ProfileManagement />
              
              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sign Out</h4>
                      <p className="text-sm text-muted-foreground">
                        Sign out of your account
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Unable to load profile information. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your workflows
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-save Workflows</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your progress
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Export Workflows</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your workflows as JSON
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                <div>
                  <h4 className="font-medium text-destructive">Clear Workspace Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all saved workflows and workspace data
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearData}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Cue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Version</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Documentation</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Support</span>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}