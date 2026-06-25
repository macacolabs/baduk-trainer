const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];

const required = {
  "about.html": ["서비스 목적", "운영 원칙", "문의", "GitHub"],
  "privacy.html": ["시행일", "localStorage", "Google AdSense", "쿠키", "GitHub", "정보 삭제", "변경 고지"],
  "terms.html": ["시행일", "서비스 목적", "학습용", "광고", "부정 클릭", "localStorage", "문의"],
  "adsense-checklist.html": ["개인정보처리방침", "이용약관", "광고 배치", "승인 전", "Search Console"],
  "search-console.html": ["URL 접두어", "verification meta", "sitemap", "색인 요청", "node scripts/indexing-priority.cjs"],
};

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

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const [file, terms] of Object.entries(required)) {
  const fullPath = path.join(root, file);
  check(fs.existsSync(fullPath), `${file}: missing trust page`);
  if (!fs.existsSync(fullPath)) continue;

  const html = read(file);
  const text = textOnly(html);
  check(/<html\s+lang="ko"/.test(html), `${file}: missing Korean html lang`);
  check(/<meta\s+name="description"/.test(html), `${file}: missing description meta`);
  check(/rel="canonical"/.test(html), `${file}: missing canonical link`);
  check(/href="index\.html"/.test(html), `${file}: missing link back to home`);
  warn(text.length >= 600, `${file}: short trust page content (${text.length} chars)`);

  for (const term of terms) {
    check(html.includes(term) || text.includes(term), `${file}: missing trust term "${term}"`);
  }
}

const staleManualSitemapMentions = [
  ...fs.readdirSync(root).filter((file) => file.endsWith(".html") || file.endsWith(".md")),
].flatMap((file) => {
  const text = read(file);
  const stale = /새 (글|공개 페이지)[\s\S]{0,80}sitemap\.xml에 (추가|함께 연결|갱신)/.test(text);
  return stale ? [file] : [];
});

for (const file of staleManualSitemapMentions) {
  check(false, `${file}: replace manual sitemap wording with scripts/sync-sitemap.cjs --write`);
}

console.log("Trust page check");
console.log(`Checked ${Object.keys(required).length} trust/support pages.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const item of warnings) console.log(`- ${item}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const item of errors) console.error(`- ${item}`);
  process.exit(1);
}

console.log("\nOK: trust page checks passed.");
