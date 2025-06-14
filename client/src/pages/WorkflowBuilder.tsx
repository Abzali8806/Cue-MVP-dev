import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "wouter";
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
  const [activeTab, setActiveTab] = useState<'input' | 'workflow'>('input');

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

  // Automatically switch to workflow tab when workflow is generated
  useEffect(() => {
    if (workflowState.generatedCode && activeTab === 'input') {
      setActiveTab('workflow');
    }
  }, [workflowState.generatedCode, activeTab]);

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm sm:text-base">C</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cue</h1>
                </Link>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-blue-600 font-medium hover:text-blue-700 transition-colors px-2 py-1 rounded">
                  Workflow Generator
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  My Workflows
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  Settings
                </Link>
                
                {/* Inline Tab Pills */}
                <div className="ml-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab('input')}
                      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${
                        activeTab === 'input'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                      }`}
                    >
                      <FileText className="h-3 w-3 mr-1.5 inline" />
                      Input
                    </button>
                    <button
                      onClick={() => setActiveTab('workflow')}
                      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full ${
                        activeTab === 'workflow'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                      }`}
                    >
                      <Workflow className="h-3 w-3 mr-1.5 inline" />
                      Workflow
                    </button>
                  </div>
                </div>
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
        
        <main className="flex-1 bg-blue-50 dark:bg-gray-900 flex flex-col">
          {/* Tab Content */}
          {activeTab === 'input' ? (
            /* Main Content - Centered */
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
                <div className="text-center space-y-6 sm:space-y-8">
                  {/* Hero Headlines */}
                  <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight px-2">
                      Speak It. Build It. Deploy It.
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                      Effortless workflow automation from prompt to deployment with <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cue</span>
                    </p>
                  </div>
                  
                  {/* Feature highlights */}
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="hidden sm:inline">Speech-to-text input</span>
                      <span className="sm:hidden">Speech input</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="hidden sm:inline">Visual workflow generator</span>
                      <span className="sm:hidden">Visual workflows</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="hidden sm:inline">One-click deployment</span>
                      <span className="sm:hidden">Easy deploy</span>
                    </span>
                  </div>
                  
                  {/* Workflow Input */}
                  <div className="max-w-4xl mx-auto pt-4 sm:pt-6 px-2 sm:px-0">
                    <WorkflowInput />
                  </div>
                  
                  {/* Personalized Greeting */}
                  <div className="pt-2">
                    <PersonalizedGreeting />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Workflow Components View */
            <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
              <Tabs defaultValue="visualization" className="h-full flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                  <TabsList className="grid w-full max-w-2xl grid-cols-4 min-w-max">
                    <TabsTrigger value="visualization" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Network className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Workflow</span>
                      <span className="sm:hidden">Flow</span>
                    </TabsTrigger>
                    <TabsTrigger value="code" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Code className="h-3 w-3 sm:h-4 sm:w-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="credentials" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Credentials</span>
                      <span className="sm:hidden">Creds</span>
                    </TabsTrigger>
                    <TabsTrigger value="deployment" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
                      Deploy
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto">
                  <TabsContent value="visualization" className="p-4 sm:p-6 h-full m-0">
                    <WorkflowVisualization />
                  </TabsContent>

                  <TabsContent value="code" className="p-4 sm:p-6 h-full m-0">
                    <CodePreview />
                  </TabsContent>

                  <TabsContent value="credentials" className="p-4 sm:p-6 h-full m-0">
                    <CredentialManagement onOpenHelp={openHelpModal} />
                  </TabsContent>

                  <TabsContent value="deployment" className="p-4 sm:p-6 h-full m-0">
                    <DeploymentInstructions />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

        </main>





        {/* Help Modal */}
        <HelpModal
          isOpen={helpModalOpen}
          onClose={closeHelpModal}
          title={helpContent?.title || ""}
          content={helpContent?.content || ""}
        />
      </div>
    </div>
  );
}