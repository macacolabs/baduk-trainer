const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "CONTENT_PLAN.md");
const args = process.argv.slice(2);
const csvArg = args.find((arg) => !arg.startsWith("--"));
const csvPath = csvArg ? path.resolve(root, csvArg) : "";
const writeMode = args.includes("--write");
const minImpressions = numberArg("--min-impressions", 10);
const limit = numberArg("--limit", 5);

const relatedRules = [
  [/렌주|금수|33|3-3|44|4-4|장목|육목|6목/, ["omok-forbidden-moves.html", "omok-double-three-four.html", "omok-forbidden-real-game.html", "omok-first-second.html"]],
  [/오목.*난이도|오목.*ai|고수/, ["omok-ai-difficulty.html", "omok-difficulty-choice.html", "omok-hard-ai-losses.html", "omok-practice-routine.html"]],
  [/오목|열린\s*3|4목|삼삼|사사/, ["omok-strategy.html", "omok-open-three.html", "omok-block-four.html", "omok-attack-defense-priority.html"]],
  [/계가|집계산|집 계산|덤|끝내기/, ["baduk-territory-scoring.html", "baduk-scoring-practice-start.html", "baduk-endgame.html", "baduk-komi-6-5.html"]],
  [/사활|눈|대마|죽은 돌|사는 돌/, ["baduk-life-and-death.html", "baduk-life-and-death-practice.html", "baduk-false-eye.html", "baduk-large-group-death.html"]],
  [/단수|활로|축|장문|끊기|연결/, ["baduk-atari.html", "baduk-atari-practice.html", "baduk-liberties.html", "baduk-cut-connect.html"]],
  [/패|정석|포석|귀|변|중앙|두터움|실리/, ["baduk-ko-rule.html", "baduk-ko-fight-timing.html", "baduk-opening.html", "baduk-glossary.html"]],
  [/급|공부|루틴|복기|후보수/, ["baduk-rank-roadmap.html", "baduk-10k-to-5k.html", "baduk-candidate-moves.html", "baduk-review-note.html"]],
];

function usage() {
  console.log("Usage:");
  console.log("  node scripts/seed-search-console-candidates.cjs search-console-queries.csv");
  console.log("  node scripts/seed-search-console-candidates.cjs search-console-queries.csv --write --limit=3 --min-impressions=20");
}

function fail(message) {
  console.error(`Search Console candidate seeding failed: ${message}`);
  usage();
  process.exit(1);
}

function numberArg(flag, fallback) {
  const raw = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!raw) return fallback;
  const value = Number(raw.split("=")[1]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += char;
  }

  cells.push(cell.trim());
  return cells;
}

function normalizeHeader(header) {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function numberValue(value) {
  const cleaned = String(value || "").replace(/[%,"\s]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function findIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(header));
}

function escapeCell(value) {
  return value.replace(/\|/g, "/").trim();
}

function normalizeQuery(query) {
  return query.replace(/\s+/g, " ").trim();
}

function titleFor(query) {
  const clean = normalizeQuery(query).replace(/[?？]+$/g, "");
  if (/까$|나요$|인가$|인가요$/.test(clean)) return clean;
  if (/^왜\s/.test(clean)) return clean;
  if (/^어떻게\s/.test(clean)) return clean;
  if (clean.includes("오목")) return `${clean}은 어떻게 익힐까`;
  if (clean.includes("바둑")) return `${clean}은 어떻게 공부할까`;
  return `${clean}은 어떻게 배울까`;
}

function intentFor(query, row) {
  const metric = row.clicks === 0
    ? "노출은 있지만 클릭이 부족한 검색어"
    : "유입이 생긴 검색어를 더 깊게 보강";
  return `${metric}: ${escapeCell(normalizeQuery(query))}`;
}

function priorityFor(row) {
  if (row.impressions >= 100 && row.clicks === 0) return "높음";
  if (row.impressions >= 50) return "중간";
  return "낮음";
}

function linksFor(query) {
  const normalized = normalizeQuery(query);
  const rule = relatedRules.find(([pattern]) => pattern.test(normalized));
  const links = rule ? rule[1] : ["baduk-beginner.html", "learn.html", "faq.html"];
  return links.filter((link) => fs.existsSync(path.join(root, link))).slice(0, 4);
}

function appendRows(markdown, rows) {
  const sectionHeading = "## Search Console 발견 후보";
  const tableHeader = "| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |\n| --- | --- | --- | --- |";
  const body = rows.map((row) => `| ${row.priority} | ${escapeCell(row.title)} | ${escapeCell(row.intent)} | ${row.links.map((link) => `\`${link}\``).join(", ")} |`).join("\n");

  if (!markdown.includes(sectionHeading)) {
    return `${markdown.trimEnd()}\n\n${sectionHeading}\n\n${tableHeader}\n${body}\n`;
  }

  const sectionIndex = markdown.indexOf(sectionHeading);
  const insertIndex = markdown.indexOf("\n## ", sectionIndex + sectionHeading.length);
  const targetIndex = insertIndex === -1 ? markdown.length : insertIndex;
  return `${markdown.slice(0, targetIndex).trimEnd()}\n${body}\n${markdown.slice(targetIndex)}`;
}

if (!csvPath) fail("CSV path is required.");
if (!fs.existsSync(csvPath)) fail(`CSV file does not exist: ${csvPath}`);
if (!fs.existsSync(planPath)) fail("CONTENT_PLAN.md is missing.");
if (limit < 1) fail("--limit must be at least 1.");

const plan = fs.readFileSync(planPath, "utf8");
const csv = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
const lines = csv.split(/\r?\n/).filter((line) => line.trim());
if (lines.length < 2) fail("CSV needs a header row and at least one data row.");

const headers = parseCsvLine(lines[0]).map(normalizeHeader);
const queryIndex = findIndex(headers, ["query", "queries", "검색어", "쿼리"]);
const clicksIndex = findIndex(headers, ["clicks", "클릭수", "클릭"]);
const impressionsIndex = findIndex(headers, ["impressions", "노출수", "노출"]);
const ctrIndex = findIndex(headers, ["ctr", "클릭률"]);
const positionIndex = findIndex(headers, ["position", "average position", "평균 게재순위", "게재순위"]);

if (queryIndex === -1) fail("query column not found.");
if (clicksIndex === -1) fail("clicks column not found.");
if (impressionsIndex === -1) fail("impressions column not found.");

const rows = lines.slice(1).map((line) => {
  const cells = parseCsvLine(line);
  const clicks = numberValue(cells[clicksIndex]);
  const impressions = numberValue(cells[impressionsIndex]);
  const ctr = ctrIndex === -1 ? (impressions ? clicks / impressions : 0) : numberValue(cells[ctrIndex]) / 100;
  const position = positionIndex === -1 ? 0 : numberValue(cells[positionIndex]);
  const opportunityScore = impressions * (1 - Math.min(ctr, 1)) + Math.max(0, 15 - position);
  return {
    query: normalizeQuery(cells[queryIndex] || ""),
    clicks,
    impressions,
    ctr,
    position,
    opportunityScore,
  };
});

const seenTitles = new Set();
const candidates = rows
  .filter((row) => row.query && row.impressions >= minImpressions)
  .sort((a, b) => b.opportunityScore - a.opportunityScore)
  .map((row) => ({
    ...row,
    title: titleFor(row.query),
    intent: intentFor(row.query, row),
    priority: priorityFor(row),
    links: linksFor(row.query),
  }))
  .filter((row) => row.links.length >= 2)
  .filter((row) => {
    const key = row.title.toLowerCase();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return !plan.includes(row.title) && !plan.includes(row.query);
  })
  .slice(0, limit);

console.log("Search Console candidate seeding");
console.log(`Rows: ${rows.length}`);
console.log(`Minimum impressions: ${minImpressions}`);
console.log(`Mode: ${writeMode ? "write" : "preview"}`);
console.log("");

if (!candidates.length) {
  console.log("No new candidates found.");
  process.exit(0);
}

console.log("| priority | query | title | impressions | clicks | links |");
console.log("| --- | --- | --- | ---: | ---: | --- |");
for (const row of candidates) {
  console.log(`| ${row.priority} | ${escapeCell(row.query)} | ${escapeCell(row.title)} | ${row.impressions} | ${row.clicks} | ${row.links.map((link) => `\`${link}\``).join(", ")} |`);
}

if (!writeMode) {
  console.log("");
  console.log("Preview only. Re-run with --write to append these rows to CONTENT_PLAN.md.");
  process.exit(0);
}

fs.writeFileSync(planPath, appendRows(plan, candidates));
console.log("");
console.log(`Added ${candidates.length} candidate(s) to CONTENT_PLAN.md.`);
console.log("Next:");
console.log("- node scripts/content-queue.cjs");
