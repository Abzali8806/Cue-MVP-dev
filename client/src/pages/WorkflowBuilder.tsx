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
  const [desktopTab, setDesktopTab] = useState("input");
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
            {/* Large Screen Layout: Two main tabs */}
            {isDesktopLayout ? (
              <Tabs value={desktopTab} onValueChange={setDesktopTab} className="h-full flex flex-col">
                {/* Tab Navigation */}
                <div className="border-b border-border bg-muted/10">
                  <div className="max-w-7xl mx-auto px-6">
                    <TabsList className="h-14 bg-transparent p-0 space-x-8">
                      <TabsTrigger 
                        value="input" 
                        className="h-14 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base font-medium"
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Workflow Input
                      </TabsTrigger>
                      <TabsTrigger 
                        value="dashboard" 
                        className="h-14 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-base font-medium"
                      >
                        <Workflow className="h-5 w-5 mr-3" />
                        Workflow Dashboard
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  {/* Workflow Input Tab */}
                  <TabsContent value="input" className="h-full m-0 p-0">
                    <div className="h-full overflow-auto">
                      <div className="max-w-4xl mx-auto p-6">
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                          <div className="border-b border-border bg-muted/20 px-6 py-4">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-3 text-primary" />
                              <h2 className="text-lg font-semibold">Workflow Input</h2>
                              <span className="ml-3 text-sm text-muted-foreground">Describe your workflow in natural language</span>
                            </div>
                          </div>
                          <div className="p-0">
                            <WorkflowInput />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Workflow Dashboard Tab */}
                  <TabsContent value="dashboard" className="h-full m-0 p-0">
                    <div className="h-full overflow-auto">
                      <div className="max-w-7xl mx-auto p-6 space-y-6">
                        {/* Workflow Visualization Section */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                          <div className="border-b border-border bg-muted/20 px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Workflow className="h-5 w-5 mr-3 text-primary" />
                                <h2 className="text-lg font-semibold">Workflow Visualization</h2>
                                <span className="ml-3 text-sm text-muted-foreground">Interactive node-based workflow builder</span>
                              </div>
                            </div>
                          </div>
                          <div className="h-96 lg:h-[500px]">
                            <WorkflowVisualization />
                          </div>
                        </div>

                        {/* Credentials Section */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                          <div className="border-b border-border bg-muted/20 px-6 py-4">
                            <div className="flex items-center">
                              <Settings className="h-5 w-5 mr-3 text-primary" />
                              <h2 className="text-lg font-semibold">API Credentials</h2>
                              <span className="ml-3 text-sm text-muted-foreground">Configure service integrations</span>
                            </div>
                          </div>
                          <div className="p-0">
                            <CredentialManagement onOpenHelp={openHelpModal} />
                          </div>
                        </div>

                        {/* Code & Deployment Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Generated Code */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                            <div className="border-b border-border bg-muted/20 px-6 py-4">
                              <div className="flex items-center">
                                <Code className="h-5 w-5 mr-3 text-primary" />
                                <h2 className="text-lg font-semibold">Generated Code</h2>
                                <span className="ml-3 text-sm text-muted-foreground">Python Lambda function</span>
                              </div>
                            </div>
                            <div className="h-96">
                              <CodePreview />
                            </div>
                          </div>

                          {/* Deployment Instructions */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border shadow-sm">
                            <div className="border-b border-border bg-muted/20 px-6 py-4">
                              <div className="flex items-center">
                                <Rocket className="h-5 w-5 mr-3 text-primary" />
                                <h2 className="text-lg font-semibold">AWS Deployment</h2>
                                <span className="ml-3 text-sm text-muted-foreground">Step-by-step guide</span>
                              </div>
                            </div>
                            <div className="h-96 overflow-auto">
                              <DeploymentInstructions />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
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
