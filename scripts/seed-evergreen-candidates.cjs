const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "CONTENT_PLAN.md");
const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const limit = numberArg("--limit", 5);

const candidates = [
  {
    priority: "중간",
    title: "바둑 13줄은 언제 시작하면 좋을까",
    intent: "9줄 바둑은 익숙하지만 19줄은 부담스러운 입문자가 13줄 시작 기준을 찾는 검색",
    links: ["baduk-9x9-to-19x19.html", "baduk-19x19-start.html", "baduk-ai-difficulty.html", "baduk-rank-roadmap.html"],
  },
  {
    priority: "중간",
    title: "바둑 초보는 몇 수까지 읽어야 할까",
    intent: "바둑 초보가 단수, 사활, 전투에서 몇 수 앞까지 읽어야 하는지 알고 싶은 검색",
    links: ["baduk-candidate-moves.html", "baduk-atari.html", "baduk-life-death-vital-point.html", "baduk-10k-to-5k.html"],
  },
  {
    priority: "중간",
    title: "오목 선공은 정말 필승일까",
    intent: "오목에서 선공이 얼마나 유리한지, 자유룰과 렌주룰 차이를 알고 싶은 검색",
    links: ["omok-first-second.html", "omok-center-opening.html", "omok-forbidden-moves.html", "omok-second-player-counterattack.html"],
  },
  {
    priority: "중간",
    title: "바둑 계가가 헷갈릴 때 어디부터 세야 할까",
    intent: "바둑 계가에서 집, 죽은 돌, 공배를 어떤 순서로 세야 하는지 찾는 검색",
    links: ["baduk-territory-scoring.html", "baduk-scoring-practice-guide.html", "baduk-dead-stones-scoring.html", "baduk-neutral-points.html"],
  },
  {
    priority: "중간",
    title: "오목 막기만 하다 공격권을 잃는 이유",
    intent: "오목에서 계속 막기만 하다가 공격 기회를 놓치는 사용자가 전환 기준을 찾는 검색",
    links: ["omok-defense-to-attack.html", "omok-counterattack-after-block.html", "omok-attack-timing.html", "omok-blocking-point.html"],
  },
  {
    priority: "중간",
    title: "바둑 끝내기에서 몇 집짜리부터 커 보일까",
    intent: "끝내기에서 어느 수가 큰지 감이 안 오는 초보자가 집 차이 기준을 찾는 검색",
    links: ["baduk-endgame-big-move.html", "baduk-endgame-sente.html", "baduk-territory-scoring.html", "baduk-scoring-order.html"],
  },
  {
    priority: "중간",
    title: "바둑 정석은 언제부터 외워야 할까",
    intent: "바둑 정석을 초보 때부터 외워야 하는지, 언제 의미를 봐야 하는지 찾는 검색",
    links: ["baduk-joseki-study.html", "baduk-opening-corner.html", "baduk-opening.html", "baduk-10k-to-5k.html"],
  },
  {
    priority: "중간",
    title: "바둑 단수쳐도 손해인 돌은 어떻게 구분할까",
    intent: "단수와 포획은 보이지만 잡아도 손해인 작은 돌을 구분하고 싶은 초보 검색",
    links: ["baduk-profitable-capture.html", "baduk-atari.html", "baduk-save-or-sacrifice.html", "baduk-sacrifice-moments.html"],
  },
  {
    priority: "중간",
    title: "오목 4목을 막았는데도 지는 이유",
    intent: "오목에서 4목을 막았는데 다음 위협을 놓쳐 지는 사용자가 수비 후 확인 순서를 찾는 검색",
    links: ["omok-block-four.html", "omok-blocking-point.html", "omok-counterattack-after-block.html", "omok-review-mistakes.html"],
  },
  {
    priority: "중간",
    title: "오목 한쪽만 막으면 왜 늦을까",
    intent: "오목 양방향 위협에서 한쪽만 막고도 지는 이유를 알고 싶은 검색",
    links: ["omok-defend-double-threat.html", "omok-double-threat.html", "omok-attack-defense-priority.html", "omok-blocking-point.html"],
  },
  {
    priority: "높음",
    title: "바둑 규칙 쉽게 배우는 순서",
    intent: "바둑 규칙을 처음 검색한 사용자가 착수, 활로, 단수, 패를 순서대로 알고 싶은 검색",
    links: ["baduk-beginner.html", "baduk-liberties.html", "baduk-atari.html", "baduk-ko-rule.html"],
  },
  {
    priority: "높음",
    title: "오목 4목을 놓치지 않는 체크리스트",
    intent: "오목에서 바로 지는 4목 차단 실수를 줄이고 싶은 초보자 검색",
    links: ["omok-block-four.html", "omok-blocking-point.html", "omok-open-four.html", "omok-defense-to-attack.html"],
  },
  {
    priority: "중간",
    title: "오목 AI와 연습할 때 난이도 올리는 기준",
    intent: "오목 AI 난이도를 언제 올려야 하는지 알고 싶은 사용자 검색",
    links: ["omok-ai-difficulty.html", "omok-difficulty-choice.html", "omok-hard-ai-losses.html", "omok-practice-routine.html"],
  },
  {
    priority: "중간",
    title: "바둑 집 계산 연습을 처음 시작하는 법",
    intent: "바둑 계가와 집 계산을 실전 전에 작게 연습하고 싶은 입문자 검색",
    links: ["baduk-territory-scoring.html", "baduk-scoring-practice-start.html", "baduk-komi-6-5.html", "baduk-endgame.html"],
  },
  {
    priority: "중간",
    title: "바둑 1급 목표자가 매주 확인할 복기 질문",
    intent: "5급 이후 1급을 목표로 대국 복기를 어떻게 해야 하는지 찾는 검색",
    links: ["baduk-5k-to-1k.html", "baduk-1k-daily-routine.html", "baduk-candidate-moves.html", "baduk-review-note.html"],
  },
  {
    priority: "중간",
    title: "바둑 공배는 언제 메워야 할까",
    intent: "끝내기와 계가 직전에 공배를 메워야 하는지 헷갈리는 입문자 검색",
    links: ["baduk-territory-scoring.html", "baduk-scoring-practice-guide.html", "baduk-endgame.html", "baduk-dead-stones-scoring.html"],
  },
  {
    priority: "중간",
    title: "바둑 빅은 어떻게 구분할까",
    intent: "사활에서 서로 잡을 수 없는 빅 모양을 죽은 돌과 구분하려는 검색",
    links: ["baduk-life-and-death.html", "baduk-alive-dead-stones.html", "baduk-false-eye.html", "baduk-territory-scoring.html"],
  },
  {
    priority: "중간",
    title: "오목 닫힌 3은 언제 막아야 할까",
    intent: "열린 3과 닫힌 3의 위험도를 구분하고 막을지 공격할지 고르려는 검색",
    links: ["omok-open-three.html", "omok-three-vs-four.html", "omok-attack-defense-priority.html", "omok-when-to-defend.html"],
  },
  {
    priority: "중간",
    title: "오목 후공은 어떻게 반격할까",
    intent: "후공으로 계속 막기만 하다 지는 사용자가 반격 흐름을 찾는 검색",
    links: ["omok-first-second.html", "omok-defense-to-attack.html", "omok-counterattack-after-block.html", "omok-blocking-point.html"],
  },
  {
    priority: "낮음",
    title: "바둑 9줄에서 19줄로 넘어가는 기준",
    intent: "9줄 연습 후 언제 19줄 바둑을 시작할지 알고 싶은 입문자 검색",
    links: ["baduk-9x9-beginner.html", "baduk-19x19-start.html", "baduk-rank-roadmap.html", "baduk-ai-review.html"],
  },
  {
    priority: "높음",
    title: "바둑 30급에서 20급으로 가는 공부 순서",
    intent: "바둑 입문자가 단수와 활로를 익힌 뒤 20급 수준까지 무엇을 반복해야 하는지 찾는 검색",
    links: ["baduk-beginner.html", "baduk-liberties.html", "baduk-atari.html", "baduk-cut-connect.html", "baduk-rank-roadmap.html"],
  },
  {
    priority: "중간",
    title: "바둑 초보는 어떤 판부터 복기해야 할까",
    intent: "초보자가 9줄과 19줄 대국 중 어떤 판을 먼저 복기해야 하는지 알고 싶은 검색",
    links: ["baduk-review-note.html", "baduk-ai-review.html", "baduk-9x9-beginner.html", "baduk-19x19-start.html"],
  },
  {
    priority: "중간",
    title: "바둑 사활 10분 루틴은 어떻게 만들까",
    intent: "사활 문제를 매일 짧게 풀며 실전 감각을 올리고 싶은 사용자 검색",
    links: ["baduk-life-and-death-practice.html", "baduk-life-death-vital-point.html", "baduk-false-eye.html", "baduk-10k-to-5k.html"],
  },
  {
    priority: "중간",
    title: "오목 초보가 자주 지는 패턴",
    intent: "오목 초보가 반복해서 지는 열린 3, 4목, 수비 지연 실수를 알고 싶은 검색",
    links: ["omok-strategy.html", "omok-block-four.html", "omok-open-three.html", "omok-review-mistakes.html"],
  },
  {
    priority: "낮음",
    title: "오목 선공 첫 수 이후 어디에 둘까",
    intent: "오목에서 중앙 첫 수 다음 배치를 어떻게 이어가야 하는지 찾는 입문자 검색",
    links: ["omok-center-opening.html", "omok-first-10-moves.html", "omok-two-stones.html", "omok-threats.html"],
  },
  {
    priority: "높음",
    title: "바둑 AI 난이도는 어떻게 고르면 좋을까",
    intent: "바둑 AI 대국을 시작할 때 9줄, 13줄, 19줄과 난이도를 어떻게 고를지 알고 싶은 입문자 검색",
    links: ["baduk-ai-review.html", "baduk-9x9-beginner.html", "baduk-19x19-start.html", "baduk-rank-roadmap.html", "baduk-review-note.html"],
  },
  {
    priority: "중간",
    title: "바둑 첫 50수는 무엇을 봐야 할까",
    intent: "19줄 바둑 초반 50수에서 귀, 변, 중앙, 약한 돌을 어떤 순서로 봐야 하는지 찾는 검색",
    links: ["baduk-opening.html", "baduk-opening-corner.html", "baduk-side-opening.html", "baduk-center-opening.html", "baduk-beginner-mistakes.html"],
  },
  {
    priority: "중간",
    title: "바둑 초보가 돌을 버려도 되는 순간",
    intent: "잡힐 돌을 무리하게 살리다가 손해 보는 초보가 버릴 돌 기준을 알고 싶은 검색",
    links: ["baduk-save-or-sacrifice.html", "baduk-profitable-capture.html", "baduk-attack-weak-stones.html", "baduk-candidate-moves.html"],
  },
  {
    priority: "중간",
    title: "오목 상대가 중앙을 먼저 잡으면 어떻게 할까",
    intent: "오목 후공이 상대 중앙 첫 수에 어떻게 대응하고 반격할지 알고 싶은 검색",
    links: ["omok-first-second.html", "omok-center-opening.html", "omok-second-player-counterattack.html", "omok-defense-to-attack.html", "omok-after-first-move.html"],
  },
  {
    priority: "낮음",
    title: "바둑 9줄 AI에게 계속 지는 이유",
    intent: "9줄 바둑 AI에게 계속 지는 입문자가 반복 실수와 복기 기준을 찾는 검색",
    links: ["baduk-9x9-beginner.html", "baduk-9x9-first-move.html", "baduk-atari-practice.html", "baduk-liberties.html", "baduk-ai-review.html"],
  },
  {
    priority: "중간",
    title: "바둑 19줄에서 초반에 너무 빨리 싸우는 이유",
    intent: "19줄 바둑 초반에 작은 전투를 시작했다가 큰 자리를 놓치는 초보자가 원인을 찾는 검색",
    links: ["baduk-first-50-moves.html", "baduk-opening.html", "baduk-attack-weak-stones.html", "baduk-beginner-mistakes.html"],
  },
  {
    priority: "중간",
    title: "바둑 사활 문제를 풀어도 실전에서 죽는 이유",
    intent: "사활 문제는 푸는데 실제 대국에서 큰 돌이 죽는 이유와 복기 기준을 찾는 검색",
    links: ["baduk-life-and-death-practice.html", "baduk-life-death-vital-point.html", "baduk-false-eye.html", "baduk-large-group-death.html"],
  },
  {
    priority: "중간",
    title: "오목 열린 3을 만들었는데 왜 지는 걸까",
    intent: "오목에서 열린 3을 만들고도 상대 4목이나 양방향 위협을 놓쳐 지는 이유를 찾는 검색",
    links: ["omok-open-three.html", "omok-attack-defense-priority.html", "omok-double-threat.html", "omok-review-mistakes.html"],
  },
  {
    priority: "중간",
    title: "오목 AI에게 계속 지는 이유",
    intent: "오목 AI 대국에서 반복 패배하는 사용자가 난이도, 복기, 위협 확인 기준을 찾는 검색",
    links: ["omok-ai-difficulty.html", "omok-hard-ai-losses.html", "omok-review-mistakes.html", "omok-practice-routine.html"],
  },
  {
    priority: "낮음",
    title: "바둑 1급 목표자는 AI 복기를 얼마나 해야 할까",
    intent: "1급을 목표로 하는 사용자가 AI 복기를 오래 하지 않고 후보수와 약점만 고르는 법을 찾는 검색",
    links: ["baduk-5k-to-1k.html", "baduk-1k-weekly-review.html", "baduk-ai-review.html", "baduk-candidate-moves.html"],
  },
];

function usage() {
  console.log("Usage:");
  console.log("  node scripts/seed-evergreen-candidates.cjs");
  console.log("  node scripts/seed-evergreen-candidates.cjs --write --limit=3");
}

function fail(message) {
  console.error(`Evergreen candidate seeding failed: ${message}`);
  usage();
  process.exit(1);
}

function numberArg(flag, fallback) {
  const raw = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!raw) return fallback;
  const value = Number(raw.split("=")[1]);
  return Number.isFinite(value) && value >= 1 ? value : fallback;
}

function escapeCell(value) {
  return value.replace(/\|/g, "/").trim();
}

function rowFor(candidate) {
  return `| ${candidate.priority} | ${escapeCell(candidate.title)} | ${escapeCell(candidate.intent)} | ${candidate.links.map((link) => `\`${link}\``).join(", ")} |`;
}

function appendRows(markdown, rows) {
  const sectionHeading = "## Search Console 전 예비 후보";
  const tableHeader = "| 우선순위 | 후보 제목 | 검색 의도 | 연결할 기존 글 |\n| --- | --- | --- | --- |";
  const body = rows.map(rowFor).join("\n");

  if (!markdown.includes(sectionHeading)) {
    const monthlyIndex = markdown.indexOf("\n## 월간 운영 루틴");
    const section = `\n\n${sectionHeading}\n\nSearch Console 검색어가 아직 없거나 CSV를 받기 전이면 아래 후보로 콘텐츠 큐를 유지합니다.\n\n${tableHeader}\n${body}\n`;
    if (monthlyIndex === -1) return `${markdown.trimEnd()}${section}`;
    return `${markdown.slice(0, monthlyIndex).trimEnd()}${section}${markdown.slice(monthlyIndex)}`;
  }

  const sectionIndex = markdown.indexOf(sectionHeading);
  const insertIndex = markdown.indexOf("\n## ", sectionIndex + sectionHeading.length);
  const targetIndex = insertIndex === -1 ? markdown.length : insertIndex;
  return `${markdown.slice(0, targetIndex).trimEnd()}\n${body}\n${markdown.slice(targetIndex)}`;
}

if (!fs.existsSync(planPath)) fail("CONTENT_PLAN.md is missing.");
if (limit < 1) fail("--limit must be at least 1.");

const markdown = fs.readFileSync(planPath, "utf8");

for (const candidate of candidates) {
  if (!["높음", "중간", "낮음"].includes(candidate.priority)) fail(`invalid priority: ${candidate.title}`);
  if (candidate.links.length < 2) fail(`candidate needs at least two links: ${candidate.title}`);
  for (const link of candidate.links) {
    if (!fs.existsSync(path.join(root, link))) fail(`missing related page: ${candidate.title} -> ${link}`);
  }
}

const selected = candidates
  .filter((candidate) => !markdown.includes(`| ${candidate.priority} | ${candidate.title} |`) && !markdown.includes(`| 완료 | ${candidate.title} |`))
  .slice(0, limit);

console.log("Evergreen content candidate seeding");
console.log(`Mode: ${writeMode ? "write" : "preview"}`);
console.log(`Limit: ${limit}`);
console.log("");

if (!selected.length) {
  console.log("No evergreen candidates to add.");
  process.exit(0);
}

console.log("| priority | title | search intent | related links |");
console.log("| --- | --- | --- | --- |");
for (const candidate of selected) {
  console.log(`| ${candidate.priority} | ${candidate.title} | ${candidate.intent} | ${candidate.links.map((link) => `\`${link}\``).join(", ")} |`);
}

if (!writeMode) {
  console.log("");
  console.log("Preview only. Re-run with --write to append these rows to CONTENT_PLAN.md.");
  process.exit(0);
}

fs.writeFileSync(planPath, appendRows(markdown, selected));
console.log("");
console.log(`Added ${selected.length} evergreen candidate(s) to CONTENT_PLAN.md.`);
console.log("Next:");
console.log("- node scripts/content-queue.cjs");
