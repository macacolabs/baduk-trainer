const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "CONTENT_PLAN.md");
const args = process.argv.slice(2);

function usage() {
  console.log("Usage:");
  console.log('  node scripts/add-content-candidate.cjs --title "바둑 패가 뭔가요" --intent "패 규칙을 검색한 초보자" --links baduk-glossary.html,baduk-atari.html --priority 중간');
}

function fail(message) {
  console.error(`Content candidate update failed: ${message}`);
  usage();
  process.exit(1);
}

function valueOf(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return "";
  return args[index + 1] || "";
}

function escapeCell(value) {
  return value.replace(/\|/g, "/").trim();
}

if (!fs.existsSync(planPath)) {
  fail("CONTENT_PLAN.md is missing.");
}

const title = valueOf("--title");
const intent = valueOf("--intent");
const priority = valueOf("--priority") || "중간";
const links = valueOf("--links")
  .split(",")
  .map((link) => link.trim())
  .filter(Boolean);

if (!title) fail("--title is required.");
if (!intent) fail("--intent is required.");
if (!["높음", "중간", "낮음"].includes(priority)) fail("--priority must be 높음, 중간, or 낮음.");
if (links.length < 2) fail("--links must include at least two comma-separated HTML files.");

for (const link of links) {
  if (!/^[a-z0-9-]+\.html$/.test(link)) {
    fail(`invalid related link filename: ${link}`);
  }
  if (!fs.existsSync(path.join(root, link))) {
    fail(`related link does not exist: ${link}`);
  }
}

const markdown = fs.readFileSync(planPath, "utf8");
if (markdown.includes(`| ${priority} | ${title} |`) || markdown.includes(`| 완료 | ${title} |`)) {
  fail(`candidate already exists: ${title}`);
}

const sectionHeading = "## Search Console 발견 후보";
const tableHeader = "| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |\n| --- | --- | --- | --- |";
const row = `| ${priority} | ${escapeCell(title)} | ${escapeCell(intent)} | ${links.map((link) => `\`${link}\``).join(", ")} |`;

let nextMarkdown = markdown;
if (!nextMarkdown.includes(sectionHeading)) {
  nextMarkdown += `\n${sectionHeading}\n\n${tableHeader}\n${row}\n`;
} else {
  const sectionIndex = nextMarkdown.indexOf(sectionHeading);
  const insertIndex = nextMarkdown.indexOf("\n## ", sectionIndex + sectionHeading.length);
  const targetIndex = insertIndex === -1 ? nextMarkdown.length : insertIndex;
  const before = nextMarkdown.slice(0, targetIndex).trimEnd();
  const after = nextMarkdown.slice(targetIndex);
  nextMarkdown = `${before}\n${row}\n${after}`;
}

fs.writeFileSync(planPath, nextMarkdown);
console.log(`Added content candidate: [${priority}] ${title}`);
console.log("Next:");
console.log("- node scripts/content-queue.cjs");
console.log("- Update or create the article, then connect it from learn.html and sitemap.xml.");
