const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checklistPath = path.join(root, "EXTERNAL_ACCOUNT_CHECKLIST.md");

const siteUrl = "https://macacolabs.github.io/baduk-trainer/";
const sitemapUrl = `${siteUrl}sitemap.xml`;
const links = {
  submissionPacket: "SUBMISSION_PACKET.md",
  searchConsoleGuide: `${siteUrl}search-console.html`,
  adsenseChecklist: `${siteUrl}adsense-checklist.html`,
  searchConsole: "https://search.google.com/search-console",
  adsense: "https://www.google.com/adsense/start/",
};

function fail(message) {
  console.error(`External next action failed: ${message}`);
  process.exit(1);
}

function parseChecklist(markdown) {
  const sections = [];
  let current = null;

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)\s*$/);
    if (heading) {
      current = { name: heading[1].trim(), tasks: [] };
      sections.push(current);
      continue;
    }

    const task = line.match(/^- \[( |x|X)\]\s+(.+)$/);
    if (task && current) {
      current.tasks.push({
        done: task[1].toLowerCase() === "x",
        text: task[2].trim(),
      });
    }
  }

  return sections.filter((section) => section.tasks.length);
}

function matchingGuidance(task) {
  const text = task.text;

  if (/SUBMISSION_PACKET/.test(text)) {
    return {
      why: "제출 전에 사이트 URL, sitemap, 정책 페이지 URL을 한 번에 확인합니다.",
      links: [links.submissionPacket, links.searchConsoleGuide],
      commands: ["node scripts/check-submission-packet.cjs", "node scripts/indexing-priority.cjs", "node scripts/external-account-status.cjs"],
    };
  }

  if (/URL 접두어|사이트 등록/.test(text)) {
    return {
      why: "Search Console에서 URL 접두어 속성으로 사이트를 먼저 등록해야 색인 요청과 sitemap 제출이 가능합니다.",
      links: [links.searchConsole, links.searchConsoleGuide],
      copy: [siteUrl],
    };
  }

  if (/HTML meta verification|소유권 확인|SEARCH_CONSOLE_META/.test(text)) {
    return {
      why: "GitHub Pages는 HTML meta 태그 방식이 가장 단순합니다.",
      links: [links.searchConsole],
      commands: [
        "$env:SEARCH_CONSOLE_META='<meta name=\"google-site-verification\" content=\"발급값\">'",
        "node scripts/apply-search-console-meta.cjs",
        "node scripts/preflight.cjs",
        "git add -A",
        "git commit -m \"Add Search Console verification\"",
        "git push origin main",
      ],
    };
  }

  if (/sitemap/.test(text)) {
    return {
      why: "sitemap을 제출해야 학습 글과 정책 페이지가 빠르게 발견됩니다.",
      links: [links.searchConsole],
      copy: [sitemapUrl],
    };
  }

  if (/색인 요청|주요 학습 글/.test(text)) {
    return {
      why: "처음에는 메인, 학습 허브, FAQ, 핵심 학습 글부터 색인 요청합니다.",
      links: [links.searchConsole, links.submissionPacket],
      copy: [
        siteUrl,
        `${siteUrl}learn.html`,
        `${siteUrl}faq.html`,
        `${siteUrl}baduk-beginner.html`,
        `${siteUrl}baduk-atari.html`,
        `${siteUrl}baduk-liberties.html`,
        `${siteUrl}baduk-ko-rule.html`,
        `${siteUrl}baduk-territory-scoring.html`,
        `${siteUrl}baduk-5k-to-1k.html`,
        `${siteUrl}omok-strategy.html`,
        `${siteUrl}omok-forbidden-moves.html`,
        `${siteUrl}omok-ai-difficulty.html`,
      ],
    };
  }

  if (/monetization-report|내부 blocker/.test(text)) {
    return {
      why: "AdSense 신청 전에는 내부 준비 상태와 외부 계정 작업을 분리해서 확인합니다.",
      links: [links.adsenseChecklist],
      commands: ["node scripts/monetization-report.cjs", "node scripts/preflight.cjs --live"],
    };
  }

  if (/AdSense 계정|사이트 URL 등록|심사용 코드/.test(text)) {
    return {
      why: "Search Console 등록과 sitemap 제출 뒤 AdSense에 사이트를 등록합니다.",
      links: [links.adsense, links.adsenseChecklist],
      copy: [siteUrl],
    };
  }

  if (/승인 후|ads.txt|광고|오클릭|직접 광고 클릭/.test(text)) {
    return {
      why: "승인 후에도 게임판과 조작 버튼 근처에는 광고를 두지 않아야 합니다.",
      links: ["ADSENSE_AFTER_APPROVAL.md"],
      commands: ["node scripts/check-ad-placement.cjs", "$env:ADSENSE_STATUS='approved'; node scripts/check-ad-placement.cjs"],
    };
  }

  if (/Search Console 노출|검색어|색인 제외|유입/.test(text)) {
    return {
      why: "운영 단계에서는 검색어와 색인 제외 사유를 보고 글 보강 우선순위를 정합니다.",
      links: [links.searchConsole, "CONTENT_PLAN.md"],
      commands: ["node scripts/content-report.cjs", "node scripts/content-queue.cjs"],
    };
  }

  return {
    why: "체크리스트 항목을 외부 계정 화면에서 처리한 뒤 완료 표시합니다.",
    links: [links.submissionPacket],
    commands: ["node scripts/external-account-status.cjs"],
  };
}

function completionQuery(text) {
  const withoutCode = text.replace(/`[^`]+`/g, "").replace(/^(의|을|를|에서)\s*/, "").trim();
  return withoutCode || text.replace(/`/g, "").trim();
}

function noteExamples(task) {
  const text = task.text;
  if (/SUBMISSION_PACKET/.test(text)) {
    return ["SUBMISSION_PACKET.md URL과 live sitemap 확인"];
  }
  if (/URL 접두어|사이트 등록/.test(text)) {
    return ["Search Console URL 접두어 속성에 사이트 URL 등록"];
  }
  if (/HTML meta verification/.test(text)) {
    return ["HTML 태그 방식 선택, verification meta 태그 발급"];
  }
  if (/SEARCH_CONSOLE_META|apply-search-console-meta/.test(text)) {
    return ["Search Console meta 태그 적용 후 preflight 통과"];
  }
  if (/변경사항 배포/.test(text)) {
    return ["verification meta 커밋/푸시 후 GitHub Pages 배포 완료"];
  }
  if (/소유권 확인/.test(text)) {
    return ["Search Console에서 소유권 확인 성공"];
  }
  if (/sitemap/.test(text)) {
    return ["Search Console sitemap 메뉴에서 sitemap.xml 제출 완료"];
  }
  if (/색인 요청|주요 학습 글/.test(text)) {
    return ["URL 검사에서 색인 요청 버튼 실행", "요청한 URL 3개 이상 메모"];
  }
  if (/monetization-report|내부 blocker/.test(text)) {
    return ["monetization-report 내부 blocker 없음 확인"];
  }
  if (/광고|ads.txt|오클릭|직접 광고 클릭/.test(text)) {
    return ["광고 위치/ads.txt 확인 완료, 직접 클릭 없음"];
  }
  return ["외부 계정 화면에서 완료 확인"];
}

if (!fs.existsSync(checklistPath)) fail("EXTERNAL_ACCOUNT_CHECKLIST.md is missing.");

const sections = parseChecklist(fs.readFileSync(checklistPath, "utf8"));
const next = sections
  .flatMap((section) => section.tasks.map((task) => ({ ...task, section: section.name })))
  .find((task) => !task.done);

console.log("External account next action");
console.log("");

if (!next) {
  console.log("All external account checklist items are marked done.");
  process.exit(0);
}

const guidance = matchingGuidance(next);

console.log(`Section: ${next.section}`);
console.log(`Task: ${next.text}`);
console.log(`Why: ${guidance.why}`);
console.log("");

if (guidance.links?.length) {
  console.log("Open/check:");
  for (const link of guidance.links) console.log(`- ${link}`);
  console.log("");
}

if (guidance.copy?.length) {
  console.log("Copy values:");
  for (const value of guidance.copy) console.log(`- ${value}`);
  console.log("");
}

if (guidance.commands?.length) {
  console.log("Commands:");
  for (const command of guidance.commands) console.log(`- ${command}`);
  console.log("");
}

const examples = noteExamples(next);
if (examples.length) {
  console.log("Completion note examples:");
  for (const example of examples) console.log(`- ${example}`);
  console.log("");
}

console.log("After completing it:");
console.log(`- node scripts/mark-external-task.cjs "${next.section}" "${completionQuery(next.text)}" --note "${examples[0] || "완료 근거 메모"}"`);
console.log("- node scripts/external-account-status.cjs");
