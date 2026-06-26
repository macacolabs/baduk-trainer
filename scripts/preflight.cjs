const { spawnSync } = require("child_process");

const includeLive = process.argv.includes("--live");

const checks = [
  [process.execPath, ["--check", "scripts/site-content.cjs"]],
  [process.execPath, ["--check", "scripts/weekly-summary.cjs"]],
  [process.execPath, ["--check", "app.js"]],
  [process.execPath, ["--check", "scripts/seed-search-console-candidates.cjs"]],
  [process.execPath, ["scripts/check-search-console-meta.cjs"]],
  [process.execPath, ["scripts/check-service-readiness.cjs"]],
  [process.execPath, ["scripts/check-content-quality.cjs"]],
  [process.execPath, ["scripts/check-seo-metadata.cjs"]],
  [process.execPath, ["scripts/check-social-metadata.cjs"]],
  [process.execPath, ["scripts/check-learning-pathways.cjs"]],
  [process.execPath, ["scripts/content-queue.cjs"]],
  [process.execPath, ["scripts/sync-sitemap.cjs"]],
  [process.execPath, ["scripts/sync-feed.cjs"]],
  [process.execPath, ["scripts/sync-learn-itemlist.cjs"]],
  [process.execPath, ["scripts/check-links.cjs"]],
  [process.execPath, ["scripts/check-trust-pages.cjs"]],
  [process.execPath, ["scripts/check-pwa.cjs"]],
  [process.execPath, ["scripts/check-submission-packet.cjs"]],
  [process.execPath, ["scripts/indexing-priority.cjs"]],
  [process.execPath, ["scripts/external-account-status.cjs"]],
  [process.execPath, ["scripts/check-external-checklist-consistency.cjs"]],
  [process.execPath, ["scripts/service-next-action.cjs"]],
  [process.execPath, ["scripts/check-ad-placement.cjs"]],
  [process.execPath, ["scripts/check-ads-txt.cjs"]],
  [process.execPath, ["scripts/check-performance-budget.cjs"]],
  [process.execPath, ["scripts/build-pages-artifact.cjs", "--check"]],
];

if (includeLive) {
  checks.push([process.execPath, ["scripts/check-live-site.cjs"]]);
}

console.log(includeLive ? "Preflight check with live site" : "Preflight check");

for (const [command, args] of checks) {
  const label = [command, ...args].join(" ");
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`\nFailed: ${label}`);
    process.exit(result.status || 1);
  }
}

console.log("\nOK: preflight checks passed.");
