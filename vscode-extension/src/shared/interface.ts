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
