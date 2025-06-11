import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useDispatch } from "react-redux";
import { updateNode, setSelectedNode } from "../../store/slices/nodesSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  CreditCard,
  Mail,
  Database,
  Settings,
  Globe,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomNodeData } from "../../types/node";

const CustomNode = memo(({ id, data, selected }: NodeProps<CustomNodeData>) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false);

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    dispatch(updateNode({ 
      id, 
      data: { ...data, isExpanded: newExpanded } 
    }));
  };

  const handleNodeClick = () => {
    dispatch(setSelectedNode(selected ? null : id));
  };

  const getIcon = () => {
    switch (data.icon) {
      case 'webhook':
        return <Globe className="h-5 w-5" />;
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'verified':
        return <Shield className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'storage':
        return <Database className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getValidationIcon = () => {
    switch (data.validationStatus) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getValidationMessage = () => {
    if (data.validationMessage) {
      return data.validationMessage;
    }
    
    switch (data.validationStatus) {
      case 'valid':
        return "All credentials validated";
      case 'invalid':
        return `${data.serviceType} credentials required`;
      case 'warning':
        return "Optional component";
      case 'pending':
      default:
        return "Ready to configure";
    }
  };

  const getBorderColor = () => {
    if (selected) {
      return "border-primary shadow-lg";
    }
    
    switch (data.validationStatus) {
      case 'valid':
        return "border-success";
      case 'invalid':
        return "border-destructive";
      case 'warning':
        return "border-warning";
      default:
        return "border-border";
    }
  };

  const getBackgroundColor = () => {
    if (selected) {
      return "bg-primary/5";
    }
    return "bg-surface";
  };

  return (
    <>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-surface bg-muted-foreground"
      />
      
      <Card 
        className={cn(
          "w-64 border-2 shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg",
          getBorderColor(),
          getBackgroundColor()
        )}
        onClick={handleNodeClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="text-primary">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {data.name}
              </h4>
            </div>
            {data.requiredCredentials && data.requiredCredentials.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpanded();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.description}
          </p>

          {/* Validation Status */}
          <div className="flex items-center space-x-2">
            {getValidationIcon()}
            <span className={cn(
              "text-xs flex-1",
              data.validationStatus === 'valid' && "text-success",
              data.validationStatus === 'invalid' && "text-destructive",
              data.validationStatus === 'warning' && "text-warning",
              data.validationStatus === 'pending' && "text-muted-foreground"
            )}>
              {getValidationMessage()}
            </span>
          </div>

          {/* Credentials Section (Expandable) */}
          {isExpanded && data.requiredCredentials && data.requiredCredentials.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="text-xs font-medium text-foreground">
                Required Credentials:
              </div>
              <div className="space-y-2">
                {data.requiredCredentials.map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {credential.name}
                    </span>
                    <Badge 
                      variant={credential.required ? "destructive" : "secondary"}
                      className="text-xs ml-2"
                    >
                      {credential.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-surface bg-primary"
      />
    </>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
