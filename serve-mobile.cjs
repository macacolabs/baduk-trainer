const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 8080);
const root = __dirname;
const files = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/app.js", "app.js"],
]);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const file = files.get(url.pathname);
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const fullPath = path.join(root, file);
  fs.readFile(fullPath, (error, data) => {
    if (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end("Server error");
      return;
    }
    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": types[path.extname(file)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Baduk trainer server: http://0.0.0.0:${port}`);
});
