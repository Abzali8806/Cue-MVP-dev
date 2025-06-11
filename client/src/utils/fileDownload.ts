export interface PythonFile {
  filename: string;
  content: string;
  mimeType?: string;
}

export const downloadPythonFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/x-python' });
  downloadBlob(blob, filename);
};

export const downloadMultiplePythonFiles = (files: PythonFile[]): void => {
  if (files.length === 1) {
    downloadPythonFile(files[0].filename, files[0].content);
    return;
  }

  // For multiple files, create a zip (if zip library available) or download individually
  files.forEach((file, index) => {
    setTimeout(() => {
      downloadPythonFile(file.filename, file.content);
    }, index * 500); // Delay to prevent browser blocking multiple downloads
  });
};

export const downloadTextFile = (filename: string, content: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
};

export const downloadJSON = (filename: string, data: any): void => {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  downloadBlob(blob, filename);
};

export const downloadYAML = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/yaml' });
  downloadBlob(blob, filename);
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

export const formatPythonCode = (code: string): string => {
  // Basic Python code formatting
  const lines = code.split('\n');
  let formattedLines: string[] = [];
  let indentLevel = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      formattedLines.push('');
      continue;
    }
    
    // Decrease indent for certain keywords
    if (trimmedLine.startsWith(('except', 'elif', 'else', 'finally'))) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the line with proper indentation
    const indent = '    '.repeat(indentLevel);
    formattedLines.push(indent + trimmedLine);
    
    // Increase indent after certain keywords
    if (trimmedLine.endsWith(':') && 
        (trimmedLine.includes('def ') || 
         trimmedLine.includes('class ') || 
         trimmedLine.includes('if ') || 
         trimmedLine.includes('for ') || 
         trimmedLine.includes('while ') || 
         trimmedLine.includes('try:') || 
         trimmedLine.includes('except') || 
         trimmedLine.includes('else:') || 
         trimmedLine.includes('elif ') || 
         trimmedLine.includes('with ') || 
         trimmedLine.includes('finally:'))) {
      indentLevel++;
    }
  }
  
  return formattedLines.join('\n');
};

export const createRequirementsTxt = (dependencies: string[]): string => {
  return dependencies.map(dep => dep.trim()).filter(dep => dep).join('\n');
};

export const createSAMTemplate = (functionName: string, runtime: string = 'python3.9'): string => {
  return `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  ${functionName}
  
  Generated AWS Lambda function for workflow processing

Globals:
  Function:
    Timeout: 30
    MemorySize: 128

Resources:
  ${functionName}Function:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: lambda_function.lambda_handler
      Runtime: ${runtime}
      Architectures:
        - x86_64
      Environment:
        Variables:
          # Add your environment variables here
          STRIPE_SECRET_KEY: !Ref StripeSecretKey
          SENDGRID_API_KEY: !Ref SendGridApiKey
          
Parameters:
  StripeSecretKey:
    Type: String
    Description: Stripe Secret API Key
    NoEcho: true
    
  SendGridApiKey:
    Type: String
    Description: SendGrid API Key
    NoEcho: true

Outputs:
  ${functionName}Function:
    Description: "${functionName} Lambda Function ARN"
    Value: !GetAtt ${functionName}Function.Arn
  ${functionName}FunctionIamRole:
    Description: "Implicit IAM Role created for ${functionName} function"
    Value: !GetAtt ${functionName}FunctionRole.Arn
`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
