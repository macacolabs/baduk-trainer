const fs = require("fs");
const path = require("path");
const { siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const packetPath = path.join(root, "SUBMISSION_PACKET.md");
const sitemapPath = path.join(root, "sitemap.xml");

const requiredPacketUrls = [
  siteBase,
  `${siteBase}sitemap.xml`,
  `${siteBase}about.html`,
  `${siteBase}privacy.html`,
  `${siteBase}terms.html`,
  `${siteBase}adsense-checklist.html`,
  `${siteBase}learn.html`,
  `${siteBase}faq.html`,
  `${siteBase}baduk-beginner.html`,
  `${siteBase}baduk-atari.html`,
  `${siteBase}baduk-liberties.html`,
  `${siteBase}baduk-ko-rule.html`,
  `${siteBase}baduk-territory-scoring.html`,
  `${siteBase}omok-strategy.html`,
  `${siteBase}omok-ai-difficulty.html`,
];

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const packet = fs.readFileSync(packetPath, "utf8");
const sitemap = fs.readFileSync(sitemapPath, "utf8");

for (const url of requiredPacketUrls) {
  check(packet.includes(url), `SUBMISSION_PACKET.md: missing ${url}`);
}

for (const url of requiredPacketUrls.filter((url) => url.endsWith(".html") || url === siteBase)) {
  check(sitemap.includes(url), `sitemap.xml: missing packet URL ${url}`);
}

check(packet.includes("node scripts/monetization-report.cjs"), "SUBMISSION_PACKET.md: missing monetization report command");
check(packet.includes("node scripts/preflight.cjs --live"), "SUBMISSION_PACKET.md: missing live preflight command");
check(packet.includes("node scripts/apply-search-console-meta.cjs"), "SUBMISSION_PACKET.md: missing Search Console meta helper command");

console.log("Submission packet check");
console.log(`Checked ${requiredPacketUrls.length} required URLs.`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: submission packet is in sync.");
