const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const budgets = [
  { file: "app.js", maxBytes: 280 * 1024 },
  { file: "styles.css", maxBytes: 70 * 1024 },
  { file: "index.html", maxBytes: 30 * 1024 },
  { file: "learn.html", maxBytes: 20 * 1024 },
  { file: "faq.html", maxBytes: 20 * 1024 },
  { file: "sitemap.xml", maxBytes: 15 * 1024 },
];

const errors = [];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

console.log("Performance budget check");

for (const budget of budgets) {
  const filePath = path.join(root, budget.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${budget.file}: missing file`);
    continue;
  }
  const bytes = fs.statSync(filePath).size;
  const percent = Math.round((bytes / budget.maxBytes) * 100);
  console.log(`- ${budget.file}: ${formatKb(bytes)} / ${formatKb(budget.maxBytes)} (${percent}%)`);
  if (bytes > budget.maxBytes) {
    errors.push(`${budget.file}: ${formatKb(bytes)} exceeds budget ${formatKb(budget.maxBytes)}`);
  }
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: performance budgets passed.");
