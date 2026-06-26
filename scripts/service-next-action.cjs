const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contentPlanPath = path.join(root, "CONTENT_PLAN.md");
const externalChecklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");

const priorityOrder = new Map([
  ["높음", 0],
  ["중간", 1],
  ["낮음", 2],
  ["완료", 9],
]);

function fail(message) {
  console.error(`Service next action failed: ${message}`);
  process.exit(1);
}

function readRequired(filePath, label) {
  if (!fs.existsSync(filePath)) fail(`${label} is missing.`);
  return fs.readFileSync(filePath, "utf8");
}

function parseContentQueue(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length === 4 && priorityOrder.has(cells[0]))
    .map(([priority, title, intent, links]) => ({ priority, title, intent, links }))
    .filter((row) => row.priority !== "완료")
    .sort((a, b) => priorityOrder.get(a.priority) - priorityOrder.get(b.priority));
}

function parseExternalNext(markdown) {
  let section = "";
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      section = heading[1].trim();
      continue;
    }

    const task = line.match(/^- \[( |x|X)\]\s+(.+)$/);
    if (task && task[1] === " ") {
      return { section, text: task[2].trim() };
    }
  }
  return null;
}

const openContent = parseContentQueue(readRequired(contentPlanPath, "CONTENT_PLAN.md"));
const externalNext = parseExternalNext(readRequired(externalChecklistPath, "EXTERNAL_ACCOUNT_CHECKLIST.md"));

console.log("Service next action");
console.log("");

if (externalNext) {
  console.log("Revenue blocker:");
  console.log(`- [${externalNext.section}] ${externalNext.text}`);
  console.log("- Run: node scripts/external-next-action.cjs");
  console.log("");
} else {
  console.log("Revenue blocker:");
  console.log("- External account checklist complete.");
  console.log("");
}

if (openContent.length) {
  const next = openContent[0];
  console.log("Internal growth task:");
  console.log(`- [${next.priority}] ${next.title}`);
  console.log(`- Search intent: ${next.intent}`);
  console.log(`- Connect to: ${next.links}`);
  console.log("- Run: node scripts/content-queue.cjs");
} else {
  console.log("Internal growth task:");
  console.log("- No open content candidates. Seed Search Console query ideas into CONTENT_PLAN.md.");
  console.log("- Run: node scripts/seed-search-console-candidates.cjs search-console-queries.csv --write");
}

console.log("");
console.log("Weekly proof:");
console.log("- node scripts/weekly-maintenance.cjs");
