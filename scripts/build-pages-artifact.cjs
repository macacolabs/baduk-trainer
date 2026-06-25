const fs = require("fs");
const path = require("path");
const { articleFiles, publicPages } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const checkOnly = process.argv.includes("--check");

const publicFiles = [
  "index.html",
  "404.html",
  ...publicPages.filter((file) => file !== "index.html"),
  ...articleFiles,
  "app.js",
  "styles.css",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
];

const denyList = [
  ".git",
  ".github",
  ".agents",
  "scripts",
  "analysis_logs",
  "local-katago-server.cjs",
  "KATAGO_LOCAL_SETUP.md",
  "README.md",
  "SERVICE_ROADMAP.md",
  "OPERATION_CHECKLIST.md",
  "EXTERNAL_ACCOUNT_CHECKLIST.md",
  "SUBMISSION_PACKET.md",
  "ADSENSE_AFTER_APPROVAL.md",
  "CONTENT_PLAN.md",
  "OPERATIONS_REVIEW_TEMPLATE.md",
];

function fail(message) {
  console.error(`Pages artifact build failed: ${message}`);
  process.exit(1);
}

function copyFile(file) {
  const from = path.join(root, file);
  const to = path.join(distDir, file);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const uniquePublicFiles = [...new Set(publicFiles)];
const missing = uniquePublicFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail(`missing public file(s): ${missing.join(", ")}`);

for (const file of denyList) {
  if (uniquePublicFiles.includes(file)) fail(`private file listed for public artifact: ${file}`);
}

console.log(checkOnly ? "Pages artifact build check" : "Pages artifact build");
console.log(`Public files: ${uniquePublicFiles.length}`);

if (checkOnly) {
  console.log("\nOK: pages artifact file list is valid.");
  process.exit(0);
}

const resolvedDist = path.resolve(distDir);
if (resolvedDist === root || !resolvedDist.startsWith(root + path.sep)) {
  fail(`refusing to clean unsafe dist path: ${resolvedDist}`);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
for (const file of uniquePublicFiles) copyFile(file);

const leaked = denyList.filter((file) => fs.existsSync(path.join(distDir, file)));
if (leaked.length) fail(`private file(s) copied to dist: ${leaked.join(", ")}`);

console.log(`Wrote ${path.relative(root, distDir)}.`);
