export interface SelectionDetails {
  command: string;
  textSelection: string;
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
  languageId: string;
  fileName: string;
  file: string;
  activeEditorName: string | undefined;
  visibleEditorsName: string[];
  activeColorTheme: string;
}

export interface User {
  id: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  preferences: {
    verbosity: "low" | "medium" | "high";
    codeExplanation: boolean;
    codeExamples: boolean;
    techTerminology: "avoid" | "explain" | "use";
    responseFormat: "text" | "markdown" | "html";
    includeDiagrams: boolean;
    suggestOptimizations: boolean;
    provideFeedback: boolean;
  };
}

export interface Context {
  codeSnippet: string;
  fileContent?: string;
  fileLanguage: string;
  startLine: number;
  startChar: number;
  endLine: number;
  endChar: number;
  question: string;
  history?: any[];
}
