import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import AppHeader from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import WorkflowInput from "../components/workflow/WorkflowInput";
import WorkflowVisualization from "../components/workflow/WorkflowVisualization";
import CodePreview from "../components/workflow/CodePreview";
import DeploymentInstructions from "../components/workflow/DeploymentInstructions";
import CredentialManagement from "../components/credentials/CredentialManagement";
import HelpModal from "../components/modals/HelpModal";
import PersonalizedGreeting from "../components/auth/PersonalizedGreeting";
import { useWorkflowGeneration } from "../hooks/useWorkflowGeneration";
import { useAuth } from "../hooks/useAuth";
import { FileText, Workflow, Code, Settings, Rocket, Network, Key, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion } from "framer-motion";

export default function WorkflowGenerator() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string } | null>(null);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  // Detect screen size for layout switching
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktopLayout(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const workflowState = useSelector((state: RootState) => state.workflow);
  const workflowGeneration = useWorkflowGeneration();

  const openHelpModal = (title: string, content: string) => {
    setHelpContent({ title, content });
    setHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setHelpModalOpen(false);
    setHelpContent(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar - Only show on mobile when open */}
      {isSidebarOpen && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      )}
      
      {/* Main Content - Full width */}
      <div className="flex-1 flex flex-col">
        {/* Compact Header */}
        <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cue</h1>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-blue-600 font-medium hover:text-blue-700 transition-colors px-2 py-1 rounded">
                  Workflow Generator
                </a>
                <a href="/history" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  My Workflows
                </a>
                <a href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  Settings
                </a>
              </nav>

              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Toggle theme"
                >
                  <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 718.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                <a 
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium text-sm"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 bg-blue-50 dark:bg-gray-900 h-[calc(100vh-3.5rem)] flex flex-col">
          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto px-6 py-12 w-full">
              <div className="text-center space-y-8">
                {/* Hero Headlines */}
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    Speak It. Build It. Deploy It.
                  </h1>
                  <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Effortless workflow automation from prompt to deployment with <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cue</span>
                  </p>
                </div>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-6 text-base text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Speech-to-text input
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Visual workflow generator
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    One-click deployment
                  </span>
                </div>
                
                {/* Workflow Input */}
                <div className="max-w-4xl mx-auto pt-6">
                  <WorkflowInput />
                </div>
                
                {/* Personalized Greeting */}
                <div className="pt-2">
                  <PersonalizedGreeting />
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Footer - Blends with design */}
          <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
            © 2025 Cue
          </div>

          {/* Workflow Dashboard - Appears as overlay after generation */}
          {workflowState.generatedCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white dark:bg-gray-900 z-50"
            >
              <div className="h-full flex flex-col">
                {/* Dashboard Header */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Dashboard</h1>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Generator
                    </Button>
                  </div>
                </div>

                {/* Dashboard Content with Tabs */}
                <div className="flex-1 overflow-hidden">
                  <Tabs defaultValue="visualization" className="h-full flex flex-col">
                    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-2 border-b border-gray-200 dark:border-gray-700">
                      <TabsList className="grid w-full max-w-2xl grid-cols-4">
                        <TabsTrigger value="visualization" className="flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          Workflow
                        </TabsTrigger>
                        <TabsTrigger value="code" className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Code
                        </TabsTrigger>
                        <TabsTrigger value="credentials" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Credentials
                        </TabsTrigger>
                        <TabsTrigger value="deployment" className="flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Deploy
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <TabsContent value="visualization" className="p-6 h-full m-0">
                        <WorkflowVisualization />
                      </TabsContent>

                      <TabsContent value="code" className="p-6 h-full m-0">
                        <CodePreview />
                      </TabsContent>

                      <TabsContent value="credentials" className="p-6 h-full m-0">
                        <CredentialManagement onOpenHelp={openHelpModal} />
                      </TabsContent>

                      <TabsContent value="deployment" className="p-6 h-full m-0">
                        <DeploymentInstructions />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={closeHelpModal}
        title={helpContent?.title || ""}
        content={helpContent?.content || ""}
      />
    </div>
  );
}