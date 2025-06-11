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
      setIsDesktopLayout(window.innerWidth >= 1280); // Wider threshold for desktop layout
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
        {/* Sidebar - Always visible on large screens, overlay on smaller screens */}
        {isDesktopLayout ? (
          <div className="w-64 flex-shrink-0">
            <Sidebar isOpen={true} onToggle={() => {}} />
          </div>
        ) : (
          <>
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div 
                  className="fixed inset-0 bg-black/50" 
                  onClick={() => setIsSidebarOpen(false)}
                />
                <div className="relative">
                  <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                </div>
              </div>
            )}
          </>
        )}
        
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">
            {/* Large Screen Layout: Professional three-panel dashboard */}
            {isDesktopLayout ? (
              <div className="h-full grid grid-cols-12 gap-0">
                {/* Left Panel: Input & Credentials - 3 columns */}
                <div className="col-span-3 bg-background border-r border-border flex flex-col">
                  <Tabs defaultValue="input" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/20 rounded-none border-b border-border">
                      <TabsTrigger value="input" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Workflow Input
                      </TabsTrigger>
                      <TabsTrigger value="credentials" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Credentials
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="input" className="flex-1 m-0 p-0">
                      <WorkflowInput />
                    </TabsContent>
                    
                    <TabsContent value="credentials" className="flex-1 m-0 p-0">
                      <CredentialManagement onOpenHelp={openHelpModal} />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Center Panel: Visualization - 6 columns */}
                <div className="col-span-6 flex flex-col bg-background">
                  <div className="h-12 bg-muted/20 border-b border-border flex items-center justify-between px-6">
                    <div className="flex items-center">
                      <Workflow className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-semibold text-base">Workflow Visualization</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Interactive node-based workflow builder
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <WorkflowVisualization />
                  </div>
                </div>

                {/* Right Panel: Code & Deploy - 3 columns */}
                <div className="col-span-3 bg-background border-l border-border flex flex-col">
                  <Tabs defaultValue="code" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/20 rounded-none border-b border-border">
                      <TabsTrigger value="code" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">
                        <Code className="h-4 w-4 mr-2" />
                        Generated Code
                      </TabsTrigger>
                      <TabsTrigger value="deploy" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm">
                        <Rocket className="h-4 w-4 mr-2" />
                        Deployment
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="code" className="flex-1 m-0 p-0">
                      <div className="h-full overflow-auto">
                        <CodePreview />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="deploy" className="flex-1 m-0 p-0">
                      <div className="h-full overflow-auto">
                        <DeploymentInstructions />
                      </div>
                    </TabsContent>
                  </Tabs>
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
