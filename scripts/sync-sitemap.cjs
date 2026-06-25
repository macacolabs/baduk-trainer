const fs = require("fs");
const path = require("path");
const { siteBase, sitemapPages } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const sitemapPath = path.join(root, "sitemap.xml");
const writeMode = process.argv.includes("--write");
const today = new Date().toISOString().slice(0, 10);

function fail(message) {
  console.error(`Sitemap sync failed: ${message}`);
  process.exit(1);
}

function localPathForUrl(url) {
  if (url === siteBase) return "index.html";
  if (!url.startsWith(siteBase)) return null;
  return url.slice(siteBase.length);
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)].map(
    ([, loc, lastmod]) => ({ loc, lastmod }),
  );
}

function renderSitemap(entries) {
  const body = entries
    .map(
      (entry) => [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}

if (!fs.existsSync(sitemapPath)) fail("sitemap.xml is missing.");

const current = parseSitemap(fs.readFileSync(sitemapPath, "utf8"));
if (!current.length) fail("sitemap.xml has no valid URL entries.");

const currentDates = new Map(current.map((entry) => [entry.loc, entry.lastmod]));
const expected = [siteBase, ...sitemapPages.map((file) => `${siteBase}${file}`)].map((loc) => ({
  loc,
  lastmod: currentDates.get(loc) || today,
}));

const expectedLocs = new Set(expected.map((entry) => entry.loc));
const currentLocs = current.map((entry) => entry.loc);
const currentSet = new Set(currentLocs);
const duplicateLocs = currentLocs.filter((loc, index) => currentLocs.indexOf(loc) !== index);
const missingLocs = expected.filter((entry) => !currentSet.has(entry.loc)).map((entry) => entry.loc);
const extraLocs = current.filter((entry) => !expectedLocs.has(entry.loc)).map((entry) => entry.loc);
const missingFiles = expected
  .map((entry) => localPathForUrl(entry.loc))
  .filter((file) => file && !fs.existsSync(path.join(root, file)));

const errors = [];
if (duplicateLocs.length) errors.push(`duplicate URLs: ${[...new Set(duplicateLocs)].join(", ")}`);
if (missingLocs.length) errors.push(`missing URLs: ${missingLocs.join(", ")}`);
if (extraLocs.length) errors.push(`extra URLs: ${extraLocs.join(", ")}`);
if (missingFiles.length) errors.push(`listed files missing: ${missingFiles.join(", ")}`);

if (writeMode) {
  if (missingFiles.length) fail(`cannot write sitemap with missing files: ${missingFiles.join(", ")}`);
  fs.writeFileSync(sitemapPath, renderSitemap(expected));
  console.log("Sitemap sync");
  console.log(`Wrote ${expected.length} URLs to sitemap.xml.`);
  if (missingLocs.length || extraLocs.length || duplicateLocs.length) {
    console.log("Resolved:");
    if (missingLocs.length) console.log(`- added ${missingLocs.length} missing URL(s)`);
    if (extraLocs.length) console.log(`- removed ${extraLocs.length} extra URL(s)`);
    if (duplicateLocs.length) console.log(`- removed ${new Set(duplicateLocs).size} duplicate URL(s)`);
  }
  process.exit(0);
}

console.log("Sitemap sync check");
console.log(`Expected URLs: ${expected.length}`);
console.log(`Current URLs: ${current.length}`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  console.error("\nRun this after fixing the file list:");
  console.error("- node scripts/sync-sitemap.cjs --write");
  process.exit(1);
}

console.log("\nOK: sitemap.xml matches site-content.cjs.");
