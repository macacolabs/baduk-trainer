const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const start = "    <!-- SEARCH_CONSOLE_VERIFICATION_START -->";
const end = "    <!-- SEARCH_CONSOLE_VERIFICATION_END -->";
const meta = process.env.SEARCH_CONSOLE_META || process.argv.slice(2).join(" ");

function usage() {
  console.log("Usage:");
  console.log("$env:SEARCH_CONSOLE_META='<meta name=\"google-site-verification\" content=\"발급값\">'");
  console.log("node scripts/apply-search-console-meta.cjs");
}

function fail(message) {
  console.error(message);
  usage();
  process.exit(1);
}

if (!meta.trim()) {
  fail("Provide the Search Console meta tag as SEARCH_CONSOLE_META or as an argument.");
}

if (!/^<meta\s+name="google-site-verification"\s+content="[^"]+"\s*\/?>$/.test(meta.trim())) {
  fail('Expected a tag like: <meta name="google-site-verification" content="...">');
}

const html = fs.readFileSync(indexPath, "utf8");
const startIndex = html.indexOf(start);
const endIndex = html.indexOf(end);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  fail("Search Console verification markers are missing in index.html.");
}

const before = html.slice(0, startIndex + start.length);
const after = html.slice(endIndex);
const next = `${before}\n    ${meta.trim()}\n${after}`;

fs.writeFileSync(indexPath, next);
console.log("Updated index.html with Search Console verification meta tag.");
console.log("");
console.log("Next checks:");
console.log("- node scripts/preflight.cjs");
console.log("- git add -A");
console.log('- git commit -m "Add Search Console verification"');
console.log("- git push origin main");
console.log("");
console.log("After Search Console confirms ownership:");
console.log('- node scripts/mark-external-task.cjs "Search Console" "HTML meta verification 태그 발급" --note "HTML 태그 방식 선택, verification meta 태그 발급"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "SEARCH_CONSOLE_META" --note "Search Console meta 태그 적용 후 preflight 통과"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "변경사항 배포" --note "verification meta 커밋/푸시 후 GitHub Pages 배포 완료"');
console.log('- node scripts/mark-external-task.cjs "Search Console" "소유권 확인 완료" --note "Search Console에서 소유권 확인 성공"');
