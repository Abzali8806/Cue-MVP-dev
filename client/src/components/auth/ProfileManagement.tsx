import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Save } from "lucide-react";

export default function ProfileManagement() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || user?.firstName || "");
  const [rememberMe, setRememberMe] = useState(user?.rememberMe || false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      displayName: displayName.trim() || undefined,
      rememberMe,
    });
  };

  const hasChanges = 
    displayName !== (user.displayName || user.firstName || "") ||
    rememberMe !== (user.rememberMe || false);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
          />
          <p className="text-xs text-muted-foreground">
            This name will appear in your personalized greeting
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            value={user.email || "Not provided"}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email is managed by your OAuth provider ({user.provider})
          </p>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remember me across sessions
          </Label>
        </div>
        <p className="text-xs text-muted-foreground pl-6">
          Keep me signed in and save my workspace data between visits
        </p>

        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isUpdatingProfile}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isUpdatingProfile ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}