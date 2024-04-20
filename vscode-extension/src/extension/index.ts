import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.Webview | undefined = undefined;

  (await import("./showDialog")).activate(context, currentPanel);
  (await import("./startServer")).activate(context, currentPanel);
  (await import("./copyLines")).activate(context, currentPanel);
}
