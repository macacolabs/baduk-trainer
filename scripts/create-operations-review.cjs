const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "OPERATIONS_REVIEW_TEMPLATE.md");
const reviewDir = path.join(root, "operations-reviews");
const args = process.argv.slice(2);
const printOnly = args.includes("--print");
const skipSnapshot = args.includes("--blank") || args.includes("--skip-snapshot");
const force = args.includes("--force");
const monthArg = args.find((arg) => /^\d{4}-\d{2}$/.test(arg));

function fail(message) {
  console.error(`Operations review creation failed: ${message}`);
  console.error("Usage: node scripts/create-operations-review.cjs [YYYY-MM] [--print] [--force] [--blank]");
  process.exit(1);
}

function currentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

if (!fs.existsSync(templatePath)) {
  fail("OPERATIONS_REVIEW_TEMPLATE.md is missing.");
}

function capture(label, commandArgs) {
  const result = spawnSync(process.execPath, commandArgs, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 2,
  });
  const output = [result.stdout, result.stderr].filter(Boolean).join("");
  if (result.status !== 0) {
    console.error(output);
    fail(`${label} snapshot command failed.`);
  }
  return [
    `### ${label}`,
    "",
    "```text",
    `$ node ${commandArgs.join(" ")}`,
    output.trim(),
    "```",
  ].join("\n");
}

function buildSnapshot() {
  if (skipSnapshot) {
    return "- 자동 스냅샷 생략. 필요한 명령을 수동으로 실행하세요.";
  }
  return [
    capture("수익화 대시보드", ["scripts/revenue-dashboard.cjs"]),
    capture("수익화 내부 준비", ["scripts/monetization-report.cjs"]),
    capture("외부 계정 다음 작업", ["scripts/external-next-action.cjs"]),
    capture("콘텐츠 상태", ["scripts/content-report.cjs"]),
  ].join("\n\n");
}

const targetMonth = monthArg || currentMonth();
const content = fs
  .readFileSync(templatePath, "utf8")
  .replace("`YYYY-MM`", `\`${targetMonth}\``)
  .replace("`YYYY-MM-DD`", `\`${today()}\``)
  .replace("<!-- AUTO_SNAPSHOT -->", buildSnapshot());

if (printOnly) {
  console.log(content);
  process.exit(0);
}

if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
}

const reviewPath = path.join(reviewDir, `${targetMonth}.md`);
if (fs.existsSync(reviewPath) && !force) {
  fail(`${path.relative(root, reviewPath)} already exists. Use --force to overwrite.`);
}

fs.writeFileSync(reviewPath, content);
console.log(`Created ${path.relative(root, reviewPath)}`);
console.log("Next:");
console.log("- Fill in Search Console and AdSense values.");
console.log("- Run node scripts/weekly-maintenance.cjs before committing the review.");
