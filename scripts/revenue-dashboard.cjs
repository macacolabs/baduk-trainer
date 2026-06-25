const fs = require("fs");
const path = require("path");
const { articleFiles, requiredPublicPages, siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseExternalProgress() {
  if (!exists("EXTERNAL_ACCOUNT_CHECKLIST.md")) return { done: 0, total: 0, next: "EXTERNAL_ACCOUNT_CHECKLIST.md missing" };
  const lines = read("EXTERNAL_ACCOUNT_CHECKLIST.md").split(/\r?\n/);
  let section = "";
  const tasks = [];
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      section = heading[1].trim();
      continue;
    }
    const task = line.match(/^- \[( |x|X)\]\s+(.+)$/);
    if (task) tasks.push({ section, done: task[1].toLowerCase() === "x", text: task[2].trim() });
  }
  const next = tasks.find((task) => !task.done);
  return {
    done: tasks.filter((task) => task.done).length,
    total: tasks.length,
    next: next ? `[${next.section}] ${next.text}` : "external checklist complete",
  };
}

function status(ok) {
  return ok ? "PASS" : "TODO";
}

const htmlText = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html") || file.endsWith(".js"))
  .map((file) => read(file))
  .join("\n");

const articleStats = articleFiles.map((file) => {
  const html = exists(file) ? read(file) : "";
  return {
    file,
    chars: html ? textOnly(html).length : 0,
    related: /class="article-card-grid related-learning"/.test(html),
  };
});

const publicPagesReady = requiredPublicPages.every(exists);
const articlesReady = articleStats.length >= 20 && articleStats.every((item) => item.chars >= 650 && item.related);
const seoReady = ["sitemap.xml", "feed.xml", "robots.txt"].every(exists) &&
  read("sitemap.xml").includes(siteBase) &&
  read("feed.xml").includes("<rss") &&
  read("robots.txt").includes("sitemap.xml");
const trustReady = ["about.html", "privacy.html", "terms.html", "adsense-checklist.html", "search-console.html"].every(exists);
const adSafe = (htmlText.match(/class="ad-slot/g) || []).length >= 2 && !/adsbygoogle|pagead2\.googlesyndication\.com|google_ad_client/.test(htmlText);
const performanceReady = exists("app.js") && fs.statSync(path.join(root, "app.js")).size <= 280 * 1024;
const external = parseExternalProgress();

const categories = [
  ["Public pages", publicPagesReady, `${requiredPublicPages.length} required pages`],
  ["Learning content", articlesReady, `${articleStats.length} articles above current depth target`],
  ["SEO surfaces", seoReady, "sitemap, feed, robots"],
  ["Trust pages", trustReady, "about/privacy/terms/checklists"],
  ["Ad safety", adSafe, "ad slots ready, no live ad script before approval"],
  ["Performance", performanceReady, "app.js inside budget"],
];

const passed = categories.filter(([, ok]) => ok).length;
const internalScore = Math.round((passed / categories.length) * 100);
const externalScore = external.total ? Math.round((external.done / external.total) * 100) : 0;
const overallScore = Math.round(internalScore * 0.7 + externalScore * 0.3);

console.log("Revenue readiness dashboard");
console.log("");
console.log(`Overall score: ${overallScore}/100`);
console.log(`Internal readiness: ${internalScore}/100`);
console.log(`External account progress: ${external.done}/${external.total} (${externalScore}%)`);
console.log("");
console.log("| area | status | evidence |");
console.log("| --- | --- | --- |");
for (const [label, ok, evidence] of categories) {
  console.log(`| ${label} | ${status(ok)} | ${evidence} |`);
}

console.log("");
console.log("Next action:");
console.log(`- ${external.next}`);
console.log("");
console.log("Useful commands:");
console.log("- node scripts/external-next-action.cjs");
console.log("- node scripts/indexing-priority.cjs");
console.log("- node scripts/weekly-maintenance.cjs");

if (internalScore < 100) {
  process.exitCode = 1;
}
