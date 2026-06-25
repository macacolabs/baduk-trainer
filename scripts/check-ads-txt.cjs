const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const adsTxtPath = path.join(root, "ads.txt");
const adsenseApproved = process.env.ADSENSE_STATUS === "approved";
const publisherId = (process.env.ADSENSE_PUBLISHER_ID || "").trim().replace(/^ca-/, "");
const requiredSellerId = "f08c47fec0942fa0";
const errors = [];
const warnings = [];

function lineParts(line) {
  return line.split(",").map((part) => part.trim());
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const exists = fs.existsSync(adsTxtPath);
const lines = exists
  ? fs.readFileSync(adsTxtPath, "utf8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"))
  : [];

const googleLines = lines.filter((line) => /^google\.com\s*,/i.test(line));

if (!adsenseApproved && exists) {
  fail("ads.txt exists before AdSense approval. Add it only when Google asks for it.");
}

if (exists && !googleLines.length) {
  fail("ads.txt exists, but no google.com seller line was found.");
}

for (const line of googleLines) {
  const parts = lineParts(line);
  if (parts.length < 3) fail(`invalid ads.txt line: ${line}`);
  if (parts[0].toLowerCase() !== "google.com") fail(`expected google.com seller domain: ${line}`);
  if (!/^pub-\d+$/.test(parts[1])) fail(`expected publisher id like pub-1234567890123456: ${line}`);
  if (!["DIRECT", "RESELLER"].includes(parts[2])) fail(`expected DIRECT or RESELLER relationship: ${line}`);
  if (parts[3] && parts[3] !== requiredSellerId) fail(`expected Google seller id ${requiredSellerId}: ${line}`);
}

if (publisherId) {
  const expectedId = `pub-${publisherId.replace(/^pub-/, "")}`;
  if (!googleLines.some((line) => lineParts(line)[1] === expectedId)) {
    fail(`ads.txt does not contain ADSENSE_PUBLISHER_ID ${expectedId}.`);
  }
}

if (adsenseApproved && !exists) {
  warn("ADSENSE_STATUS=approved is set, but ads.txt is missing. Add it if AdSense asks for it.");
}

console.log("ads.txt check");
console.log(`AdSense mode: ${adsenseApproved ? "approved" : "pre-approval"}`);
console.log(`ads.txt: ${exists ? "present" : "missing"}`);
console.log(`google.com seller lines: ${googleLines.length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const item of warnings) console.log(`- ${item}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const item of errors) console.error(`- ${item}`);
  process.exit(1);
}

console.log("\nOK: ads.txt checks passed.");
