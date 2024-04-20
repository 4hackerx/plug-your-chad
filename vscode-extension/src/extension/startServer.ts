import http from "http";
import vscode from "vscode";

export function activate(
  context: vscode.ExtensionContext,
  currentPanel: vscode.Webview | undefined
) {
  const port = 8080;

  const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log(`Request headers: ${JSON.stringify(req.headers, null, 2)}`);

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      console.log(`Request body: ${body}`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello from VS Code extension!");
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-plug-your-chad.startServer",
      function () {
        vscode.window.showInformationMessage(
          `Server is running on port ${port}`
        );
      }
    )
  );
}
