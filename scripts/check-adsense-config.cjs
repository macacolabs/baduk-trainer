const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const dirArgIndex = args.indexOf("--dir");
const targetDir = dirArgIndex === -1 ? "" : args[dirArgIndex + 1] || "";
const adsTxtPath = path.join(root, "ads.txt");
const approved = process.env.ADSENSE_STATUS === "approved";
const requireAdsTxt = process.env.ADSENSE_REQUIRE_ADS_TXT === "1";
const rawPublisherId = (process.env.ADSENSE_PUBLISHER_ID || "").trim();
const rawSlotId = (process.env.ADSENSE_AD_SLOT_ID || "").trim();
const errors = [];
const warnings = [];

function normalizePublisherId(value) {
  if (/^ca-pub-\d{8,}$/.test(value)) return value;
  if (/^pub-\d{8,}$/.test(value)) return `ca-${value}`;
  return "";
}

function sellerIdFromClient(clientId) {
  return clientId.replace(/^ca-/, "");
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function listHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listHtmlFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

function checkAdsTxt(expectedSellerId) {
  const exists = fs.existsSync(adsTxtPath);
  if (!exists) {
    const message = "ads.txt is missing. Add it after AdSense asks for it.";
    if (requireAdsTxt) fail(message);
    else warn(message);
    return;
  }

  const lines = fs
    .readFileSync(adsTxtPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  const googleLines = lines.filter((line) => /^google\.com\s*,/i.test(line));
  const hasExpectedLine = googleLines.some((line) => {
    const parts = line.split(",").map((part) => part.trim());
    return parts[0].toLowerCase() === "google.com" && parts[1] === expectedSellerId;
  });

  if (!hasExpectedLine) fail(`ads.txt does not contain google.com, ${expectedSellerId}.`);
}

function checkDist(expectedClientId, expectedSlotId, dir) {
  const absoluteDir = path.resolve(root, dir);
  if (!absoluteDir.startsWith(root)) {
    fail(`--dir must stay inside project root: ${dir}`);
    return;
  }
  if (!fs.existsSync(absoluteDir)) {
    fail(`--dir does not exist: ${dir}`);
    return;
  }

  const htmlFiles = listHtmlFiles(absoluteDir);
  let scriptCount = 0;
  let unitCount = 0;
  let slotCount = 0;
  const otherClients = new Set();
  const otherSlots = new Set();

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    if (html.includes(`client=${expectedClientId}`)) scriptCount += 1;
    const clientMatches = html.matchAll(/data-ad-client="([^"]+)"/g);
    for (const match of clientMatches) {
      if (match[1] === expectedClientId) unitCount += 1;
      else otherClients.add(match[1]);
    }
    const slotMatches = html.matchAll(/data-ad-slot="([^"]+)"/g);
    for (const match of slotMatches) {
      if (match[1] === expectedSlotId) slotCount += 1;
      else otherSlots.add(match[1]);
    }
  }

  if (!htmlFiles.length) fail(`--dir has no HTML files: ${dir}`);
  if (!scriptCount) fail(`dist HTML has no AdSense script for ${expectedClientId}.`);
  if (!unitCount) fail(`dist HTML has no ad unit for ${expectedClientId}.`);
  if (!slotCount) fail(`dist HTML has no ad slot ${expectedSlotId}.`);
  if (otherClients.size) fail(`dist HTML contains unexpected ad clients: ${[...otherClients].join(", ")}`);
  if (otherSlots.size) fail(`dist HTML contains unexpected ad slots: ${[...otherSlots].join(", ")}`);
}

console.log("AdSense config check");
console.log(`mode: ${approved ? "approved" : "pre-approval"}`);

if (!approved) {
  if (rawPublisherId || rawSlotId) {
    warn("AdSense env vars are set before approval. They are ignored unless ADSENSE_STATUS=approved.");
  }
} else {
  const publisherId = normalizePublisherId(rawPublisherId);
  if (!publisherId) fail("Set ADSENSE_PUBLISHER_ID to ca-pub-123... or pub-123...");
  if (!/^\d{6,}$/.test(rawSlotId)) fail("Set ADSENSE_AD_SLOT_ID to a numeric ad slot id.");

  if (publisherId && /^\d{6,}$/.test(rawSlotId)) {
    const sellerId = sellerIdFromClient(publisherId);
    console.log(`publisher: ${publisherId}`);
    console.log(`slot: ${rawSlotId}`);
    checkAdsTxt(sellerId);
    if (targetDir) checkDist(publisherId, rawSlotId, targetDir);
  }
}

if (warnings.length) {
  console.log("\nWarnings:");
  for (const item of warnings) console.log(`- ${item}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const item of errors) console.error(`- ${item}`);
  process.exit(1);
}

console.log("\nOK: AdSense config checks passed.");
