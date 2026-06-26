const { spawnSync } = require("child_process");

const checks = [
  {
    title: "Preflight",
    command: process.execPath,
    args: ["scripts/preflight.cjs"],
  },
  {
    title: "Fast live check",
    command: process.execPath,
    args: ["scripts/check-live-site.cjs", "--fast"],
  },
  {
    title: "Monetization readiness",
    command: process.execPath,
    args: ["scripts/monetization-report.cjs"],
  },
  {
    title: "Revenue dashboard",
    command: process.execPath,
    args: ["scripts/revenue-dashboard.cjs"],
  },
  {
    title: "Content depth report",
    command: process.execPath,
    args: ["scripts/content-report.cjs"],
  },
  {
    title: "Indexing priority",
    command: process.execPath,
    args: ["scripts/indexing-priority.cjs"],
  },
  {
    title: "External account progress",
    command: process.execPath,
    args: ["scripts/external-account-status.cjs"],
  },
  {
    title: "External account next action",
    command: process.execPath,
    args: ["scripts/external-next-action.cjs"],
  },
  {
    title: "Service next action",
    command: process.execPath,
    args: ["scripts/service-next-action.cjs"],
  },
];

console.log("Weekly maintenance check");
console.log("");
console.log("Goal: keep the live site healthy, ad-safe, and ready for Search Console/AdSense work.");

for (const check of checks) {
  const label = [check.command, ...check.args].join(" ");
  console.log(`\n## ${check.title}`);
  console.log(`> ${label}`);

  const result = spawnSync(check.command, check.args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\nFailed: ${check.title}`);
    process.exit(result.status || 1);
  }
}

console.log("");
console.log("Weekly operator actions:");
console.log("- Check Search Console queries and indexing status.");
console.log("- Export Search Console queries CSV, then run scripts/seed-search-console-candidates.cjs search-console-queries.csv --write.");
console.log("- Use scripts/indexing-priority.cjs before manual indexing requests.");
console.log("- Improve one article that has impressions, clicks, or weak engagement.");
console.log("- Test one Baduk AI game and one Omok AI game on mobile.");
console.log("- Record Search Console or AdSense account progress in EXTERNAL_ACCOUNT_CHECKLIST.md.");
console.log("- Use scripts/external-next-action.cjs when the next account task is unclear.");
console.log("- Use scripts/service-next-action.cjs to choose between account work and the next content task.");
console.log("");
console.log("OK: weekly maintenance checks passed.");
