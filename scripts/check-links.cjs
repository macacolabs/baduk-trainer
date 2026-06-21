const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteBase = "https://macacolabs.github.io/baduk-trainer/";
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function normalizeLocalTarget(rawHref) {
  const href = rawHref.trim();
  if (!href || href.startsWith("#")) return null;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) {
    if (!href.startsWith(siteBase)) return null;
    return href.slice(siteBase.length) || "index.html";
  }
  return href;
}

function stripHashAndQuery(target) {
  return target.split("#")[0].split("?")[0];
}

function checkTarget(sourceFile, attrName, rawTarget) {
  const normalized = normalizeLocalTarget(rawTarget);
  if (!normalized) return;
  const clean = stripHashAndQuery(normalized);
  if (!clean || clean.endsWith("/")) return;
  if (!exists(clean)) errors.push(`${sourceFile}: ${attrName} target missing: ${rawTarget}`);
}

const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();

for (const file of htmlFiles) {
  const html = read(file);
  for (const match of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    checkTarget(file, match[1], match[2]);
  }
}

if (exists("sitemap.xml")) {
  const sitemap = read("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!urls.length) errors.push("sitemap.xml: no URLs found");
  for (const url of urls) {
    if (!url.startsWith(siteBase)) {
      errors.push(`sitemap.xml: URL outside site base: ${url}`);
      continue;
    }
    const localFile = url.slice(siteBase.length) || "index.html";
    if (!exists(localFile)) errors.push(`sitemap.xml: listed file missing: ${localFile}`);
  }
}

console.log("Link check");
console.log(`Checked ${htmlFiles.length} HTML files.`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: internal links and sitemap targets exist.");
