const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const csvPath = args[0] ? path.resolve(root, args[0]) : "";
const minImpressionsArg = args.find((arg) => arg.startsWith("--min-impressions="));
const minImpressions = minImpressionsArg ? Number(minImpressionsArg.split("=")[1]) : 10;

function usage() {
  console.log("Usage:");
  console.log("  node scripts/search-console-query-report.cjs search-console-queries.csv");
  console.log("  node scripts/search-console-query-report.cjs search-console-queries.csv --min-impressions=20");
}

function fail(message) {
  console.error(`Search Console query report failed: ${message}`);
  usage();
  process.exit(1);
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

if (!csvPath) fail("CSV path is required.");
if (!fs.existsSync(csvPath)) fail(`CSV file does not exist: ${csvPath}`);
if (!Number.isFinite(minImpressions) || minImpressions < 0) fail("--min-impressions must be a positive number.");

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
    query: cells[queryIndex] || "(empty)",
    clicks,
    impressions,
    ctr,
    position,
    opportunityScore,
  };
});

const candidates = rows
  .filter((row) => row.impressions >= minImpressions)
  .sort((a, b) => b.opportunityScore - a.opportunityScore)
  .slice(0, 10);

console.log("Search Console query report");
console.log(`Rows: ${rows.length}`);
console.log(`Minimum impressions: ${minImpressions}`);
console.log("");

if (!candidates.length) {
  console.log("No query candidates matched the threshold.");
  process.exit(0);
}

console.log("| query | clicks | impressions | ctr | position | suggested action |");
console.log("| --- | ---: | ---: | ---: | ---: | --- |");
for (const row of candidates) {
  const ctrText = `${(row.ctr * 100).toFixed(1)}%`;
  const positionText = row.position ? row.position.toFixed(1) : "-";
  const action = row.clicks === 0
    ? "제목/첫 문단 보강 또는 새 후보 추가"
    : "유입 글 내부 링크와 연습 루틴 보강";
  console.log(`| ${row.query.replace(/\|/g, "/")} | ${row.clicks} | ${row.impressions} | ${ctrText} | ${positionText} | ${action} |`);
}

console.log("");
console.log("To add a candidate:");
console.log('node scripts/add-content-candidate.cjs --title "검색어 기반 제목" --intent "검색 의도" --links baduk-beginner.html,baduk-atari.html --priority 중간');
