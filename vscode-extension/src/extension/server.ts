import http from "http";
import vscode from "vscode";

export class Server {
  private server: http.Server;
  private webview: vscode.Webview | undefined;

  constructor(webview: vscode.Webview | undefined) {
    this.webview = webview;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  public start(port: number) {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    vscode.window.showInformationMessage(`Server is running on port ${port}`, {
      modal: true,
    });
  }

  public dispose() {
    this.server.close();
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
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

      // Send a message to the webview.
      this.webview?.postMessage({ command: "refactor" });
    });
  }
}
