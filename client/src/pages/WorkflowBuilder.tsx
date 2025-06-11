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
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b border-border bg-surface">
                <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger 
                    value="input" 
                    className="flex items-center gap-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Workflow Input</span>
                    <span className="sm:hidden">Input</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="visualization" 
                    className="flex items-center gap-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Workflow className="h-4 w-4" />
                    <span className="hidden sm:inline">Visualization</span>
                    <span className="sm:hidden">Visual</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="code" 
                    className="flex items-center gap-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Code className="h-4 w-4" />
                    <span className="hidden sm:inline">Code Preview</span>
                    <span className="sm:hidden">Code</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="credentials" 
                    className="flex items-center gap-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Credentials</span>
                    <span className="sm:hidden">Auth</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="deploy" 
                    className="flex items-center gap-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <Rocket className="h-4 w-4" />
                    <span className="hidden sm:inline">Deploy</span>
                    <span className="sm:hidden">Deploy</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="input" className="h-full m-0 p-0">
                  <div className="h-full overflow-auto">
                    <WorkflowInput />
                  </div>
                </TabsContent>

                <TabsContent value="visualization" className="h-full m-0 p-0">
                  <div className="h-full w-full">
                    <WorkflowVisualization />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="h-full m-0 p-0">
                  <div className="h-full overflow-auto">
                    <CodePreview />
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="h-full m-0 p-0">
                  <div className="h-full overflow-auto">
                    <CredentialManagement onOpenHelp={openHelpModal} />
                  </div>
                </TabsContent>

                <TabsContent value="deploy" className="h-full m-0 p-0">
                  <div className="h-full overflow-auto">
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
