import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Eye, Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import { initiateGoogleLogin } from "@/lib/auth";

interface WorkflowHistory {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  generatedCode: string | null;
}

export default function History() {
  // Check if user is authenticated by trying to fetch profile
  const { data: user } = useQuery({
    queryKey: ['/api/auth/profile'],
    queryFn: async () => {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) return null;
      return response.json();
    },
    retry: false,
  });

  const { data: workflows = [], isLoading, error } = useQuery<WorkflowHistory[]>({
    queryKey: ['/api/workflows'],
    enabled: !!user, // Only fetch workflows if user is authenticated
    retry: false,
  });

  // Show sign-up prompt for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflow Builder
              </Button>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Workflows
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up to save and manage your automation workflows
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Create an Account to Save Workflows
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Keep track of your automation workflows, view execution history, and access them from any device.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => initiateGoogleLogin()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up to Save Workflows
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => initiateGoogleLogin()}
                    className="w-full"
                  >
                    Already have an account? Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workflow Builder
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Workflows
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your automation workflows
          </p>
        </div>

        {error || !workflows || (Array.isArray(workflows) && workflows.length === 0) ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No workflows found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first workflow to see it here
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(workflows) && workflows.map((workflow: WorkflowHistory) => (
              <Card key={workflow.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200 border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workflow.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {workflow.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={workflow.status === 'completed' ? 'default' : 'secondary'}
                      className={`ml-2 ${
                        workflow.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => console.log('View workflow', workflow.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => console.log('Run workflow', workflow.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      {workflow.generatedCode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Download code', workflow.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}