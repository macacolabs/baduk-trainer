const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dirIndex = process.argv.indexOf("--dir");
const targetArg = dirIndex === -1 ? "." : process.argv[dirIndex + 1];
const targetDir = path.resolve(root, targetArg || ".");
const adsenseApproved = process.env.ADSENSE_STATUS === "approved";
const adScriptPattern = /adsbygoogle|pagead2\.googlesyndication\.com|google_ad_client/;
const adUnitPattern = /class="[^"]*\badsbygoogle\b[^"]*"/g;
const errors = [];

function htmlFilesIn(dir, recursive) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) files.push(...htmlFilesIn(file, recursive));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function fail(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function adUnitInsideAdSlot(html, index) {
  const before = html.slice(0, index);
  const openIndex = before.lastIndexOf('<aside class="ad-slot');
  if (openIndex === -1) return false;
  const closeIndex = before.lastIndexOf("</aside>");
  return closeIndex < openIndex;
}

let adSlotCount = 0;
let adUnitCount = 0;
let hasAdScript = false;

if (targetDir !== root && !targetDir.startsWith(root + path.sep)) {
  errors.push(`Refusing unsafe target dir: ${targetDir}`);
}

if (!fs.existsSync(targetDir)) {
  errors.push(`Target dir does not exist: ${path.relative(root, targetDir)}`);
}

const htmlFiles = errors.length ? [] : htmlFilesIn(targetDir, dirIndex !== -1);

for (const file of htmlFiles) {
  const html = read(file);
  const slots = html.match(/class="ad-slot/g) || [];
  adSlotCount += slots.length;
  hasAdScript = hasAdScript || adScriptPattern.test(html);

  const matches = [...html.matchAll(adUnitPattern)];
  adUnitCount += matches.length;

  for (const match of matches) {
    if (!adUnitInsideAdSlot(html, match.index || 0)) {
      fail(file, "adsbygoogle ad unit must be inside an ad-slot aside.");
    }
  }

  if (/<aside class="ad-slot[\s\S]*?(다음|정답 보기|되돌리기|새 대국|착수)[\s\S]*?<\/aside>/.test(html)) {
    fail(file, "ad-slot should not contain game control text.");
  }
}

if (adSlotCount < 2) {
  errors.push(`Expected at least 2 ad-slot placeholders, found ${adSlotCount}.`);
}

if (adsenseApproved) {
  if (!hasAdScript) errors.push("ADSENSE_STATUS=approved is set, but no AdSense script was found.");
  if (adUnitCount < 1) errors.push("ADSENSE_STATUS=approved is set, but no adsbygoogle ad unit was found.");
} else if (hasAdScript || adUnitCount > 0) {
  errors.push("AdSense script or ad unit found before approval.");
}

console.log("Ad placement check");
console.log(`Target: ${path.relative(root, targetDir) || "."}`);
console.log(`AdSense mode: ${adsenseApproved ? "approved" : "pre-approval"}`);
console.log(`HTML files: ${htmlFiles.length}`);
console.log(`ad-slot placeholders: ${adSlotCount}`);
console.log(`adsbygoogle units: ${adUnitCount}`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: ad placement checks passed.");
