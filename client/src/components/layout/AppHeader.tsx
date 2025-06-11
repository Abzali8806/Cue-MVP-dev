import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, Menu, X } from "lucide-react";
import { useWorkflowGeneration } from "../../hooks/useWorkflowGeneration";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function AppHeader({ onMenuToggle, isMobileMenuOpen }: AppHeaderProps) {
  const { createSampleWorkflow } = useWorkflowGeneration();

  const handleNewWorkflow = () => {
    createSampleWorkflow();
  };

  return (
    <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2"
              onClick={onMenuToggle}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Cue</h1>
            </div>
            
            <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Workflow
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                History
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Settings
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleNewWorkflow} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Workflow</span>
              <span className="sm:hidden">New</span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
