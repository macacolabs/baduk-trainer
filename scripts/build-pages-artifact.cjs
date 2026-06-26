const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
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
  "icon.svg",
  "social-card.svg",
  "offline.html",
  "sw.js",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
];

const optionalPublicFiles = [
  "ads.txt",
].filter((file) => fs.existsSync(path.join(root, file)));

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
  "operations-reviews",
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

const uniquePublicFiles = [...new Set([...publicFiles, ...optionalPublicFiles])];
const missing = uniquePublicFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail(`missing public file(s): ${missing.join(", ")}`);

function isDenied(file) {
  return denyList.some((blocked) => file === blocked || file.startsWith(`${blocked}/`));
}

const deniedPublicFiles = uniquePublicFiles.filter(isDenied);
if (deniedPublicFiles.length) {
  fail(`private file listed for public artifact: ${deniedPublicFiles.join(", ")}`);
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

if (process.env.ADSENSE_STATUS === "approved") {
  const result = spawnSync(process.execPath, ["scripts/inject-adsense.cjs", "--dir", "dist"], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) fail("AdSense injection failed.");
}

const leaked = denyList.filter((file) => fs.existsSync(path.join(distDir, file)));
if (leaked.length) fail(`private file(s) copied to dist: ${leaked.join(", ")}`);

console.log(`Wrote ${path.relative(root, distDir)}.`);
