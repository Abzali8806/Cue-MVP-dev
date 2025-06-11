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
import { useWorkflowGeneration } from "../hooks/useWorkflowGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Workflow, Code, Settings, Rocket } from "lucide-react";

export default function WorkflowBuilder() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string } | null>(null);
  const [activeTab, setActiveTab] = useState("input");
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
  const { createSampleWorkflow } = useWorkflowGeneration();

  // Initialize with sample workflow for demonstration
  useEffect(() => {
    if (workflowState.description === "") {
      createSampleWorkflow();
    }
  }, [createSampleWorkflow, workflowState.description]);

  const openHelpModal = (title: string, content: string) => {
    setHelpContent({ title, content });
    setHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setHelpModalOpen(false);
    setHelpContent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen} />
      
      <div className="flex">
        {/* Sidebar - Auto-open on desktop */}
        <div className={`${isSidebarOpen || isDesktopLayout ? 'block' : 'hidden'}`}>
          <Sidebar isOpen={isSidebarOpen || isDesktopLayout} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && !isDesktopLayout && (
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">
            {/* Desktop Layout: Split panels */}
            {isDesktopLayout ? (
              <div className="h-full flex">
                {/* Left Panel: Input & Credentials */}
                <div className="w-2/5 bg-surface border-r border-border flex flex-col">
                  <div className="border-b border-border bg-surface">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab("input")}
                        className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 border-b-2 transition-colors ${
                          activeTab === "input" 
                            ? "border-primary bg-background text-primary" 
                            : "border-transparent hover:bg-muted/50"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Input</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("credentials")}
                        className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 border-b-2 transition-colors ${
                          activeTab === "credentials" 
                            ? "border-primary bg-background text-primary" 
                            : "border-transparent hover:bg-muted/50"
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Credentials</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {activeTab === "input" && <WorkflowInput />}
                    {activeTab === "credentials" && <CredentialManagement onOpenHelp={openHelpModal} />}
                  </div>
                </div>

                {/* Right Panel: Visualization, Code & Deploy */}
                <div className="flex-1 flex flex-col">
                  <div className="border-b border-border bg-surface">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab("visualization")}
                        className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 border-b-2 transition-colors ${
                          activeTab === "visualization" 
                            ? "border-primary bg-background text-primary" 
                            : "border-transparent hover:bg-muted/50"
                        }`}
                      >
                        <Workflow className="h-4 w-4" />
                        <span className="text-sm font-medium">Visualization</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("code")}
                        className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 border-b-2 transition-colors ${
                          activeTab === "code" 
                            ? "border-primary bg-background text-primary" 
                            : "border-transparent hover:bg-muted/50"
                        }`}
                      >
                        <Code className="h-4 w-4" />
                        <span className="text-sm font-medium">Code</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("deploy")}
                        className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 border-b-2 transition-colors ${
                          activeTab === "deploy" 
                            ? "border-primary bg-background text-primary" 
                            : "border-transparent hover:bg-muted/50"
                        }`}
                      >
                        <Rocket className="h-4 w-4" />
                        <span className="text-sm font-medium">Deploy</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {activeTab === "visualization" && (
                      <div className="h-full w-full">
                        <WorkflowVisualization />
                      </div>
                    )}
                    {activeTab === "code" && (
                      <div className="h-full overflow-auto">
                        <CodePreview />
                      </div>
                    )}
                    {activeTab === "deploy" && (
                      <div className="h-full overflow-auto">
                        <DeploymentInstructions />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Layout: Single tabbed view */
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b border-border bg-surface">
                  <div className="overflow-x-auto">
                    <TabsList className="h-12 w-full min-w-max justify-start rounded-none bg-transparent p-0">
                      <TabsTrigger 
                        value="input" 
                        className="flex items-center gap-1.5 h-12 px-3 sm:px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                      >
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Input</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="visualization" 
                        className="flex items-center gap-1.5 h-12 px-3 sm:px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                      >
                        <Workflow className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Visual</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="code" 
                        className="flex items-center gap-1.5 h-12 px-3 sm:px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                      >
                        <Code className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Code</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="credentials" 
                        className="flex items-center gap-1.5 h-12 px-3 sm:px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                      >
                        <Settings className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Auth</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="deploy" 
                        className="flex items-center gap-1.5 h-12 px-3 sm:px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                      >
                        <Rocket className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Deploy</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="input" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className="flex-1 overflow-auto">
                      <WorkflowInput />
                    </div>
                  </TabsContent>

                  <TabsContent value="visualization" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className="flex-1 w-full min-h-0">
                      <WorkflowVisualization />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className="flex-1 overflow-auto">
                      <CodePreview />
                    </div>
                  </TabsContent>

                  <TabsContent value="credentials" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className="flex-1 overflow-auto">
                      <CredentialManagement onOpenHelp={openHelpModal} />
                    </div>
                  </TabsContent>

                  <TabsContent value="deploy" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                    <div className="flex-1 overflow-auto">
                      <DeploymentInstructions />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )}
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
