import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  CreditCard,
  Mail,
  Database,
  Settings,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CredentialField } from "../../store/slices/credentialsSlice";

interface CredentialSectionProps {
  serviceType: string;
  displayName: string;
  icon: string;
  isRequired: boolean;
  isExpanded: boolean;
  credentials: CredentialField[];
  onToggleSection: () => void;
  onCredentialChange: (credentialId: string, value: string) => void;
  onOpenHelp: () => void;
}

export default function CredentialSection({
  serviceType,
  displayName,
  icon,
  isRequired,
  isExpanded,
  credentials,
  onToggleSection,
  onCredentialChange,
  onOpenHelp,
}: CredentialSectionProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const togglePasswordVisibility = (credentialId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(credentialId)) {
      newVisible.delete(credentialId);
    } else {
      newVisible.add(credentialId);
    }
    setVisiblePasswords(newVisible);
  };

  const getIcon = () => {
    switch (icon) {
      case 'payment':
        return <CreditCard className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'storage':
        return <Database className="h-5 w-5" />;
      case 'webhook':
        return <Globe className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getValidationIcon = (credential: CredentialField) => {
    if (credential.isValid === true) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    }
    if (credential.isValid === false) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    if (credential.value && credential.isRequired) {
      return <AlertCircle className="h-4 w-4 text-warning" />;
    }
    return null;
  };

  const getValidationMessage = (credential: CredentialField) => {
    if (credential.isValid === true) {
      return "Valid credential";
    }
    if (credential.isValid === false) {
      return credential.validationMessage || "Invalid credential";
    }
    if (credential.value && credential.isRequired) {
      return "Validation pending";
    }
    return "";
  };

  const getSectionBorderColor = () => {
    const hasInvalidCredentials = credentials.some(cred => cred.isValid === false);
    const hasValidCredentials = credentials.some(cred => cred.isValid === true);
    const hasRequiredEmpty = credentials.some(cred => cred.isRequired && !cred.value);

    if (hasInvalidCredentials) {
      return "border-destructive";
    }
    if (hasRequiredEmpty) {
      return "border-warning";
    }
    if (hasValidCredentials) {
      return "border-success";
    }
    return "border-border";
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleSection}>
      <div className={cn("border rounded-lg", getSectionBorderColor())}>
        <CollapsibleTrigger asChild>
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="text-primary">
                {getIcon()}
              </div>
              <div>
                <span className="font-medium">{displayName}</span>
                <Badge 
                  variant={isRequired ? "destructive" : "secondary"}
                  className="ml-2 text-xs"
                >
                  {isRequired ? "Required" : "Optional"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Status indicator */}
              <div className="flex items-center space-x-1">
                {credentials.some(cred => cred.isValid === true) && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
                {credentials.some(cred => cred.isValid === false) && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                {credentials.some(cred => cred.isRequired && !cred.value) && (
                  <AlertCircle className="h-4 w-4 text-warning" />
                )}
              </div>
              
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4 space-y-4">
            {credentials.map((credential) => (
              <div key={credential.id} className="space-y-2">
                <Label htmlFor={credential.id} className="text-sm font-medium">
                  {credential.name}
                  {credential.isRequired && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                <div className="relative">
                  <Input
                    id={credential.id}
                    type={
                      credential.credentialType === 'password' && !visiblePasswords.has(credential.id)
                        ? 'password' 
                        : 'text'
                    }
                    placeholder={credential.placeholder || `Enter ${credential.name.toLowerCase()}`}
                    value={credential.value}
                    onChange={(e) => onCredentialChange(credential.id, e.target.value)}
                    className={cn(
                      "pr-20",
                      credential.isValid === false && "border-destructive focus:ring-destructive",
                      credential.isValid === true && "border-success focus:ring-success"
                    )}
                  />
                  
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                    {/* Password toggle */}
                    {credential.credentialType === 'password' && credential.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => togglePasswordVisibility(credential.id)}
                      >
                        {visiblePasswords.has(credential.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                    
                    {/* Validation icon */}
                    {getValidationIcon(credential)}
                  </div>
                </div>
                
                {/* Description */}
                {credential.description && (
                  <p className="text-xs text-muted-foreground">
                    {credential.description}
                  </p>
                )}
                
                {/* Validation message */}
                {getValidationMessage(credential) && (
                  <div className="flex items-center space-x-1">
                    {getValidationIcon(credential)}
                    <span className={cn(
                      "text-xs",
                      credential.isValid === true && "text-success",
                      credential.isValid === false && "text-destructive",
                      credential.isValid === null && "text-warning"
                    )}>
                      {getValidationMessage(credential)}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Help button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHelp}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How to get {displayName} credentials
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
