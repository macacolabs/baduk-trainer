const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const start = "    <!-- SEARCH_CONSOLE_VERIFICATION_START -->";
const end = "    <!-- SEARCH_CONSOLE_VERIFICATION_END -->";
const rawInput = process.env.SEARCH_CONSOLE_TOKEN || process.env.SEARCH_CONSOLE_META || process.argv.slice(2).join(" ");
const metaPattern = /<meta\s+[^>]*name=["']google-site-verification["'][^>]*content=["']([^"']+)["'][^>]*\/?>/i;

function usage() {
  console.log("Usage:");
  console.log("$env:SEARCH_CONSOLE_TOKEN='발급값'");
  console.log("node scripts/apply-search-console-meta.cjs");
  console.log("");
  console.log("Or:");
  console.log("$env:SEARCH_CONSOLE_META='<meta name=\"google-site-verification\" content=\"발급값\">'");
  console.log("node scripts/apply-search-console-meta.cjs");
}

function fail(message) {
  console.error(message);
  usage();
  process.exit(1);
}

function tokenFromInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const metaMatch = trimmed.match(metaPattern);
  if (metaMatch) return metaMatch[1].trim();
  return trimmed;
}

function metaFromToken(token) {
  if (!/^[A-Za-z0-9_-]{8,}$/.test(token)) {
    fail("Expected a Search Console verification token, or a full google-site-verification meta tag.");
  }
  return `<meta name="google-site-verification" content="${token}">`;
}

const token = tokenFromInput(rawInput);
if (!token) {
  fail("Provide the Search Console token as SEARCH_CONSOLE_TOKEN, or the full tag as SEARCH_CONSOLE_META.");
}

const html = fs.readFileSync(indexPath, "utf8");
const startIndex = html.indexOf(start);
const endIndex = html.indexOf(end);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  fail("Search Console verification markers are missing in index.html.");
}

const before = html.slice(0, startIndex + start.length);
const after = html.slice(endIndex);
const next = `${before}\n    ${metaFromToken(token)}\n${after}`;

fs.writeFileSync(indexPath, next);
console.log("Updated index.html with Search Console verification meta tag.");
console.log("");
console.log("Next checks:");
console.log("- node scripts/check-search-console-meta.cjs");
console.log("- node scripts/preflight.cjs");
console.log("- git add -A");
console.log('- git commit -m "Add Search Console verification"');
console.log("- git push origin main");
console.log("- node scripts/wait-live-deploy.cjs");
console.log("- node scripts/check-search-console-meta.cjs --live");
console.log("");
console.log("After Search Console confirms ownership:");
console.log('- node scripts/mark-external-task.cjs "Search Console" "HTML meta verification 태그 발급" --note "HTML 태그 방식 선택, verification meta 태그 발급"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "SEARCH_CONSOLE_META" --note "Search Console meta 태그 적용 후 preflight 통과"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "변경사항 배포" --note "verification meta 커밋/푸시 후 GitHub Pages 배포 완료"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "소유권 확인 완료" --note "Search Console에서 소유권 확인 성공"');
