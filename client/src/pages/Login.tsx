import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useTheme } from "../lib/theme";
import { getOAuthUrl } from "@/lib/auth";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setError("");
    
    try {
      window.location.href = getOAuthUrl('google');
    } catch (err) {
      setError("Failed to initiate Google authentication");
      setIsLoading(null);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading("github");
    setError("");
    
    try {
      window.location.href = getOAuthUrl('github');
    } catch (err) {
      setError("Failed to initiate GitHub authentication");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Header matching main page */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
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
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                Settings
              </Link>
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
              <div className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                Sign in to get started
              </div>
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
                  Welcome to Cue
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                  Sign in to start automating your workflows with natural language
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link href="/">
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Cue</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-xl">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Choose your preferred authentication method
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-lg">
                      <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Google OAuth Button */}
                  <Button 
                    onClick={handleGoogleLogin}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white rounded-xl"
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
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl"
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
                </CardContent>
              </Card>
            </div>


          </div>
        </div>
      </main>
    </div>
  );
}