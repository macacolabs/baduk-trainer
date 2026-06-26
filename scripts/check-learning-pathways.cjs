const fs = require("fs");
const path = require("path");
const { articleFiles } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

function section(html, className) {
  return html.match(new RegExp(`<section class="${className}"[\\s\\S]*?<\\/section>`))?.[0] || "";
}

function linksIn(html) {
  return Array.from(html.matchAll(/href="([^"]+\.html)"/g), (match) => match[1]);
}

function unique(items) {
  return [...new Set(items)];
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const file of articleFiles) {
  check(fs.existsSync(filePath(file)), `${file}: missing article file`);
  if (!fs.existsSync(filePath(file))) continue;

  const html = read(file);
  const related = section(html, "article-card-grid related-learning");
  const relatedLinks = unique(linksIn(related));
  const allLinks = unique(linksIn(html));

  check(related, `${file}: missing related learning section`);
  check(relatedLinks.length >= 3, `${file}: expected at least 3 related links, got ${relatedLinks.length}`);
  check(!relatedLinks.includes(file), `${file}: related learning links to itself`);
  check(/class="doc-back"/.test(html), `${file}: missing back navigation`);
  warn(allLinks.length >= 5, `${file}: weak onward navigation (${allLinks.length} internal links)`);

  for (const link of relatedLinks) {
    check(fs.existsSync(filePath(link)), `${file}: related link target missing: ${link}`);
  }
}

const hubChecks = [
  ["learn.html", ["baduk-learn.html", "omok-learn.html", "faq.html"]],
  ["baduk-learn.html", ["learn.html", "baduk-9x9-beginner.html", "baduk-5k-to-1k.html"]],
  ["omok-learn.html", ["learn.html", "omok-strategy.html", "omok-ai-difficulty.html"]],
  ["faq.html", ["learn.html", "baduk-beginner.html", "omok-strategy.html"]],
];

for (const [file, requiredLinks] of hubChecks) {
  check(fs.existsSync(filePath(file)), `${file}: missing hub page`);
  if (!fs.existsSync(filePath(file))) continue;
  const html = read(file);
  for (const link of requiredLinks) {
    check(html.includes(`href="${link}"`), `${file}: missing pathway link to ${link}`);
  }
}

console.log("Learning pathway check");
console.log(`Checked ${articleFiles.length} learning articles and ${hubChecks.length} hub pages.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: learning pathways are connected.");
