const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");
const [sectionQuery, taskQuery] = process.argv.slice(2);

function usage() {
  console.log("Usage:");
  console.log('  node scripts/mark-external-task.cjs "Search Console" "URL 접두어"');
  console.log('  node scripts/mark-external-task.cjs "AdSense 신청 전" "sitemap 제출"');
}

function fail(message) {
  console.error(`External task update failed: ${message}`);
  usage();
  process.exit(1);
}

if (!sectionQuery || !taskQuery) {
  fail("section and task search text are required.");
}

if (!fs.existsSync(checklistPath)) {
  fail("EXTERNAL_ACCOUNT_CHECKLIST.md is missing.");
}

const markdown = fs.readFileSync(checklistPath, "utf8");
const lines = markdown.split(/\r?\n/);
let currentSection = "";
const matches = [];

for (let index = 0; index < lines.length; index += 1) {
  const heading = lines[index].match(/^##\s+(.+)\s*$/);
  if (heading) {
    currentSection = heading[1].trim();
    continue;
  }

  const task = lines[index].match(/^- \[( |x|X)\]\s+(.+)$/);
  if (!task) continue;

  const sectionMatches = currentSection.includes(sectionQuery);
  const taskMatches = task[2].includes(taskQuery);
  if (sectionMatches && taskMatches) {
    matches.push({
      index,
      done: task[1].toLowerCase() === "x",
      section: currentSection,
      text: task[2],
    });
  }
}

if (matches.length === 0) {
  fail(`no matching task for section "${sectionQuery}" and task "${taskQuery}".`);
}

if (matches.length > 1) {
  console.error("Matched more than one task:");
  for (const match of matches) {
    console.error(`- [${match.section}] ${match.text}`);
  }
  fail("use more specific search text.");
}

const match = matches[0];
if (match.done) {
  console.log(`Already done: [${match.section}] ${match.text}`);
  process.exit(0);
}

lines[match.index] = lines[match.index].replace("- [ ]", "- [x]");
fs.writeFileSync(checklistPath, lines.join("\n"));
console.log(`Marked done: [${match.section}] ${match.text}`);
console.log("Next:");
console.log("- node scripts/external-account-status.cjs");
