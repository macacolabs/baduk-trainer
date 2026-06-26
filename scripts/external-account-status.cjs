const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");
const requiredSections = [
  "Search Console",
  "AdSense 신청 전",
  "AdSense 신청",
  "AdSense 승인 후",
  "매주 확인",
];

function fail(message) {
  console.error(`External account status check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(checklistPath)) {
  fail("EXTERNAL_ACCOUNT_CHECKLIST.md is missing.");
}

const markdown = fs.readFileSync(checklistPath, "utf8");
const lines = markdown.split(/\r?\n/);
const sections = new Map();
let currentSection = "";

for (const line of lines) {
  const heading = line.match(/^##\s+(.+)\s*$/);
  if (heading) {
    currentSection = heading[1].trim();
    if (!sections.has(currentSection)) sections.set(currentSection, []);
    continue;
  }

  const task = line.match(/^- \[( |x|X)\]\s+(.+)$/);
  if (task && currentSection) {
    sections.get(currentSection).push({
      done: task[1].toLowerCase() === "x",
      text: task[2].trim(),
    });
  }
}

for (const section of requiredSections) {
  if (!sections.has(section)) fail(`missing section: ${section}`);
  if (!sections.get(section).length) fail(`section has no checklist items: ${section}`);
}

const trackedSections = requiredSections.map((section) => {
  const tasks = sections.get(section);
  const done = tasks.filter((task) => task.done).length;
  return { section, tasks, done, total: tasks.length };
});

const totalDone = trackedSections.reduce((sum, item) => sum + item.done, 0);
const totalTasks = trackedSections.reduce((sum, item) => sum + item.total, 0);
const nextTask = trackedSections
  .flatMap((item) => item.tasks.map((task) => ({ ...task, section: item.section })))
  .find((task) => !task.done);

console.log("External account status");
console.log("");
console.log("| section | progress | next open item |");
console.log("| --- | --- | --- |");

for (const item of trackedSections) {
  const next = item.tasks.find((task) => !task.done);
  console.log(`| ${item.section} | ${item.done}/${item.total} | ${next ? next.text : "done"} |`);
}

console.log("");
console.log(`Total progress: ${totalDone}/${totalTasks}`);

if (nextTask) {
  console.log(`Next action: [${nextTask.section}] ${nextTask.text}`);
} else {
  console.log("Next action: all external account checklist items are marked done.");
}

console.log("");
console.log("Consistency:");
const consistency = spawnSync(process.execPath, ["scripts/check-external-checklist-consistency.cjs"], {
  cwd: root,
  encoding: "utf8",
});
if (consistency.status === 0) {
  console.log("- OK");
} else {
  console.log("- FAILED");
  process.stdout.write(consistency.stdout || "");
  process.stderr.write(consistency.stderr || "");
  process.exit(consistency.status || 1);
}
