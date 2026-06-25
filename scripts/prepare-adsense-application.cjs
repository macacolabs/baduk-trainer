const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");
const includeLive = process.argv.includes("--live");

const requiredBeforeApply = [
  ["Search Console", "URL 접두어 속성으로 사이트 등록"],
  ["Search Console", "HTML meta verification 태그 발급"],
  ["Search Console", "SEARCH_CONSOLE_META"],
  ["Search Console", "변경사항 배포"],
  ["Search Console", "소유권 확인 완료"],
  ["Search Console", "sitemap.xml"],
  ["Search Console", "메인 페이지 색인 요청"],
  ["Search Console", "learn.html 색인 요청"],
  ["Search Console", "faq.html 색인 요청"],
  ["Search Console", "주요 학습 글 3개 이상 색인 요청"],
  ["AdSense 신청 전", "Search Console 소유권 확인 완료"],
  ["AdSense 신청 전", "sitemap 제출 완료"],
  ["AdSense 신청 전", "주요 학습 글 접근 확인"],
  ["AdSense 신청 전", "privacy.html 접근 확인"],
  ["AdSense 신청 전", "terms.html 접근 확인"],
  ["AdSense 신청 전", "실제 광고 스크립트가 아직 없는지 확인"],
  ["AdSense 신청 전", "check-service-readiness"],
  ["AdSense 신청 전", "check-links"],
  ["AdSense 신청 전", "check-performance-budget"],
];

function fail(message) {
  console.error(`AdSense application prep failed: ${message}`);
  process.exit(1);
}

function run(label, args) {
  console.log(`\n> node ${args.join(" ")}`);
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) fail(`${label} failed.`);
}

function parseChecklist() {
  if (!fs.existsSync(checklistPath)) fail("EXTERNAL_ACCOUNT_CHECKLIST.md is missing.");
  const lines = fs.readFileSync(checklistPath, "utf8").split(/\r?\n/);
  const tasks = [];
  let section = "";

  for (const line of lines) {
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

function findTask(tasks, sectionQuery, textQuery) {
  const normalizedTextQuery = textQuery.replace(/`/g, "");
  return tasks.find((task) => {
    const normalizedSection = task.section.replace(/`/g, "");
    const normalizedText = task.text.replace(/`/g, "");
    return normalizedSection.includes(sectionQuery) && normalizedText.includes(normalizedTextQuery);
  });
}

function checkExternalReadiness() {
  const tasks = parseChecklist();
  const missing = [];
  const open = [];

  for (const [sectionQuery, textQuery] of requiredBeforeApply) {
    const task = findTask(tasks, sectionQuery, textQuery);
    if (!task) {
      missing.push(`[${sectionQuery}] ${textQuery}`);
    } else if (!task.done) {
      open.push(`[${task.section}] ${task.text}`);
    }
  }

  if (missing.length) {
    console.log("\nMissing checklist items:");
    for (const item of missing) console.log(`- ${item}`);
    fail("required AdSense checklist items are missing.");
  }

  if (open.length) {
    console.log("\nNot ready for AdSense application yet.");
    console.log("Finish these external tasks first:");
    for (const item of open) console.log(`- ${item}`);
    console.log("\nNext command:");
    console.log("- node scripts/external-next-action.cjs");
    process.exit(1);
  }
}

console.log("AdSense application prep");
console.log(`Site URL: ${siteBase}`);
console.log("Mode: pre-approval");

run("monetization report", ["scripts/monetization-report.cjs"]);
run("preflight", ["scripts/preflight.cjs"]);
if (includeLive) run("live deploy wait", ["scripts/wait-live-deploy.cjs", "--fast"]);
checkExternalReadiness();

console.log("\nOK: AdSense application gate passed.");
console.log("Use these values in AdSense:");
console.log(`- Site URL: ${siteBase}`);
console.log(`- Privacy policy: ${siteBase}privacy.html`);
console.log(`- Terms: ${siteBase}terms.html`);
console.log(`- Learning hub: ${siteBase}learn.html`);
console.log("\nAfter completing the application step:");
console.log('- node scripts/mark-external-task.cjs "AdSense 신청" "SUBMISSION_PACKET.md" --note "AdSense 신청 전 실행 명령 통과"');
console.log('- node scripts/mark-external-task.cjs "AdSense 신청" "사이트 URL 등록" --note "AdSense에 사이트 URL 등록"');
console.log("- node scripts/external-account-status.cjs");
