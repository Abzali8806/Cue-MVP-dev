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
        {/* Sidebar - hidden on mobile, overlay on tablet */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              {/* Mobile-first Tab Navigation */}
              <div className="border-b border-border bg-surface">
                <div className="overflow-x-auto">
                  <TabsList className="h-12 w-full min-w-max justify-start rounded-none bg-transparent p-0">
                    <TabsTrigger 
                      value="input" 
                      className="flex items-center gap-1.5 h-12 px-3 sm:px-4 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Input</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="visualization" 
                      className="flex items-center gap-1.5 h-12 px-3 sm:px-4 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      <Workflow className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Visual</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="code" 
                      className="flex items-center gap-1.5 h-12 px-3 sm:px-4 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      <Code className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Code</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="credentials" 
                      className="flex items-center gap-1.5 h-12 px-3 sm:px-4 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Auth</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="deploy" 
                      className="flex items-center gap-1.5 h-12 px-3 sm:px-4 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      <Rocket className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Deploy</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Tab Content */}
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
