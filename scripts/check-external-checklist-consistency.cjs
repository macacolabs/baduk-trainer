const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");

const dependencies = [
  {
    item: ["AdSense 신청 전", "Search Console 소유권 확인 완료"],
    requires: [["Search Console", "Search Console에서 소유권 확인 완료"]],
  },
  {
    item: ["AdSense 신청 전", "sitemap 제출 완료"],
    requires: [["Search Console", "sitemap.xml 제출"]],
  },
  {
    item: ["AdSense 신청", "SUBMISSION_PACKET.md"],
    requires: [
      ["AdSense 신청 전", "Search Console 소유권 확인 완료"],
      ["AdSense 신청 전", "sitemap 제출 완료"],
      ["AdSense 신청 전", "주요 학습 글 접근 확인"],
      ["AdSense 신청 전", "privacy.html 접근 확인"],
      ["AdSense 신청 전", "terms.html 접근 확인"],
      ["AdSense 신청 전", "실제 광고 스크립트가 아직 없는지 확인"],
      ["AdSense 신청 전", "check-service-readiness"],
      ["AdSense 신청 전", "check-links"],
      ["AdSense 신청 전", "check-performance-budget"],
    ],
  },
  {
    item: ["AdSense 신청", "사이트 URL 등록"],
    requires: [["AdSense 신청", "SUBMISSION_PACKET.md"]],
  },
  {
    item: ["AdSense 신청", "AdSense 심사용 코드"],
    requires: [["AdSense 신청", "사이트 URL 등록"]],
  },
  {
    item: ["AdSense 승인 후", "광고 단위 slot ID"],
    requires: [["AdSense 신청", "AdSense 심사용 코드"]],
  },
  {
    item: ["AdSense 승인 후", "GitHub Actions Variables"],
    requires: [["AdSense 승인 후", "광고 단위 slot ID"]],
  },
  {
    item: ["AdSense 승인 후", "Pages artifact"],
    requires: [["AdSense 승인 후", "GitHub Actions Variables"]],
  },
];

function fail(message) {
  console.error(`External checklist consistency failed: ${message}`);
  process.exit(1);
}

function parseChecklist(markdown) {
  const tasks = [];
  let section = "";

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)\s*$/);
    if (heading) {
      section = heading[1].trim();
      continue;
    }

    const task = line.match(/^- \[( |x|X)\]\s+(.+)$/);
    if (task && section) {
      tasks.push({
        section,
        done: task[1].toLowerCase() === "x",
        text: task[2].trim(),
      });
    }
  }

  return tasks;
}

function findTask(tasks, [sectionQuery, textQuery]) {
  return tasks.find((task) => task.section.includes(sectionQuery) && task.text.includes(textQuery));
}

if (!fs.existsSync(checklistPath)) fail("EXTERNAL_ACCOUNT_CHECKLIST.md is missing.");

const tasks = parseChecklist(fs.readFileSync(checklistPath, "utf8"));
const errors = [];

for (const dependency of dependencies) {
  const item = findTask(tasks, dependency.item);
  if (!item) {
    errors.push(`missing item: [${dependency.item[0]}] ${dependency.item[1]}`);
    continue;
  }
  if (!item.done) continue;

  for (const requirementQuery of dependency.requires) {
    const requirement = findTask(tasks, requirementQuery);
    if (!requirement) {
      errors.push(`missing prerequisite: [${requirementQuery[0]}] ${requirementQuery[1]}`);
      continue;
    }
    if (!requirement.done) {
      errors.push(`[${item.section}] ${item.text} is done before [${requirement.section}] ${requirement.text}`);
    }
  }
}

console.log("External checklist consistency check");
console.log(`Checked ${dependencies.length} dependency rule(s).`);

if (errors.length) {
  console.error("");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("");
console.log("OK: external account checklist dependencies are consistent.");
