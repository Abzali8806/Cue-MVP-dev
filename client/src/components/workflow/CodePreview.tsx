import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  downloadPythonFile, 
  downloadTextFile, 
  downloadYAML, 
  copyToClipboard, 
  formatPythonCode,
  createRequirementsTxt,
  createSAMTemplate
} from "../../utils/fileDownload";
import { 
  highlightPythonCode, 
  SAMPLE_LAMBDA_CODE, 
  SAMPLE_REQUIREMENTS_TXT, 
  SAMPLE_SAM_TEMPLATE 
} from "../../utils/codeHighlight";

export default function CodePreview() {
  const workflowState = useSelector((state: RootState) => state.workflow);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Use generated code if available, otherwise use sample
  const lambdaCode = workflowState.generatedCode || SAMPLE_LAMBDA_CODE;
  const requirementsTxt = SAMPLE_REQUIREMENTS_TXT;
  const samTemplate = SAMPLE_SAM_TEMPLATE;

  const handleCopy = async (content: string, key: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    }
  };

  const handleDownloadPython = () => {
    const formattedCode = formatPythonCode(lambdaCode);
    downloadPythonFile("lambda_function.py", formattedCode);
  };

  const handleDownloadRequirements = () => {
    downloadTextFile("requirements.txt", requirementsTxt, "text/plain");
  };

  const handleDownloadTemplate = () => {
    downloadYAML("template.yaml", samTemplate);
  };

  const handleDownloadAll = () => {
    const files = [
      { filename: "lambda_function.py", content: formatPythonCode(lambdaCode) },
      { filename: "requirements.txt", content: requirementsTxt },
      { filename: "template.yaml", content: samTemplate },
    ];

    files.forEach((file, index) => {
      setTimeout(() => {
        if (file.filename.endsWith('.py')) {
          downloadPythonFile(file.filename, file.content);
        } else if (file.filename.endsWith('.yaml')) {
          downloadYAML(file.filename, file.content);
        } else {
          downloadTextFile(file.filename, file.content);
        }
      }, index * 500);
    });
  };

  const tabs = [
    {
      value: "lambda",
      label: "lambda_function.py",
      content: lambdaCode,
      language: "python",
      onDownload: handleDownloadPython,
    },
    {
      value: "requirements",
      label: "requirements.txt",
      content: requirementsTxt,
      language: "text",
      onDownload: handleDownloadRequirements,
    },
    {
      value: "template",
      label: "template.yaml",
      content: samTemplate,
      language: "yaml",
      onDownload: handleDownloadTemplate,
    },
  ];

  return (
    <Card className="h-full border-0 shadow-none rounded-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Generated Code</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-5rem)] p-0">
        <Tabs defaultValue="lambda" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-6 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="flex-1 mx-6 mb-6">
              <div className="h-full border border-border rounded-lg overflow-hidden">
                {/* Tab Header with Controls */}
                <div className="flex items-center justify-between p-3 bg-muted border-b border-border">
                  <span className="text-sm font-medium">{tab.label}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(tab.content, tab.value)}
                      className="h-7 px-2"
                    >
                      {copiedStates[tab.value] ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={tab.onDownload}
                      className="h-7 px-2"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                {/* Code Content */}
                <ScrollArea className="h-[calc(100%-3.5rem)] bg-gray-900">
                  <div className="p-4">
                    <pre className={cn(
                      "text-sm font-mono text-gray-100 whitespace-pre-wrap overflow-x-auto",
                      "code-highlight"
                    )}>
                      {tab.language === "python" ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: highlightPythonCode(tab.content),
                          }}
                        />
                      ) : (
                        <code>{tab.content}</code>
                      )}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      {/* Empty State */}
      {!lambdaCode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">No Code Generated</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a workflow to see the Python code preview.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
