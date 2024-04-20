import * as vscode from "vscode";
import * as path from "path";
import * as dialog from "vscode-webview-dialog";

interface TestDialogResult {
  name: string;
}

export async function activate(
  context: vscode.ExtensionContext,
  currentPanel: vscode.Webview | undefined
): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-plug-your-chad.showDialog",
      async function () {
        const outDir = path.resolve(__dirname, "./interface");
        const d = new dialog.WebviewDialog<TestDialogResult>(
          "webview-dialog-test",
          outDir,
          "index.html"
        );

        currentPanel = d.webview;
        const result: TestDialogResult | null = await d.getResult();

        if (result) {
          vscode.window.showInformationMessage(
            "Webview dialog result: " + JSON.stringify(result)
          );
        } else {
          vscode.window.showInformationMessage(
            "The webview dialog was cancelled."
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.doRefactor", function () {
      if (!currentPanel) {
        return;
      }

      // Send a message to our webview.
      currentPanel.postMessage({ command: "refactor" });
    })
  );

  context.subscriptions.push();
}

export async function deactivate(): Promise<void> {}
