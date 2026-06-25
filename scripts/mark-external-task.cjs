const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");
const rawArgs = process.argv.slice(2);

function parseArgs(args) {
  const positional = [];
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--note" || arg === "--date") {
      options[arg.slice(2)] = args[index + 1] || "";
      index += 1;
      continue;
    }
    if (arg.startsWith("--note=") || arg.startsWith("--date=")) {
      const [key, ...parts] = arg.slice(2).split("=");
      options[key] = parts.join("=");
      continue;
    }
    positional.push(arg);
  }

  return {
    sectionQuery: positional[0],
    taskQuery: positional[1],
    note: options.note || "",
    date: options.date || today(),
  };
}

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function usage() {
  console.log("Usage:");
  console.log('  node scripts/mark-external-task.cjs "Search Console" "URL 접두어"');
  console.log('  node scripts/mark-external-task.cjs "AdSense 신청 전" "sitemap 제출"');
  console.log('  node scripts/mark-external-task.cjs "Search Console" "sitemap.xml" --note "Search Console에서 제출 완료"');
}

function fail(message) {
  console.error(`External task update failed: ${message}`);
  usage();
  process.exit(1);
}

const { sectionQuery, taskQuery, note, date } = parseArgs(rawArgs);

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
  if (note) {
    appendLog(lines, { date, section: match.section, text: match.text, note, status: "already done" });
    fs.writeFileSync(checklistPath, lines.join("\n"));
    console.log("Added progress note.");
  }
  process.exit(0);
}

lines[match.index] = lines[match.index].replace("- [ ]", "- [x]");
if (note) {
  appendLog(lines, { date, section: match.section, text: match.text, note, status: "done" });
}
fs.writeFileSync(checklistPath, lines.join("\n"));
console.log(`Marked done: [${match.section}] ${match.text}`);
if (note) console.log("Added progress note.");
console.log("Next:");
console.log("- node scripts/external-account-status.cjs");

function appendLog(lines, entry) {
  const heading = "## 진행 로그";
  const row = `- ${entry.date} | ${entry.section} | ${entry.text.replace(/\|/g, "/")} | ${entry.status} | ${entry.note.replace(/\|/g, "/")}`;
  const headingIndex = lines.findIndex((line) => line.trim() === heading);

  if (headingIndex === -1) {
    if (lines.at(-1)?.trim()) lines.push("");
    lines.push(heading, "", row);
    return;
  }

  let insertIndex = lines.findIndex((line, index) => index > headingIndex && /^##\s+/.test(line));
  if (insertIndex === -1) insertIndex = lines.length;
  while (insertIndex > headingIndex + 1 && lines[insertIndex - 1] === "") {
    insertIndex -= 1;
  }
  lines.splice(insertIndex, 0, row);
}
