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
import { FileText, Workflow, Code, Settings, Rocket } from "lucide-react";

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
        {/* Modern Header */}
        <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Cue</h1>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors px-3 py-2 rounded-lg">
                  Workflow Generator
                </a>
                <a href="/history" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  My Workflows
                </a>
                <a href="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  Settings
                </a>
              </nav>

              <div className="flex items-center space-x-3">
                <button 
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                  title="Toggle theme"
                >
                  <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                <a 
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
          {/* Enhanced Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="text-center mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Speak It. Build It. Deploy It.
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-6 leading-relaxed">
                  Effortless workflow automation from prompt to deployment with <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cue</span>
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 text-base text-gray-600 dark:text-gray-400 mb-8">
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
                
                {/* Workflow Input integrated into hero */}
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                      <div className="flex items-center justify-center text-white mb-1">
                        <FileText className="h-6 w-6 mr-3" />
                        <h2 className="text-xl font-semibold">Describe Your Workflow</h2>
                      </div>
                      <p className="text-blue-100 text-center">Tell us what you want to automate in plain English</p>
                    </div>
                    <div className="p-6">
                      <WorkflowInput />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <PersonalizedGreeting />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Workflow Visualization */}
            <div className="mb-16">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                  <div className="flex items-center text-white">
                    <Workflow className="h-6 w-6 mr-3" />
                    <h2 className="text-2xl font-semibold">Visual Workflow</h2>
                  </div>
                  <p className="text-emerald-100 mt-2">Interactive diagram of your automated workflow</p>
                </div>
                <div className="h-[600px]">
                  <WorkflowVisualization />
                </div>
              </div>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              
              {/* Generated Code */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6">
                    <div className="flex items-center text-white">
                      <Code className="h-6 w-6 mr-3" />
                      <h2 className="text-2xl font-semibold">Generated Code</h2>
                    </div>
                    <p className="text-purple-100 mt-2">Ready-to-deploy Python code for your workflow</p>
                  </div>
                  <div className="h-96 overflow-auto">
                    <CodePreview />
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-6">
                    <div className="flex items-center text-white">
                      <Settings className="h-5 w-5 mr-3" />
                      <h2 className="text-xl font-semibold">Credentials</h2>
                    </div>
                    <p className="text-orange-100 mt-2 text-sm">API keys & tokens</p>
                  </div>
                  <div className="h-96 overflow-auto">
                    <CredentialManagement onOpenHelp={openHelpModal} />
                  </div>
                </div>
              </div>

            </div>

            {/* Deployment Section */}
            <div className="mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                  <div className="flex items-center text-white">
                    <Rocket className="h-6 w-6 mr-3" />
                    <h2 className="text-2xl font-semibold">Deploy to AWS</h2>
                  </div>
                  <p className="text-green-100 mt-2">Step-by-step guide to get your workflow running in the cloud</p>
                </div>
                <div className="h-96 overflow-auto">
                  <DeploymentInstructions />
                </div>
              </div>
            </div>

          </div>
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