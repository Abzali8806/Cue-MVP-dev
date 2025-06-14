import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Trash2, Eye, Sun, Moon } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "../lib/theme";
import ProfileManagement from "@/components/auth/ProfileManagement";
import AuthGreeting from "@/components/auth/AuthGreeting";

interface WorkflowHistory {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  generatedCode: string | null;
}

export default function History() {
  const { theme, toggleTheme } = useTheme();
  // For now, we'll use empty state until backend is connected
  const workflows: WorkflowHistory[] = [];
  const isLoading = false;

  if (isLoading) {
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
                <span className="text-blue-600 font-medium px-2 py-1 rounded">
                  My Workflows
                </span>
                <Link href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  Settings
                </Link>
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

        <main className="flex-1 bg-blue-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white dark:bg-gray-800 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </main>

      </div>
    );
  }

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
              <span className="text-blue-600 font-medium px-2 py-1 rounded">
                My Workflows
              </span>
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
              <AuthGreeting />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-blue-50 dark:bg-gray-900 min-h-[calc(100vh-7rem)] flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
            <div className="text-center space-y-6 sm:space-y-8 mb-12">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight px-2">
                  My Workflows
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                  View and manage your saved automation workflows
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link href="/">
                  <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium">
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Workflow
                  </Button>
                </Link>
              </div>
            </div>

            {!workflows || workflows.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
                <Clock className="h-16 w-16 mx-auto mb-6 text-gray-400 dark:text-gray-500" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">No workflows yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  Create your first workflow to see it appear here
                </p>
                <Link href="/">
                  <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-gray-900 dark:text-white">{workflow.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {workflow.description}
                          </p>
                        </div>
                        <Badge variant={workflow.status === "completed" ? "default" : "secondary"} className="rounded-full">
                          {workflow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href="/">
                            <Button variant="outline" size="sm" className="rounded-lg border-gray-200 dark:border-gray-700">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}