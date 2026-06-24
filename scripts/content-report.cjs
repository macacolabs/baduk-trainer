const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const articleFiles = [
  "baduk-beginner.html",
  "baduk-atari.html",
  "baduk-liberties.html",
  "baduk-glossary.html",
  "baduk-opening.html",
  "baduk-life-and-death.html",
  "baduk-endgame.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-threats.html",
  "omok-ai-difficulty.html",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function textOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function title(html) {
  const match = html.match(/<h1>([^<]+)<\/h1>/);
  return match ? match[1] : "(no h1)";
}

function count(html, pattern) {
  return (html.match(pattern) || []).length;
}

const rows = articleFiles.map((file) => {
  const html = read(file);
  const chars = textOnly(html).length;
  const h2 = count(html, /<h2>/g);
  const links = count(html, /href="[^"]+\.html"/g);
  const priority = chars < 750 ? "보강" : chars < 950 ? "관찰" : "양호";
  return {
    file,
    title: title(html),
    chars,
    h2,
    links,
    priority,
  };
});

rows.sort((a, b) => a.chars - b.chars);

console.log("Content operation report");
console.log(`Checked ${rows.length} learning articles.`);
console.log("");
console.log("| priority | file | chars | h2 | links | title |");
console.log("| --- | --- | ---: | ---: | ---: | --- |");
for (const row of rows) {
  console.log(`| ${row.priority} | ${row.file} | ${row.chars} | ${row.h2} | ${row.links} | ${row.title} |`);
}

const next = rows.filter((row) => row.priority !== "양호").slice(0, 3);
if (next.length) {
  console.log("");
  console.log("Next content improvements:");
  for (const row of next) {
    console.log(`- ${row.file}: add examples, screenshots, or practice steps.`);
  }
} else {
  console.log("");
  console.log("All learning articles are above the current depth target.");
}
