import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { deploymentService, type DeploymentStep } from "../../services/deploymentService";

export default function DeploymentInstructions() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Get default instructions (in a real app, this would come from the API)
  const instructions = deploymentService.getDefaultInstructions();

  const toggleStepCompletion = (stepId: string) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepId)) {
      newCompletedSteps.delete(stepId);
    } else {
      newCompletedSteps.add(stepId);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const getStepIcon = (step: DeploymentStep) => {
    if (completedSteps.has(step.id)) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    }
    if (step.isOptional) {
      return <AlertCircle className="h-5 w-5 text-warning" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStepNumber = (index: number) => {
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        completedSteps.has(instructions.steps[index].id)
          ? 'bg-success text-success-foreground'
          : instructions.steps[index].isOptional
          ? 'bg-warning text-warning-foreground'
          : 'bg-muted text-muted-foreground'
      }`}>
        {index + 1}
      </div>
    );
  };

  const completionPercentage = Math.round(
    (completedSteps.size / instructions.steps.filter(step => !step.isOptional).length) * 100
  );

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="border-t border-border rounded-none shadow-none">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">AWS Lambda Deployment</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {completedSteps.size}/{instructions.steps.length} Complete
                </Badge>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Prerequisites */}
            <div className="mb-8">
              <h4 className="font-medium text-base mb-4">Prerequisites</h4>
              <div className="space-y-3">
                {instructions.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-start text-sm text-muted-foreground">
                    <Circle className="h-3 w-3 mr-3 mt-1 flex-shrink-0" />
                    <span>{prerequisite}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Steps */}
            <div className="mb-8">
              <h4 className="font-medium text-base mb-6">Deployment Steps</h4>
              <div className="space-y-6">
                {instructions.steps.map((step, index) => (
                  <div key={step.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div 
                      className="flex items-start space-x-4 cursor-pointer mb-4"
                      onClick={() => toggleStepCompletion(step.id)}
                    >
                      {getStepNumber(index)}
                      <div className="flex-1">
                        <h5 className="font-semibold text-base mb-2">{step.title}</h5>
                        {step.isOptional && (
                          <Badge variant="secondary" className="text-xs mb-3">
                            Optional
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStepIcon(step)}
                      </div>
                    </div>
                    
                    {step.commands && step.commands.length > 0 && (
                      <div className="ml-10 mt-4">
                        <div className="text-sm font-medium text-foreground mb-3">Commands:</div>
                        <div className="space-y-2">
                          {step.commands.map((command, cmdIndex) => (
                            <code 
                              key={cmdIndex}
                              className="block text-sm bg-muted p-3 rounded-md font-mono text-foreground border border-border"
                            >
                              {command}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium">Deployment Progress</span>
                <span className="text-sm text-muted-foreground font-medium">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Important Notes */}
            {instructions.notes && instructions.notes.length > 0 && (
              <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-medium text-base mb-4">Important Notes</h4>
                <ul className="space-y-3">
                  {instructions.notes.map((note, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <Circle className="h-3 w-3 mr-3 mt-1 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
