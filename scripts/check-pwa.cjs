const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

for (const file of ["manifest.webmanifest", "sw.js", "offline.html", "icon.svg", "index.html"]) {
  check(exists(file), `Missing PWA file: ${file}`);
}

let manifest = {};
if (exists("manifest.webmanifest")) {
  try {
    manifest = JSON.parse(read("manifest.webmanifest"));
  } catch (error) {
    errors.push(`manifest.webmanifest: invalid JSON (${error.message})`);
  }
}

check(manifest.name === "큰돌 - 바둑과 오목 학습 트레이너", "manifest.webmanifest: unexpected name");
check(manifest.short_name === "큰돌", "manifest.webmanifest: unexpected short_name");
check(manifest.start_url === "/baduk-trainer/", "manifest.webmanifest: unexpected start_url");
check(manifest.scope === "/baduk-trainer/", "manifest.webmanifest: unexpected scope");
check(manifest.display === "standalone", "manifest.webmanifest: display should be standalone");
check(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === "icon.svg"), "manifest.webmanifest: missing icon.svg icon");

if (exists("index.html")) {
  const index = read("index.html");
  check(index.includes('rel="manifest"'), "index.html: missing manifest link");
  check(index.includes("navigator.serviceWorker.register(\"sw.js\")"), "index.html: missing service worker registration");
}

if (exists("sw.js")) {
  const worker = read("sw.js");
  check(worker.includes("CACHE_NAME"), "sw.js: missing cache name");
  check(worker.includes("offline.html"), "sw.js: missing offline fallback");
  check(worker.includes("self.addEventListener(\"fetch\""), "sw.js: missing fetch handler");
  check(worker.includes("caches.open"), "sw.js: missing cache open call");
}

if (exists("offline.html")) {
  const offline = read("offline.html");
  check(offline.includes("오프라인"), "offline.html: missing offline copy");
  check(offline.includes('href="index.html"'), "offline.html: missing home link");
  check(offline.includes('href="learn.html"'), "offline.html: missing learn link");
}

if (exists("icon.svg")) {
  const icon = read("icon.svg");
  check(icon.includes("<svg"), "icon.svg: missing svg root");
  check(icon.includes("viewBox=\"0 0 512 512\""), "icon.svg: expected 512 viewBox");
}

console.log("PWA check");

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: PWA files are wired.");
