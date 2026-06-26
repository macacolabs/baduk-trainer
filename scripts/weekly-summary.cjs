const fs = require("fs");
const path = require("path");
const { articleFiles, requiredPublicPages, siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");
const sitemapPath = path.join(root, "sitemap.xml");

const corePriority = new Map([
  ["", 130],
  ["learn.html", 125],
  ["faq.html", 120],
  ["baduk-beginner.html", 112],
  ["baduk-atari.html", 111],
  ["baduk-9x9-beginner.html", 110],
  ["baduk-liberties.html", 110],
  ["baduk-19x19-start.html", 109],
  ["baduk-ko-rule.html", 109],
  ["baduk-rank-roadmap.html", 108],
  ["omok-strategy.html", 108],
  ["baduk-beginner-mistakes.html", 107],
  ["baduk-territory-scoring.html", 107],
  ["baduk-5k-to-1k.html", 106],
  ["omok-ai-difficulty.html", 106],
  ["omok-block-four.html", 106],
  ["omok-forbidden-moves.html", 105],
]);

function fullPath(file) {
  return path.join(root, file);
}

function exists(file) {
  return fs.existsSync(fullPath(file));
}

function read(file) {
  return fs.readFileSync(fullPath(file), "utf8");
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFor(file) {
  if (!file.endsWith(".html") || !exists(file)) return "";
  const html = read(file);
  return (html.match(/<h1>([^<]+)<\/h1>/)?.[1] || html.match(/<title>([^<]+)<\/title>/)?.[1] || "").trim();
}

function parseExternalProgress() {
  if (!fs.existsSync(checklistPath)) return { done: 0, total: 0, next: "EXTERNAL_ACCOUNT_CHECKLIST.md missing" };
  const lines = fs.readFileSync(checklistPath, "utf8").split(/\r?\n/);
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

function articleStats() {
  const rows = articleFiles.map((file) => {
    const chars = exists(file) ? textOnly(read(file)).length : 0;
    return { file, chars, title: titleFor(file) || file };
  });
  return {
    total: rows.length,
    needsWork: rows.filter((row) => row.chars < 750).sort((a, b) => a.chars - b.chars),
    observe: rows.filter((row) => row.chars >= 750 && row.chars < 950).sort((a, b) => a.chars - b.chars),
  };
}

function sitemapEntries() {
  if (!fs.existsSync(sitemapPath)) return [];
  return [...fs.readFileSync(sitemapPath, "utf8").matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
    .map(([, url, lastmod]) => {
      const pathname = url.slice(siteBase.length);
      const file = pathname || "index.html";
      const freshBonus = /^2026-06-2[4-9]/.test(lastmod) ? 5 : 0;
      let score = corePriority.get(pathname) || 0;
      if (!score && pathname.startsWith("baduk-")) score = 70;
      if (!score && pathname.startsWith("omok-")) score = 68;
      if (!score) score = 40;
      return { url, pathname, file, lastmod, score: score + freshBonus, title: titleFor(file) || pathname || "큰돌" };
    })
    .sort((a, b) => b.score - a.score || b.lastmod.localeCompare(a.lastmod) || a.url.localeCompare(b.url));
}

function internalReadiness() {
  const publicReady = requiredPublicPages.every(exists);
  const articles = articleStats();
  const seoReady = ["sitemap.xml", "feed.xml", "robots.txt"].every(exists);
  const trustReady = ["about.html", "privacy.html", "terms.html", "adsense-checklist.html", "search-console.html"].every(exists);
  const adSafe = fs
    .readdirSync(root)
    .filter((file) => file.endsWith(".html") || file.endsWith(".js"))
    .map(read)
    .join("\n")
    .includes("ad-slot");
  const passed = [publicReady, articles.total >= 20 && !articles.needsWork.length, seoReady, trustReady, adSafe].filter(Boolean).length;
  return Math.round((passed / 5) * 100);
}

const external = parseExternalProgress();
const articles = articleStats();
const indexing = sitemapEntries().slice(0, 8);
const internalScore = internalReadiness();
const externalScore = external.total ? Math.round((external.done / external.total) * 100) : 0;
const overallScore = Math.round(internalScore * 0.7 + externalScore * 0.3);

console.log("# 큰돌 주간 운영 요약");
console.log("");
console.log(`- 수익 준비도: ${overallScore}/100`);
console.log(`- 내부 준비도: ${internalScore}/100`);
console.log(`- 외부 계정 진행: ${external.done}/${external.total} (${externalScore}%)`);
console.log(`- 다음 액션: ${external.next}`);
console.log(`- 학습 글: ${articles.total}개, 보강 필요 ${articles.needsWork.length}개, 관찰 ${articles.observe.length}개`);
console.log("");
console.log("## 이번 주 색인 요청 후보");
console.log("");
for (const entry of indexing) {
  console.log(`- [ ] ${entry.url} - ${entry.title}`);
}
console.log("");
console.log("## 이번 주 운영 명령");
console.log("");
console.log("```powershell");
console.log("node scripts/revenue-dashboard.cjs");
console.log("node scripts/external-next-action.cjs");
console.log("node scripts/indexing-priority.cjs --checklist");
console.log("node scripts/weekly-maintenance.cjs");
console.log("```");

if (articles.needsWork.length) {
  console.log("");
  console.log("## 먼저 보강할 글");
  console.log("");
  for (const row of articles.needsWork.slice(0, 3)) {
    console.log(`- ${row.file}: ${row.title} (${row.chars}자)`);
  }
}
