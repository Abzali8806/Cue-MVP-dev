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
      label: "Lambda Generator",
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
        window.open('https://docs.aws.amazon.com/lambda/', '_blank');
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
          "fixed lg:relative inset-y-0 left-0 z-50 bg-surface border-r border-border transition-all duration-300 ease-in-out",
          "flex flex-col h-screen lg:h-auto",
          isOpen ? "w-64" : "w-0 lg:w-16",
          "lg:block"
        )}
      >
        {/* Toggle button - only visible on desktop */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-surface hover:bg-muted z-10"
          onClick={onToggle}
        >
          {isOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <div className={cn("p-6", !isOpen && "lg:p-3")}>
          <div className="flex items-center mb-4">
            <Workflow className="h-5 w-5 text-primary" />
            {isOpen && <h2 className="ml-2 text-lg font-semibold text-foreground">Project</h2>}
          </div>
          
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !isOpen && "lg:w-10 lg:h-10 lg:p-0 lg:justify-center",
                    item.active && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isOpen && "mr-2")} />
                  {isOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        
        {isOpen && (
          <>
            <Separator className="mx-4" />
            
            <div className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    onClick={action.action}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    <span>{action.label}</span>
                  </Button>
                ))}
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors">
                  <div className="flex items-center">
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 mr-2 text-foreground" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2 text-foreground" />
                    )}
                    <Label htmlFor="theme-toggle" className="text-sm text-muted-foreground cursor-pointer">
                      Dark Mode
                    </Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                  />
                </div>
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
              <p>Natural Language to AWS Lambda</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
