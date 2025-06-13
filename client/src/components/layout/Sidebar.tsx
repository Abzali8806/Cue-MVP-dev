import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Code2, 
  History, 
  Settings, 
  Upload, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight,
  FileText,
  Workflow,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useTheme } from "../../lib/theme";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const sidebarItems = [
    {
      icon: Code2,
      label: "Workflow Generator",
      href: "/",
      active: location === "/",
    },
    {
      icon: History,
      label: "Recent Workflows",
      href: "/history",
      active: location === "/history",
    },
    {
      icon: Settings,
      label: "Configuration",
      href: "/settings",
      active: location === "/settings",
    },
  ];

  const quickActions = [
    {
      icon: Upload,
      label: "Import Workflow",
      action: () => {
        // Create a file input element to handle file import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const workflow = JSON.parse(e.target?.result as string);
                console.log('Imported workflow:', workflow);
                // Handle workflow import here
              } catch (error) {
                console.error('Failed to parse workflow file:', error);
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      },
    },
    {
      icon: HelpCircle,
      label: "Documentation",
      action: () => {
        window.open('https://github.com/workflow-generator/docs', '_blank');
      },
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:relative left-0 z-50 bg-background transition-all duration-300 ease-in-out border-r border-border",
          "flex flex-col h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]",
          isOpen ? "w-80" : "w-0 lg:w-20",
          "lg:block overflow-hidden"
        )}
      >
        {/* Toggle button - clean integrated design */}
        <div className="hidden lg:flex justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 rounded-md hover:bg-muted/60 transition-colors group"
            onClick={onToggle}
          >
            {isOpen ? (
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </Button>
        </div>

        <div className={cn("p-8 pt-4", !isOpen && "lg:p-4 lg:pt-4")}>
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            {isOpen && (
              <div className="ml-4">
                <h2 className="text-xl font-bold text-foreground">Cue</h2>
                <p className="text-sm text-muted-foreground">Workflow Generator</p>
              </div>
            )}
          </div>
          
          {/* Main Navigation */}
          <div className="space-y-3">
            {isOpen && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Navigation
              </h3>
            )}
            {sidebarItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div
                  className={cn(
                    "flex items-center rounded-xl p-4 transition-all duration-200 group cursor-pointer",
                    !isOpen && "lg:w-12 lg:h-12 lg:p-0 lg:justify-center lg:rounded-lg",
                    item.active 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/70 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center",
                    !isOpen && "lg:w-full lg:h-full"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  {isOpen && (
                    <div className="ml-4 flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {isOpen && (
          <>
            <div className="px-8 py-6">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                      onClick={action.action}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-muted/50 rounded-lg group-hover:bg-muted transition-colors">
                        <action.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="ml-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-background rounded-lg">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 text-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                  <span className="ml-3 text-sm font-medium">Dark Mode</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Bottom section */}
        {isOpen && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>Cue MVP v1.0</p>
              <p>Natural Language to Code</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
