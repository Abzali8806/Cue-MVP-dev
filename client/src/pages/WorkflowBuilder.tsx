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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AppHeader 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobileMenuOpen={isSidebarOpen}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 border-b">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 max-w-2xl">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Build Workflows with
                    <span className="text-blue-600 dark:text-blue-400"> Natural Language</span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Transform your ideas into automated workflows. Simply describe what you want, and watch it come to life.
                  </p>
                </div>
                <div className="flex-shrink-0 lg:ml-12">
                  <PersonalizedGreeting />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12">
            
            {/* Main Workflow Input */}
            <div className="mb-16">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
                  <div className="flex items-center text-white">
                    <FileText className="h-6 w-6 mr-3" />
                    <h2 className="text-2xl font-semibold">Describe Your Workflow</h2>
                  </div>
                  <p className="text-blue-100 mt-2">Tell us what you want to automate in plain English</p>
                </div>
                <WorkflowInput />
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="mb-16">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
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
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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