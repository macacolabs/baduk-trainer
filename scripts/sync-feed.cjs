const fs = require("fs");
const path = require("path");
const { articleFiles, feedItemLimit, siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const feedPath = path.join(root, "feed.xml");
const sitemapPath = path.join(root, "sitemap.xml");
const writeMode = process.argv.includes("--write");

function fail(message) {
  console.error(`Feed sync failed: ${message}`);
  process.exit(1);
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function extract(html, pattern, fallback = "") {
  const match = html.match(pattern);
  return match ? match[1].trim() : fallback;
}

function parseSitemapDates() {
  if (!fs.existsSync(sitemapPath)) fail("sitemap.xml is missing.");
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  return new Map([...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(([, loc, lastmod]) => [loc, lastmod]));
}

function articleItem(file, sitemapDates) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) fail(`article file is missing: ${file}`);
  const html = fs.readFileSync(fullPath, "utf8");
  const url = `${siteBase}${file}`;
  return {
    file,
    url,
    title: extract(html, /<h1>([^<]+)<\/h1>/, file),
    description: extract(html, /<meta\s+name="description"\s+content="([^"]+)"/, ""),
    lastmod: sitemapDates.get(url) || "2026-06-21",
  };
}

function renderFeed(items) {
  const latest = items.map((item) => item.lastmod).sort().at(-1);
  const itemXml = items
    .map((item) => [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${item.url}</link>`,
      `      <guid>${item.url}</guid>`,
      `      <description>${escapeXml(item.description || item.title)}</description>`,
      `      <pubDate>${new Date(`${item.lastmod}T00:00:00Z`).toUTCString()}</pubDate>`,
      "    </item>",
    ].join("\n"))
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>큰돌 학습 글</title>",
    `    <link>${siteBase}</link>`,
    "    <description>바둑과 오목을 배우는 큰돌 학습 글 업데이트입니다.</description>",
    "    <language>ko</language>",
    `    <lastBuildDate>${new Date(`${latest}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
    itemXml,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

const sitemapDates = parseSitemapDates();
const items = articleFiles
  .map((file) => articleItem(file, sitemapDates))
  .sort((a, b) => b.lastmod.localeCompare(a.lastmod) || a.file.localeCompare(b.file));
const feedItems = items.slice(0, feedItemLimit);
const nextFeed = renderFeed(feedItems);

if (writeMode) {
  fs.writeFileSync(feedPath, nextFeed);
  console.log("Feed sync");
  console.log(`Wrote ${feedItems.length} latest article items to feed.xml (${items.length} total articles).`);
  process.exit(0);
}

console.log("Feed sync check");
console.log(`Expected items: ${feedItems.length} latest articles (${items.length} total articles).`);

if (!fs.existsSync(feedPath)) {
  fail("feed.xml is missing. Run: node scripts/sync-feed.cjs --write");
}

const current = fs.readFileSync(feedPath, "utf8");
if (current !== nextFeed) {
  console.error("\nErrors:");
  console.error("- feed.xml is out of sync with article files or sitemap lastmod dates.");
  console.error("\nRun:");
  console.error("- node scripts/sync-feed.cjs --write");
  process.exit(1);
}

console.log("\nOK: feed.xml matches current latest learning articles.");
