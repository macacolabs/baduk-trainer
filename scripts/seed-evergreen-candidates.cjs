const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "CONTENT_PLAN.md");
const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const limit = numberArg("--limit", 5);

const candidates = [
  {
    priority: "높음",
    title: "바둑 규칙 쉽게 배우는 순서",
    intent: "바둑 규칙을 처음 검색한 사용자가 착수, 활로, 단수, 패를 순서대로 알고 싶은 검색",
    links: ["baduk-beginner.html", "baduk-liberties.html", "baduk-atari.html", "baduk-ko-rule.html"],
  },
  {
    priority: "높음",
    title: "오목 4목을 놓치지 않는 체크리스트",
    intent: "오목에서 바로 지는 4목 차단 실수를 줄이고 싶은 초보자 검색",
    links: ["omok-block-four.html", "omok-blocking-point.html", "omok-open-four.html", "omok-defense-to-attack.html"],
  },
  {
    priority: "중간",
    title: "오목 AI와 연습할 때 난이도 올리는 기준",
    intent: "오목 AI 난이도를 언제 올려야 하는지 알고 싶은 사용자 검색",
    links: ["omok-ai-difficulty.html", "omok-difficulty-choice.html", "omok-hard-ai-losses.html", "omok-practice-routine.html"],
  },
  {
    priority: "중간",
    title: "바둑 집 계산 연습을 처음 시작하는 법",
    intent: "바둑 계가와 집 계산을 실전 전에 작게 연습하고 싶은 입문자 검색",
    links: ["baduk-territory-scoring.html", "baduk-scoring-practice-start.html", "baduk-komi-6-5.html", "baduk-endgame.html"],
  },
  {
    priority: "중간",
    title: "바둑 1급 목표자가 매주 확인할 복기 질문",
    intent: "5급 이후 1급을 목표로 대국 복기를 어떻게 해야 하는지 찾는 검색",
    links: ["baduk-5k-to-1k.html", "baduk-1k-daily-routine.html", "baduk-candidate-moves.html", "baduk-review-note.html"],
  },
];

function usage() {
  console.log("Usage:");
  console.log("  node scripts/seed-evergreen-candidates.cjs");
  console.log("  node scripts/seed-evergreen-candidates.cjs --write --limit=3");
}

function fail(message) {
  console.error(`Evergreen candidate seeding failed: ${message}`);
  usage();
  process.exit(1);
}

function numberArg(flag, fallback) {
  const raw = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!raw) return fallback;
  const value = Number(raw.split("=")[1]);
  return Number.isFinite(value) && value >= 1 ? value : fallback;
}

function escapeCell(value) {
  return value.replace(/\|/g, "/").trim();
}

function rowFor(candidate) {
  return `| ${candidate.priority} | ${escapeCell(candidate.title)} | ${escapeCell(candidate.intent)} | ${candidate.links.map((link) => `\`${link}\``).join(", ")} |`;
}

function appendRows(markdown, rows) {
  const sectionHeading = "## Search Console 전 예비 후보";
  const tableHeader = "| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |\n| --- | --- | --- | --- |";
  const body = rows.map(rowFor).join("\n");

  if (!markdown.includes(sectionHeading)) {
    const monthlyIndex = markdown.indexOf("\n## 월간 운영 루틴");
    const section = `\n\n${sectionHeading}\n\nSearch Console 검색어가 아직 없거나 CSV를 받기 전이면 아래 후보로 콘텐츠 큐를 유지합니다.\n\n${tableHeader}\n${body}\n`;
    if (monthlyIndex === -1) return `${markdown.trimEnd()}${section}`;
    return `${markdown.slice(0, monthlyIndex).trimEnd()}${section}${markdown.slice(monthlyIndex)}`;
  }

  const sectionIndex = markdown.indexOf(sectionHeading);
  const insertIndex = markdown.indexOf("\n## ", sectionIndex + sectionHeading.length);
  const targetIndex = insertIndex === -1 ? markdown.length : insertIndex;
  return `${markdown.slice(0, targetIndex).trimEnd()}\n${body}\n${markdown.slice(targetIndex)}`;
}

if (!fs.existsSync(planPath)) fail("CONTENT_PLAN.md is missing.");
if (limit < 1) fail("--limit must be at least 1.");

const markdown = fs.readFileSync(planPath, "utf8");

for (const candidate of candidates) {
  if (!["높음", "중간", "낮음"].includes(candidate.priority)) fail(`invalid priority: ${candidate.title}`);
  if (candidate.links.length < 2) fail(`candidate needs at least two links: ${candidate.title}`);
  for (const link of candidate.links) {
    if (!fs.existsSync(path.join(root, link))) fail(`missing related page: ${candidate.title} -> ${link}`);
  }
}

const selected = candidates
  .filter((candidate) => !markdown.includes(`| ${candidate.priority} | ${candidate.title} |`) && !markdown.includes(`| 완료 | ${candidate.title} |`))
  .slice(0, limit);

console.log("Evergreen content candidate seeding");
console.log(`Mode: ${writeMode ? "write" : "preview"}`);
console.log(`Limit: ${limit}`);
console.log("");

if (!selected.length) {
  console.log("No evergreen candidates to add.");
  process.exit(0);
}

console.log("| priority | title | search intent | related links |");
console.log("| --- | --- | --- | --- |");
for (const candidate of selected) {
  console.log(`| ${candidate.priority} | ${candidate.title} | ${candidate.intent} | ${candidate.links.map((link) => `\`${link}\``).join(", ")} |`);
}

if (!writeMode) {
  console.log("");
  console.log("Preview only. Re-run with --write to append these rows to CONTENT_PLAN.md.");
  process.exit(0);
}

fs.writeFileSync(planPath, appendRows(markdown, selected));
console.log("");
console.log(`Added ${selected.length} evergreen candidate(s) to CONTENT_PLAN.md.`);
console.log("Next:");
console.log("- node scripts/content-queue.cjs");
