import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Code2, 
  History, 
  Settings, 
  ChevronLeft,
  ChevronRight,
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
      label: "History",
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
          "fixed top-0 left-0 z-50 h-full bg-background border-r border-border transition-all duration-300 ease-in-out",
          "lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0 w-80" : "-translate-x-full w-20",
          "lg:w-20 lg:hover:w-80"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
          <div className={cn(
            "flex items-center space-x-3 transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
          )}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Cue</h1>
              <p className="text-xs text-muted-foreground">Workflow Generator</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  "hover:bg-muted/50 cursor-pointer",
                  item.active ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground",
                  isOpen ? "p-3" : "p-3 justify-center lg:hover:justify-start"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className={cn(
                    "ml-3 font-medium transition-opacity duration-200 whitespace-nowrap",
                    isOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Dark Mode Toggle */}
        {isOpen && (
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
        )}

        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Bottom section */}
        {isOpen && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>Cue MVP v1.0</p>
              <p>Natural Language to Fully Automated Workflows</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}