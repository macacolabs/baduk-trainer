const fs = require("fs");
const path = require("path");
const { siteBase, sitemapPages } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const seoPages = ["index.html", ...sitemapPages];
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function extract(html, regex) {
  return html.match(regex)?.[1]?.trim() || "";
}

function expectedCanonical(file) {
  return file === "index.html" ? siteBase : `${siteBase}${file}`;
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const file of seoPages) {
  check(exists(file), `${file}: missing SEO page`);
}

const sitemap = exists("sitemap.xml") ? read("sitemap.xml") : "";
const seenTitles = new Map();
const seenCanonicals = new Map();

for (const file of seoPages) {
  if (!exists(file)) continue;
  const html = read(file);
  const title = extract(html, /<title>([^<]+)<\/title>/);
  const description = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/);
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  const expectedUrl = expectedCanonical(file);

  check(title.length >= 2, `${file}: missing title text`);
  warn(title.length <= 80, `${file}: title is long (${title.length} chars)`);
  check(description.length >= 35, `${file}: description is too short or missing`);
  warn(description.length <= 180, `${file}: description is long (${description.length} chars)`);
  check(canonical === expectedUrl, `${file}: canonical mismatch. Expected ${expectedUrl}, got ${canonical || "(missing)"}`);
  check(canonical.startsWith("https://"), `${file}: canonical must be absolute https`);
  check(sitemap.includes(`<loc>${expectedUrl}</loc>`), `${file}: sitemap missing canonical URL`);

  if (title) {
    const duplicate = seenTitles.get(title);
    warn(!duplicate, `${file}: duplicate title with ${duplicate}`);
    seenTitles.set(title, file);
  }

  if (canonical) {
    const duplicate = seenCanonicals.get(canonical);
    check(!duplicate, `${file}: duplicate canonical with ${duplicate}`);
    seenCanonicals.set(canonical, file);
  }
}

if (exists("index.html")) {
  const index = read("index.html");
  const requiredOg = ["og:type", "og:title", "og:description", "og:url"];
  for (const property of requiredOg) {
    check(index.includes(`property="${property}"`), `index.html: missing ${property}`);
  }
  check(index.includes('rel="alternate"') && index.includes("feed.xml"), "index.html: missing RSS alternate link");
  check(index.includes(`<meta property="og:url" content="${siteBase}"`), "index.html: og:url does not match siteBase");
}

console.log("SEO metadata check");
console.log(`Checked ${seoPages.length} indexed pages.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: SEO metadata checks passed.");
