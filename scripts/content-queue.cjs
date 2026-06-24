const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "CONTENT_PLAN.md");
const priorityOrder = new Map([
  ["높음", 0],
  ["중간", 1],
  ["낮음", 2],
  ["완료", 9],
]);

function fail(message) {
  console.error(`Content queue check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(planPath)) {
  fail("CONTENT_PLAN.md is missing.");
}

const markdown = fs.readFileSync(planPath, "utf8");
const rows = markdown
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => /^\|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
  .filter((cells) => cells.length === 4 && priorityOrder.has(cells[0]))
  .map(([priority, title, intent, links]) => ({ priority, title, intent, links }));

if (!rows.length) {
  fail("No content candidate rows found.");
}

const openRows = rows
  .filter((row) => row.priority !== "완료")
  .sort((a, b) => priorityOrder.get(a.priority) - priorityOrder.get(b.priority));

if (!openRows.length) {
  fail("No open content candidates found. Add at least one next article idea.");
}

const linkPattern = /`([^`]+\.html)`/g;
for (const row of openRows) {
  const links = [...row.links.matchAll(linkPattern)].map((match) => match[1]);
  if (links.length < 2) {
    fail(`Candidate needs at least two planned internal links: ${row.title}`);
  }
  for (const link of links) {
    if (!fs.existsSync(path.join(root, link))) {
      fail(`Candidate points to a missing related page: ${row.title} -> ${link}`);
    }
  }
}

console.log("Content queue");
console.log("");
console.log("| priority | title | search intent | related links |");
console.log("| --- | --- | --- | --- |");
for (const row of openRows) {
  console.log(`| ${row.priority} | ${row.title} | ${row.intent} | ${row.links} |`);
}

const next = openRows[0];
console.log("");
console.log(`Next article: [${next.priority}] ${next.title}`);
console.log(`Search intent: ${next.intent}`);
console.log(`Connect to: ${next.links}`);
