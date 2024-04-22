import { SelectionDetails } from "src/shared/interface";
import * as vscode from "vscode";

export class Editor {
  private webview: vscode.Webview | undefined;

  constructor(webview: vscode.Webview | undefined) {
    this.webview = webview;
    this.activateSelectionListener();
  }

  public dispose() {
    // Perform any necessary cleanup tasks for the editor
  }

  public getSelectionDetails() {
    const window = vscode.window;
    const editor = window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const startLine = selection.start.line;
      const startCharacter = selection.start.character;
      const endLine = selection.end.line;
      const endCharacter = selection.end.character;

      console.log("Selected Text:", text);
      console.log("Start Position:", startLine, startCharacter);
      console.log("End Position:", endLine, endCharacter);

      this.webview?.postMessage({
        command: "selectionDetails",
        textSelection: text,
        startLine,
        startCharacter,
        endLine,
        endCharacter,
        languageId: editor.document.languageId,
        fileName: editor.document.fileName,
        file: editor.document.getText(),
        activeEditorName: window.activeTextEditor?.document.fileName,
        visibleEditorsName: window.visibleTextEditors.map((x) => {
          return x.document.fileName;
        }),
        activeColorTheme: JSON.stringify(window.activeColorTheme, null, 2),
      } as SelectionDetails);
    } else {
      console.log("No active text editor");
    }
  }

  public editDocument() {
    console.log("Yeah the document edit works!");
  }

  private activateSelectionListener() {
    const window = vscode.window;
    window.onDidChangeTextEditorSelection(() => {
      this.getSelectionDetails();
    });
  }
}
