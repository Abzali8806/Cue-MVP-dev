import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, User, Menu, X, LogIn, LogOut, Settings } from "lucide-react";
import { useWorkflowGeneration } from "../../hooks/useWorkflowGeneration";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspacePersistence } from "../../hooks/useWorkspacePersistence";
import { useDispatch } from "react-redux";
import { setDescription } from "../../store/slices/workflowSlice";
import { Link, useLocation } from "wouter";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function AppHeader({ onMenuToggle, isMobileMenuOpen }: AppHeaderProps) {
  const { generateWorkflowFromDescription } = useWorkflowGeneration();
  const { user, isAuthenticated } = useAuth();
  const { clearWorkspace } = useWorkspacePersistence();
  const dispatch = useDispatch();
  const [location] = useLocation();

  const handleNewWorkflow = () => {
    // Clear workspace data and reset form without page reload
    clearWorkspace();
    dispatch(setDescription(''));
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
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
              <Link href="/">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">Cue</h1>
              </Link>
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
                My Workflows
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
            <ThemeToggle />
            

            
            {false ? ( // Temporarily disabled until authentication is implemented
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        User
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-8 sm:h-9 lg:h-10">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden">Sign in</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
