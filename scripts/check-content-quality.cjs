const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const articleFiles = [
  "baduk-beginner.html",
  "baduk-9x9-beginner.html",
  "baduk-atari.html",
  "baduk-atari-practice.html",
  "baduk-liberties.html",
  "baduk-glossary.html",
  "baduk-opening.html",
  "baduk-opening-corner.html",
  "baduk-ai-review.html",
  "baduk-life-and-death.html",
  "baduk-life-and-death-practice.html",
  "baduk-10k-to-5k.html",
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-threats.html",
  "omok-open-three.html",
  "omok-ai-difficulty.html",
  "omok-practice-routine.html",
];

const minimumTextLength = 450;
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function plainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

for (const file of articleFiles) {
  const html = read(file);
  const text = plainText(html);
  const h2Count = countMatches(html, /<h2>/g);
  const relatedLinks = countMatches(html, /<section class="article-card-grid related-learning"[\s\S]*?<a href="[^"]+\.html"/g);

  check(text.length >= minimumTextLength, `${file}: article text is too short (${text.length} chars)`);
  check(/<h1>[^<]+<\/h1>/.test(html), `${file}: missing h1`);
  check(/class="article-lead"/.test(html), `${file}: missing article lead`);
  check(h2Count >= 3, `${file}: expected at least 3 h2 sections, got ${h2Count}`);
  check(/class="article-card-grid related-learning"/.test(html), `${file}: missing related learning section`);
  check(relatedLinks >= 1, `${file}: related learning section has no links`);
  check(/class="ad-slot ad-slot-article"/.test(html), `${file}: missing article ad placeholder`);
  warn(text.length >= 650, `${file}: consider expanding article depth (${text.length} chars)`);
}

console.log("Content quality check");
console.log(`Checked ${articleFiles.length} learning articles.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: content quality checks passed.");
