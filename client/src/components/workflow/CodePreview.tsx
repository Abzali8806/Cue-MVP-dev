import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, Check, Code } from "lucide-react";
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

  // Code will be provided by FastAPI backend
  const workflowCode = workflowState.generatedCode || '';
  const requirementsTxt = '';
  const samTemplate = '';

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
    const formattedCode = formatPythonCode(workflowCode);
    downloadPythonFile("workflow_handler.py", formattedCode);
  };

  const handleDownloadRequirements = () => {
    downloadTextFile("requirements.txt", requirementsTxt, "text/plain");
  };

  const handleDownloadSAM = () => {
    downloadYAML("template.yaml", samTemplate);
  };

  const handleDownloadAll = () => {
    const files = [
      { filename: "workflow_handler.py", content: formatPythonCode(workflowCode) },
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
      value: "workflow",
      label: "workflow_handler.py",
      content: workflowCode,
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
      onDownload: handleDownloadSAM,
    },
  ];

  // Show empty state when no code is generated
  if (!workflowCode) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Code Generated Yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Describe your workflow above to generate Python code automatically
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Download Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">Generated Files</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAll}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
        >
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Code Tabs */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="workflow" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="flex-1 mx-4 mb-4 min-h-0">
              <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-900">
                {/* Tab Header with Controls */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tab.label}</span>
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
                <ScrollArea className="flex-1 bg-gray-900">
                  <div className="p-4">
                    <pre className={cn(
                      "text-sm font-mono text-gray-100 whitespace-pre-wrap"
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
      </div>
    </div>
  );
}
