const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteBase = "https://macacolabs.github.io/baduk-trainer/";

const requiredFiles = [
  "index.html",
  "about.html",
  "learn.html",
  "faq.html",
  "privacy.html",
  "terms.html",
  "adsense-checklist.html",
  "search-console.html",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "ADSENSE_AFTER_APPROVAL.md",
  "CONTENT_PLAN.md",
  "EXTERNAL_ACCOUNT_CHECKLIST.md",
  "app.js",
  "styles.css",
];

const articleFiles = [
  "baduk-beginner.html",
  "baduk-9x9-beginner.html",
  "baduk-atari.html",
  "baduk-atari-practice.html",
  "baduk-profitable-capture.html",
  "baduk-liberties.html",
  "baduk-glossary.html",
  "baduk-opening.html",
  "baduk-opening-corner.html",
  "baduk-ai-review.html",
  "baduk-life-and-death.html",
  "baduk-life-and-death-practice.html",
  "baduk-10k-to-5k.html",
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-threats.html",
  "omok-attack-defense-priority.html",
  "omok-open-three.html",
  "omok-ai-difficulty.html",
  "omok-practice-routine.html",
];

const structuredDataFiles = ["index.html", "about.html", "learn.html", "faq.html", "search-console.html"];

const errors = [];
const warnings = [];
const adsenseApproved = process.env.ADSENSE_STATUS === "approved";
const adsenseMode = adsenseApproved ? "approved" : "pre-approval";

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const file of [...requiredFiles, ...articleFiles]) {
  check(exists(file), `Missing required file: ${file}`);
}

const htmlFiles = [...requiredFiles.filter((file) => file.endsWith(".html")), ...articleFiles];
for (const file of htmlFiles) {
  if (!exists(file)) continue;
  const html = read(file);
  check(/<html\s+lang="ko"/.test(html), `${file}: missing Korean html lang`);
  check(/<meta\s+name="viewport"/.test(html), `${file}: missing viewport meta`);
  check(/<title>[^<]+<\/title>/.test(html), `${file}: missing title`);
  warn(/<meta\s+name="description"/.test(html), `${file}: missing description meta`);
  warn(/rel="canonical"/.test(html), `${file}: missing canonical link`);
}

for (const file of articleFiles) {
  if (!exists(file)) continue;
  const html = read(file);
  check(/class="article-card-grid related-learning"/.test(html), `${file}: missing related learning links`);
  check(/<script\s+type="application\/ld\+json">/.test(html), `${file}: missing JSON-LD structured data`);
  check(/"@type":\s*"LearningResource"/.test(html), `${file}: missing LearningResource schema`);
}

for (const file of structuredDataFiles) {
  if (!exists(file)) continue;
  const html = read(file);
  check(/<script\s+type="application\/ld\+json">/.test(html), `${file}: missing JSON-LD structured data`);
  check(/"@context":\s*"https:\/\/schema\.org"/.test(html), `${file}: missing schema.org context`);
}

if (exists("sitemap.xml")) {
  const sitemap = read("sitemap.xml");
  check(sitemap.includes(`${siteBase}</loc>`), "sitemap.xml: missing site root URL");
  for (const file of ["about.html", "learn.html", "faq.html", "adsense-checklist.html", "search-console.html", ...articleFiles]) {
    check(sitemap.includes(`${siteBase}${file}`), `sitemap.xml: missing ${file}`);
  }
}

if (exists("robots.txt")) {
  const robots = read("robots.txt");
  check(/Sitemap:\s*https:\/\/macacolabs\.github\.io\/baduk-trainer\/sitemap\.xml/.test(robots), "robots.txt: missing sitemap URL");
}

if (exists("learn.html")) {
  const learn = read("learn.html");
  for (const file of articleFiles) {
    check(learn.includes(`href="${file}"`), `learn.html: missing article link ${file}`);
  }
}

if (exists("index.html")) {
  const index = read("index.html");
  for (const file of ["about.html", "learn.html", "faq.html", "adsense-checklist.html", "search-console.html", "privacy.html", "terms.html"]) {
    check(index.includes(`href="${file}"`), `index.html: missing footer/navigation link ${file}`);
  }
}

const allText = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html") || file.endsWith(".js"))
  .map((file) => read(file))
  .join("\n");

const hasAdsenseScript = /adsbygoogle|pagead2\.googlesyndication\.com|google_ad_client/.test(allText);
if (adsenseApproved) {
  warn(hasAdsenseScript, "AdSense approved mode is set, but no live ad script was found");
} else {
  check(!hasAdsenseScript, "AdSense script found before approval");
}
check((allText.match(/class="ad-slot/g) || []).length >= 2, "Expected visible ad-slot placeholders");

console.log("Service readiness check");
console.log(`AdSense mode: ${adsenseMode}`);
console.log(`Checked ${htmlFiles.length} HTML pages and ${articleFiles.length} learning articles.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const item of warnings) console.log(`- ${item}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const item of errors) console.error(`- ${item}`);
  process.exit(1);
}

console.log("\nOK: service readiness checks passed.");
