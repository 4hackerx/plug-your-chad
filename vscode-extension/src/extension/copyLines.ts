import * as vscode from "vscode";

export function activate(
  context: vscode.ExtensionContext,
  currentPanel: vscode.Webview | undefined
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-plug-your-chad.copyLines",
      function () {
        const editor = vscode.window.activeTextEditor;
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
          // Perform additional actions based on the selected text and context
          performAction(text, editor.document, selection);
        } else {
          console.log("No active text editor");
        }
      }
    )
  );
}

function performAction(
  selectedText: string,
  document: vscode.TextDocument,
  selection: vscode.Selection
) {
  // Analyze the selected text and its context
  const lineText = document.lineAt(selection.start.line).text;
  const languageId = document.languageId;
  console.log("Line Text:", lineText);
  console.log("Language ID:", languageId);

  // Perform actions based on the selected text and context
  if (languageId === "javascript") {
    // Example: If the selected text is a function call in JavaScript, log the function name
    const functionRegex = /(\w+)\(/;
    const match = selectedText.match(functionRegex);
    if (match) {
      const functionName = match[1];
      console.log("Function Name:", functionName);
      // Perform further actions specific to JavaScript function calls
    }
  } else if (languageId === "html") {
    // Example: If the selected text is an HTML tag, log the tag name
    const tagRegex = /<(\\w+)/;
    const match = selectedText.match(tagRegex);
    if (match) {
      const tagName = match[1];
      console.log("HTML Tag Name:", tagName);
      // Perform further actions specific to HTML tags
    }
  }
}
