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
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Workflow Generator</h1>
                  <p className="text-muted-foreground mt-2">
                    Create automated workflows with natural language
                  </p>
                </div>
                <PersonalizedGreeting />
              </div>
            </div>

            {/* Workflow Sections */}
            <div className="space-y-8">
              
              {/* Workflow Input Section */}
              <section className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                <div className="border-b border-border bg-muted/20 px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-primary" />
                    <h2 className="text-lg font-semibold">Workflow Input</h2>
                    <span className="ml-3 text-sm text-muted-foreground">
                      Describe your workflow in natural language
                    </span>
                  </div>
                </div>
                <div className="p-0">
                  <WorkflowInput />
                </div>
              </section>

              {/* Workflow Visualization Section */}
              <section className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                <div className="border-b border-border bg-muted/20 px-6 py-4">
                  <div className="flex items-center">
                    <Workflow className="h-5 w-5 mr-3 text-primary" />
                    <h2 className="text-lg font-semibold">Workflow Visualization</h2>
                    <span className="ml-3 text-sm text-muted-foreground">
                      Interactive node-based workflow display
                    </span>
                  </div>
                </div>
                <div className="h-96 lg:h-[500px]">
                  <WorkflowVisualization />
                </div>
              </section>

              {/* Two Column Layout for Code and Credentials */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Code Preview */}
                <section className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                  <div className="border-b border-border bg-muted/20 px-6 py-4">
                    <div className="flex items-center">
                      <Code className="h-5 w-5 mr-3 text-primary" />
                      <h2 className="text-lg font-semibold">Generated Code</h2>
                      <span className="ml-3 text-sm text-muted-foreground">
                        Preview and download
                      </span>
                    </div>
                  </div>
                  <div className="h-80 overflow-auto">
                    <CodePreview />
                  </div>
                </section>

                {/* Credentials Management */}
                <section className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                  <div className="border-b border-border bg-muted/20 px-6 py-4">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-3 text-primary" />
                      <h2 className="text-lg font-semibold">Credentials</h2>
                      <span className="ml-3 text-sm text-muted-foreground">
                        Configure API keys and tokens
                      </span>
                    </div>
                  </div>
                  <div className="h-80 overflow-auto">
                    <CredentialManagement onOpenHelp={openHelpModal} />
                  </div>
                </section>

              </div>

              {/* Deployment Instructions */}
              <section className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                <div className="border-b border-border bg-muted/20 px-6 py-4">
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 mr-3 text-primary" />
                    <h2 className="text-lg font-semibold">AWS Deployment</h2>
                    <span className="ml-3 text-sm text-muted-foreground">
                      Step-by-step deployment guide
                    </span>
                  </div>
                </div>
                <div className="h-96 overflow-auto">
                  <DeploymentInstructions />
                </div>
              </section>

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