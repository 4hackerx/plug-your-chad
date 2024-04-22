import * as path from "path";
import * as vscode from "vscode";
import * as dialog from "vscode-webview-dialog";

interface TestDialogResult {
  name: string;
}

export async function activate(context: vscode.ExtensionContext) {
  let disposables: vscode.Disposable[] = [];

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-plug-your-chad.start",
      async function () {
        // Setup webview dialog.
        const outDir = path.resolve(__dirname, "./ui");
        const d = new dialog.WebviewDialog<TestDialogResult>(
          "webview-dialog-test",
          outDir,
          "index.html"
        );
        const webview = d.webview;

        // Auto activate actors of the extension.
        const serverInstance = new (await import("./server")).Server(webview);
        disposables.push({ dispose: () => serverInstance.dispose() });
        const editorInstance = new (await import("./editor")).Editor(webview);
        disposables.push({ dispose: () => editorInstance.dispose() });


        // Handle messages from the webview.
        webview?.onDidReceiveMessage(
          async (message) => {
            switch (message.command) {
              case "onReady":
                serverInstance.start(8080);
                break;

              case "editDocument":
                editorInstance.editDocument();
                break;

              default:
                console.log("didn't match");
            }
          },
          undefined,
          context.subscriptions
        );
      }
    )
  );

  context.subscriptions.push({
    dispose: () => {
      disposables.forEach((disposable) => disposable.dispose());
      disposables = [];
    },
  });
}
