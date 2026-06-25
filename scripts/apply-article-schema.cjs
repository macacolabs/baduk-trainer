const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteBase = "https://macacolabs.github.io/baduk-trainer/";

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
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-threats.html",
  "omok-open-three.html",
  "omok-ai-difficulty.html",
  "omok-practice-routine.html",
];

function extract(html, pattern, file, label) {
  const match = html.match(pattern);
  if (!match) throw new Error(`${file}: missing ${label}`);
  return match[1].trim();
}

function schemaFor(file, html) {
  const name = extract(html, /<h1>([^<]+)<\/h1>/, file, "h1");
  const description = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/, file, "description");
  const url = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/, file, "canonical");
  const teaches = file.startsWith("omok") ? "오목" : "바둑";
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    url,
    inLanguage: "ko",
    learningResourceType: "Article",
    educationalLevel: "Beginner",
    teaches,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "큰돌",
      url: siteBase,
    },
  };
}

let changed = 0;

for (const file of articleFiles) {
  const filePath = path.join(root, file);
  const html = fs.readFileSync(filePath, "utf8");
  if (html.includes('"@type": "LearningResource"')) continue;
  const marker = '    <link rel="stylesheet" href="styles.css" />';
  if (!html.includes(marker)) throw new Error(`${file}: stylesheet marker not found`);
  const script = [
    marker,
    '    <script type="application/ld+json">',
    JSON.stringify(schemaFor(file, html), null, 6)
      .split("\n")
      .map((line) => `      ${line}`)
      .join("\n"),
    "    </script>",
  ].join("\n");
  fs.writeFileSync(filePath, html.replace(marker, script));
  changed += 1;
}

console.log(`Article schema applied. Updated ${changed} files.`);
