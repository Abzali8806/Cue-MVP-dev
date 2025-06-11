import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, Menu, X } from "lucide-react";
import { useWorkflowGeneration } from "../../hooks/useWorkflowGeneration";
import { Link, useLocation } from "wouter";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function AppHeader({ onMenuToggle, isMobileMenuOpen }: AppHeaderProps) {
  const { createSampleWorkflow } = useWorkflowGeneration();
  const [location] = useLocation();

  const handleNewWorkflow = () => {
    createSampleWorkflow();
  };

  return (
    <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
          <div className="flex items-center min-w-0">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2 h-8 w-8 p-0"
              onClick={onMenuToggle}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Cue</h1>
            </div>
            
            <nav className="hidden xl:ml-6 xl:flex xl:items-center xl:space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                Workflow
              </Link>
              <Link 
                href="/history" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/history" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                History
              </Link>
              <Link 
                href="/settings" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/settings" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <Button 
              onClick={handleNewWorkflow} 
              className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm"
              size="sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Workflow</span>
              <span className="sm:hidden">New</span>
            </Button>
            
            <Avatar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8">
              <AvatarFallback className="bg-muted">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
