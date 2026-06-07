import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const target = resolve(root, clean === "/" ? "index.html" : clean.slice(1));
  if (!target.startsWith(root)) return null;
  if (!existsSync(target)) return null;
  if (statSync(target).isDirectory()) return join(target, "index.html");
  return target;
}

createServer((request, response) => {
  const target = safePath(request.url || "/");
  if (!target) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(target)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(target).pipe(response);
}).listen(port, () => {
  console.log(`仙农洞天 playable slice: http://localhost:${port}`);
});
