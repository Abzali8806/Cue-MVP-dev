export interface CodeHighlightOptions {
  language: string;
  lineNumbers?: boolean;
  theme?: 'dark' | 'light';
}

export const highlightPythonCode = (code: string): string => {
  // Simple syntax highlighting for Python
  const keywords = [
    'def', 'class', 'import', 'from', 'as', 'if', 'elif', 'else', 'for', 'while',
    'try', 'except', 'finally', 'with', 'return', 'yield', 'pass', 'break', 'continue',
    'and', 'or', 'not', 'in', 'is', 'lambda', 'async', 'await', 'True', 'False', 'None'
  ];

  const builtins = [
    'print', 'len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set',
    'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round'
  ];

  let highlighted = code;

  // Highlight comments
  highlighted = highlighted.replace(
    /(#.*$)/gm,
    '<span class="comment">$1</span>'
  );

  // Highlight strings
  highlighted = highlighted.replace(
    /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    '<span class="string">$1$2$1</span>'
  );

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="number">$1</span>'
  );

  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });

  // Highlight function names
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    '<span class="function">$1</span>'
  );

  // Highlight built-in functions
  builtins.forEach(builtin => {
    const regex = new RegExp(`\\b${builtin}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="function">${builtin}</span>`);
  });

  return highlighted;
};

export const addLineNumbers = (code: string): string => {
  const lines = code.split('\n');
  return lines
    .map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `<span class="line-number">${lineNumber}</span>${line}`;
    })
    .join('\n');
};

export const formatCodeBlock = (code: string, options: CodeHighlightOptions): string => {
  let formattedCode = code;

  if (options.language === 'python') {
    formattedCode = highlightPythonCode(formattedCode);
  }

  if (options.lineNumbers) {
    formattedCode = addLineNumbers(formattedCode);
  }

  return formattedCode;
};

export const removeHTMLTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const escapeHTML = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const unescapeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Code examples will be provided by your FastAPI backend
export const SAMPLE_LAMBDA_CODE = '';
export const SAMPLE_REQUIREMENTS_TXT = '';
export const SAMPLE_SAM_TEMPLATE = '';
