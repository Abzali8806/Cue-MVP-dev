import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [error, setError] = useState("");

  const handleLogin = () => {
    // TODO: Integrate with your FastAPI backend authentication
    // Replace this with actual authentication logic when FastAPI backend is ready
    setError("Authentication will be handled by your FastAPI backend. Integration pending.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to App Link */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cue
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in to Cue</CardTitle>
            <CardDescription className="text-center">
              Authentication will be available when connected to FastAPI backend
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleLogin}
              className="w-full h-12"
              disabled
            >
              Sign In (Backend Integration Required)
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-6">
              Authentication will be handled by your separate FastAPI backend
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}