import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setError("");
    
    try {
      // TODO: Replace with actual FastAPI OAuth endpoint
      // This will redirect to your FastAPI backend's Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/google`;
    } catch (err) {
      setError("Failed to initiate Google authentication");
      setIsLoading(null);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading("github");
    setError("");
    
    try {
      // TODO: Replace with actual FastAPI OAuth endpoint
      // This will redirect to your FastAPI backend's GitHub OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/github`;
    } catch (err) {
      setError("Failed to initiate GitHub authentication");
      setIsLoading(null);
    }
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
            <CardTitle className="text-2xl font-bold text-center">Welcome to Cue</CardTitle>
            <CardDescription className="text-center">
              Sign in or create your account with OAuth
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google OAuth Button */}
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
              disabled={isLoading !== null}
              variant="outline"
            >
              {isLoading === "google" ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
                  Sign in with Google
                </>
              )}
            </Button>

            {/* GitHub OAuth Button */}
            <Button 
              onClick={handleGithubLogin}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
              disabled={isLoading !== null}
            >
              {isLoading === "github" ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <FaGithub className="w-5 h-5 mr-3" />
                  Sign in with GitHub
                </>
              )}
            </Button>

            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  OAuth via FastAPI Backend
                </span>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>New users will automatically have an account created.</p>
              <p className="mt-1">Authentication handled securely via FastAPI backend.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}