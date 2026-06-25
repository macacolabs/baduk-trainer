const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const adsTxtPath = path.join(root, "ads.txt");
const requiredSellerId = "f08c47fec0942fa0";
const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return "";
  return (args[index + 1] || "").trim();
}

function usage() {
  console.log("\nUsage:");
  console.log('  node scripts/prepare-ads-txt.cjs --check --line "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"');
  console.log('  node scripts/prepare-ads-txt.cjs --write --line "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"');
  console.log("  $env:ADS_TXT_LINE='google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0'");
  console.log("  node scripts/prepare-ads-txt.cjs --write");
}

function fail(message) {
  console.error(`ads.txt preparation failed: ${message}`);
  usage();
  process.exit(1);
}

function normalizeLine(line) {
  return line.split(",").map((part) => part.trim()).filter(Boolean).join(", ");
}

function validateSellerLine(rawLine) {
  const line = normalizeLine(rawLine);
  const parts = line.split(",").map((part) => part.trim());
  if (parts.length < 3 || parts.length > 4) fail("seller line must have 3 or 4 comma-separated parts.");
  if (parts[0].toLowerCase() !== "google.com") fail("seller domain must be google.com.");
  if (!/^pub-\d+$/.test(parts[1])) fail("publisher id must look like pub-1234567890123456.");
  if (!["DIRECT", "RESELLER"].includes(parts[2])) fail("relationship must be DIRECT or RESELLER.");
  if (parts[3] && parts[3] !== requiredSellerId) fail(`Google seller id must be ${requiredSellerId}.`);
  return line;
}

const writeMode = args.includes("--write");
const checkMode = args.includes("--check") || !writeMode;
const force = args.includes("--force");
const rawLine = argValue("--line") || (process.env.ADS_TXT_LINE || "").trim();

if (!rawLine) fail("provide --line or ADS_TXT_LINE.");
if (writeMode && checkMode && args.includes("--check")) fail("use either --check or --write, not both.");

const line = validateSellerLine(rawLine);
const existing = fs.existsSync(adsTxtPath) ? fs.readFileSync(adsTxtPath, "utf8").trim() : "";

console.log("ads.txt preparation");
console.log(`mode: ${writeMode ? "write" : "check"}`);
console.log(`seller line: ${line}`);

if (!writeMode) {
  console.log("\nOK: seller line is valid. No file was written.");
  process.exit(0);
}

if (existing && existing !== line && !force) {
  fail("ads.txt already exists with different content. Re-run with --force only after checking the current file.");
}

fs.writeFileSync(adsTxtPath, `${line}\n`, "utf8");

console.log(`ads.txt written: ${path.relative(root, adsTxtPath)}`);
console.log("\nNext checks:");
console.log("$env:ADSENSE_STATUS='approved'");
console.log("node scripts/check-ads-txt.cjs");
console.log("node scripts/check-ad-placement.cjs");
