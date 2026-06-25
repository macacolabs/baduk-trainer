const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const requiredPublicPages = [
  "index.html",
  "about.html",
  "learn.html",
  "faq.html",
  "privacy.html",
  "terms.html",
  "adsense-checklist.html",
  "search-console.html",
];

const articleFiles = [
  "baduk-beginner.html",
  "baduk-9x9-beginner.html",
  "baduk-atari.html",
  "baduk-atari-practice.html",
  "baduk-liberties.html",
  "baduk-glossary.html",
  "baduk-opening.html",
  "baduk-opening-corner.html",
  "baduk-ai-review.html",
  "baduk-life-and-death.html",
  "baduk-life-and-death-practice.html",
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-threats.html",
  "omok-open-three.html",
  "omok-ai-difficulty.html",
];

const externalTasks = [
  "Search Console URL prefix property registration",
  "Search Console ownership verification",
  "sitemap.xml submission",
  "AdSense site registration",
  "AdSense approval review",
];

const adsenseApproved = process.env.ADSENSE_STATUS === "approved";
const adsenseMode = adsenseApproved ? "approved" : "pre-approval";

function filePath(file) {
  return path.join(root, file);
}

function exists(file) {
  return fs.existsSync(filePath(file));
}

function read(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pass(condition) {
  return condition ? "PASS" : "TODO";
}

const htmlText = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html") || file.endsWith(".js"))
  .map((file) => (exists(file) ? read(file) : ""))
  .join("\n");

const pagesReady = requiredPublicPages.every(exists);
const articleStats = articleFiles.map((file) => {
  const html = exists(file) ? read(file) : "";
  return {
    file,
    exists: exists(file),
    chars: html ? textOnly(html).length : 0,
    related: /class="article-card-grid related-learning"/.test(html),
  };
});
const articlesReady = articleStats.length >= 10 && articleStats.every((item) => item.exists && item.chars >= 650 && item.related);
const hasAdsenseScript = /adsbygoogle|pagead2\.googlesyndication\.com|google_ad_client/.test(htmlText);
const noAdsenseScript = !hasAdsenseScript;
const adSlots = (htmlText.match(/class="ad-slot/g) || []).length;
const policyLinked = exists("index.html") && ["about.html", "privacy.html", "terms.html", "adsense-checklist.html"].every((file) => read("index.html").includes(`href="${file}"`));
const sitemapReady = exists("sitemap.xml") && ["about.html", "learn.html", "faq.html", ...articleFiles].every((file) => read("sitemap.xml").includes(file));
const robotsReady = exists("robots.txt") && read("robots.txt").includes("sitemap.xml");

const rows = [
  ["Public trust pages", pagesReady, `${requiredPublicPages.length} pages required`],
  ["Learning articles", articlesReady, `${articleFiles.length} articles, minimum 650 chars and related links`],
  ["Policy links", policyLinked, "about/privacy/terms/checklist reachable from home"],
  ["Sitemap", sitemapReady, "main pages and learning articles listed"],
  ["Robots", robotsReady, "sitemap advertised"],
  ["Ad placeholders", adSlots >= 2, `${adSlots} ad-slot placeholders found`],
  adsenseApproved
    ? ["Ad script after approval", hasAdsenseScript, hasAdsenseScript ? "live ad script detected in approved mode" : "approved mode is set, but no live ad script is installed yet"]
    : ["No live ad script before approval", noAdsenseScript, "AdSense code should be added only after approval"],
];

console.log("Monetization readiness report");
console.log(`AdSense mode: ${adsenseMode}`);
console.log("");
console.log("| item | status | evidence |");
console.log("| --- | --- | --- |");
for (const [label, ok, evidence] of rows) {
  console.log(`| ${label} | ${pass(ok)} | ${evidence} |`);
}

const blockers = rows.filter(([, ok]) => !ok);
console.log("");
if (blockers.length) {
  console.log("Internal blockers:");
  for (const [label, , evidence] of blockers) console.log(`- ${label}: ${evidence}`);
} else {
  console.log("Internal blockers: none");
}

console.log("");
console.log("External tasks still require account access:");
for (const task of externalTasks) console.log(`- ${task}`);

console.log("");
console.log("Useful commands:");
console.log("- node scripts/preflight.cjs --live");
console.log("- node scripts/content-report.cjs");
console.log("- node scripts/external-account-status.cjs");
console.log("- $env:ADSENSE_STATUS='approved'; node scripts/monetization-report.cjs");
console.log("");
console.log("Submission packet:");
console.log("- SUBMISSION_PACKET.md");
