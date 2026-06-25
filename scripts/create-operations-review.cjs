const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "OPERATIONS_REVIEW_TEMPLATE.md");
const reviewDir = path.join(root, "operations-reviews");
const args = process.argv.slice(2);
const printOnly = args.includes("--print");
const force = args.includes("--force");
const monthArg = args.find((arg) => /^\d{4}-\d{2}$/.test(arg));

function fail(message) {
  console.error(`Operations review creation failed: ${message}`);
  console.error("Usage: node scripts/create-operations-review.cjs [YYYY-MM] [--print] [--force]");
  process.exit(1);
}

function currentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function today() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

if (!fs.existsSync(templatePath)) {
  fail("OPERATIONS_REVIEW_TEMPLATE.md is missing.");
}

const targetMonth = monthArg || currentMonth();
const content = fs
  .readFileSync(templatePath, "utf8")
  .replace("`YYYY-MM`", `\`${targetMonth}\``)
  .replace("`YYYY-MM-DD`", `\`${today()}\``);

if (printOnly) {
  console.log(content);
  process.exit(0);
}

if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
}

const reviewPath = path.join(reviewDir, `${targetMonth}.md`);
if (fs.existsSync(reviewPath) && !force) {
  fail(`${path.relative(root, reviewPath)} already exists. Use --force to overwrite.`);
}

fs.writeFileSync(reviewPath, content);
console.log(`Created ${path.relative(root, reviewPath)}`);
console.log("Next:");
console.log("- Fill in Search Console and AdSense values.");
console.log("- Run node scripts/weekly-maintenance.cjs before committing the review.");
