const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const status = process.env.ADSENSE_STATUS || "";
const approved = status === "approved";
const dirIndex = process.argv.indexOf("--dir");
const targetArg = dirIndex === -1 ? "dist" : process.argv[dirIndex + 1];
const targetDir = path.resolve(root, targetArg || "dist");
const rawPublisherId = (process.env.ADSENSE_PUBLISHER_ID || "").trim();
const adSlotId = (process.env.ADSENSE_AD_SLOT_ID || "").trim();

function fail(message) {
  console.error(`AdSense injection failed: ${message}`);
  process.exit(1);
}

function normalizePublisherId(value) {
  if (/^ca-pub-\d+$/.test(value)) return value;
  if (/^pub-\d+$/.test(value)) return `ca-${value}`;
  return "";
}

function htmlFilesIn(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...htmlFilesIn(file));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

if (!approved) {
  console.log("AdSense injection skipped: ADSENSE_STATUS is not approved.");
  process.exit(0);
}

if (targetDir === root || !targetDir.startsWith(root + path.sep)) {
  fail(`refusing unsafe target dir: ${targetDir}`);
}

if (!fs.existsSync(targetDir)) {
  fail(`target dir does not exist: ${path.relative(root, targetDir)}`);
}

const publisherId = normalizePublisherId(rawPublisherId);
if (!publisherId) {
  fail("set ADSENSE_PUBLISHER_ID to pub-123... or ca-pub-123...");
}

if (!/^\d+$/.test(adSlotId)) {
  fail("set ADSENSE_AD_SLOT_ID to the numeric display ad slot id.");
}

const adScript = `    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>`;
const adUnit = `\n        <span>광고</span>\n        <ins class="adsbygoogle"\n          style="display:block"\n          data-ad-client="${publisherId}"\n          data-ad-slot="${adSlotId}"\n          data-ad-format="auto"\n          data-full-width-responsive="true"></ins>\n        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>\n      `;
const adSlotPattern = /(<aside\s+class="[^"]*\bad-slot\b[^"]*"[^>]*>)[\s\S]*?(<\/aside>)/g;

let pagesWithSlots = 0;
let injectedPages = 0;
let injectedAdUnits = 0;
let existingAdUnits = 0;

for (const file of htmlFilesIn(targetDir)) {
  let html = fs.readFileSync(file, "utf8");
  if (!/class="[^"]*\bad-slot\b/.test(html)) continue;

  pagesWithSlots += 1;

  if (!/pagead2\.googlesyndication\.com/.test(html)) {
    if (!/<\/head>/i.test(html)) fail(`${path.relative(root, file)}: missing </head>`);
    html = html.replace(/<\/head>/i, `${adScript}\n  </head>`);
  }

  let changed = false;
  html = html.replace(adSlotPattern, (match, open, close) => {
    if (/class="[^"]*\badsbygoogle\b[^"]*"/.test(match)) {
      existingAdUnits += 1;
      return match;
    }
    changed = true;
    injectedAdUnits += 1;
    return `${open}${adUnit}${close}`;
  });

  if (changed) {
    injectedPages += 1;
    fs.writeFileSync(file, html);
  }
}

if (!pagesWithSlots) fail("no ad-slot placeholders found in artifact.");
if (!injectedAdUnits && !existingAdUnits) fail("no AdSense units were injected or found.");

console.log("AdSense injection");
console.log(`Target: ${path.relative(root, targetDir)}`);
console.log(`Pages with ad slots: ${pagesWithSlots}`);
console.log(`Pages updated: ${injectedPages}`);
console.log(`Ad units injected: ${injectedAdUnits}`);
console.log(`Ad units already present: ${existingAdUnits}`);
