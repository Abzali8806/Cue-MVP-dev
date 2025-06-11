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

export default function WorkflowBuilder() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string } | null>(null);
  
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
      <AppHeader />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
            {/* Left Panel: Input & Credentials */}
            <div className="w-full lg:w-2/5 bg-surface border-r border-border flex flex-col">
              <WorkflowInput />
              <CredentialManagement onOpenHelp={openHelpModal} />
            </div>

            {/* Right Panel: Visualization & Code */}
            <div className="flex-1 flex flex-col">
              {/* Workflow Visualization */}
              <div className="h-1/2 relative">
                <WorkflowVisualization />
              </div>

              {/* Code Preview */}
              <div className="h-1/2 border-t border-border">
                <CodePreview />
              </div>
            </div>
          </div>

          {/* Deployment Instructions */}
          <DeploymentInstructions />
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
