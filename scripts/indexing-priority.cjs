const fs = require("fs");
const path = require("path");
const { siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const sitemapPath = path.join(root, "sitemap.xml");

const corePaths = new Map([
  ["", { score: 130, reason: "메인 앱: 브랜드와 실제 사용 경험" }],
  ["learn.html", { score: 125, reason: "학습 허브: 검색 유입을 내부 글로 분배" }],
  ["faq.html", { score: 120, reason: "질문형 검색 유입" }],
  ["baduk-beginner.html", { score: 112, reason: "바둑 입문 핵심 글" }],
  ["baduk-atari.html", { score: 111, reason: "단수 검색 핵심 글" }],
  ["baduk-liberties.html", { score: 110, reason: "활로 검색 핵심 글" }],
  ["baduk-ko-rule.html", { score: 109, reason: "패 규칙 검색 핵심 글" }],
  ["baduk-territory-scoring.html", { score: 107, reason: "집 계산 검색 핵심 글" }],
  ["omok-strategy.html", { score: 108, reason: "오목 입문 핵심 글" }],
  ["omok-ai-difficulty.html", { score: 106, reason: "오목 AI 난이도 검색 글" }],
]);

const conversionPaths = new Map([
  ["about.html", "서비스 신뢰 페이지"],
  ["privacy.html", "AdSense 심사 정책 페이지"],
  ["terms.html", "AdSense 심사 정책 페이지"],
  ["adsense-checklist.html", "AdSense 신청 전 공개 체크 페이지"],
  ["search-console.html", "Search Console 안내 페이지"],
]);

function fail(message) {
  console.error(`Indexing priority check failed: ${message}`);
  process.exit(1);
}

function localPathFromUrl(url) {
  if (!url.startsWith(siteBase)) return null;
  const relative = url.slice(siteBase.length) || "index.html";
  return relative.endsWith("/") ? `${relative}index.html` : relative;
}

function readTitle(file) {
  if (!file.endsWith(".html")) return "";
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) return "";
  const html = fs.readFileSync(fullPath, "utf8");
  const h1 = html.match(/<h1>([^<]+)<\/h1>/);
  const title = html.match(/<title>([^<]+)<\/title>/);
  return (h1?.[1] || title?.[1] || "").trim();
}

function priorityFor(pathname, lastmod) {
  const freshBonus = /^2026-06-2[4-9]/.test(lastmod) ? 5 : 0;
  if (corePaths.has(pathname)) {
    const core = corePaths.get(pathname);
    return { score: core.score + freshBonus, reason: core.reason };
  }
  if (conversionPaths.has(pathname)) return { score: 80 + freshBonus, reason: conversionPaths.get(pathname) };
  if (pathname.startsWith("baduk-")) return { score: 70 + freshBonus, reason: "바둑 롱테일 학습 글" };
  if (pathname.startsWith("omok-")) return { score: 68 + freshBonus, reason: "오목 롱테일 학습 글" };
  return { score: 40 + freshBonus, reason: "보조 페이지" };
}

if (!fs.existsSync(sitemapPath)) fail("sitemap.xml is missing.");

const sitemap = fs.readFileSync(sitemapPath, "utf8");
const entries = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)].map(
  ([, url, lastmod]) => {
    const pathname = url.slice(siteBase.length);
    const localPath = localPathFromUrl(url);
    const priority = priorityFor(pathname, lastmod);
    return {
      url,
      pathname,
      localPath,
      title: localPath ? readTitle(localPath) : "",
      lastmod,
      ...priority,
    };
  },
);

if (!entries.length) fail("no sitemap URLs found.");

const missingCore = [...corePaths.keys()]
  .map((pathname) => `${siteBase}${pathname}`)
  .filter((url) => !entries.some((entry) => entry.url === url));

if (missingCore.length) {
  console.error("Missing core sitemap URLs:");
  for (const url of missingCore) console.error(`- ${url}`);
  process.exit(1);
}

for (const entry of entries) {
  if (entry.localPath && !fs.existsSync(path.join(root, entry.localPath))) {
    fail(`sitemap points to missing file: ${entry.localPath}`);
  }
}

const ranked = entries
  .slice()
  .sort((a, b) => b.score - a.score || b.lastmod.localeCompare(a.lastmod) || a.url.localeCompare(b.url));

console.log("Search Console indexing priority");
console.log(`Checked ${entries.length} sitemap URLs.`);
console.log("");
console.log("| rank | lastmod | url | why | title |");
console.log("| ---: | --- | --- | --- | --- |");

for (const [index, entry] of ranked.slice(0, 12).entries()) {
  console.log(`| ${index + 1} | ${entry.lastmod} | ${entry.url} | ${entry.reason} | ${entry.title || "-"} |`);
}

console.log("");
console.log("Recommended first manual indexing requests:");
for (const entry of ranked.slice(0, 8)) {
  console.log(`- ${entry.url}`);
}

console.log("");
console.log("After Search Console registration:");
console.log("- Submit sitemap.xml first.");
console.log("- Request indexing for the first 8 URLs above.");
console.log("- Re-run this after adding or improving articles.");
