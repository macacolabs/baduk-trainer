const fs = require("fs");
const path = require("path");
const { articleFiles, learnItemListFiles, siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const learnPath = path.join(root, "learn.html");
const writeMode = process.argv.includes("--write");
const startMarker = "    <!-- LEARNING_ITEMLIST_SCHEMA_START -->";
const endMarker = "    <!-- LEARNING_ITEMLIST_SCHEMA_END -->";

function fail(message) {
  console.error(`Learning item list sync failed: ${message}`);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function titleOf(file) {
  const html = read(file);
  const h1 = html.match(/<h1>([^<]+)<\/h1>/);
  const title = html.match(/<title>([^<]+)<\/title>/);
  return (h1?.[1] || title?.[1] || file).replace(/\s+-\s+큰돌$/, "").trim();
}

function renderSchemaBlock() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "큰돌 대표 학습 글 목록",
    url: `${siteBase}learn.html`,
    inLanguage: "ko",
    numberOfItems: learnItemListFiles.length,
    itemListElement: learnItemListFiles.map((file, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteBase}${file}`,
      name: titleOf(file),
    })),
  };

  return [
    startMarker,
    '    <script type="application/ld+json">',
    `      ${JSON.stringify(schema)}`,
    "    </script>",
    endMarker,
  ].join("\n");
}

function replaceOrInsert(html, block) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);

  if ((start === -1) !== (end === -1)) {
    fail("learn.html has only one item list schema marker.");
  }

  if (start !== -1) {
    return `${html.slice(0, start)}${block}${html.slice(end + endMarker.length)}`;
  }

  const firstScriptEnd = html.indexOf("    </script>");
  if (firstScriptEnd === -1) fail("learn.html has no JSON-LD script insertion point.");
  const insertAt = firstScriptEnd + "    </script>".length;
  return `${html.slice(0, insertAt)}\n${block}${html.slice(insertAt)}`;
}

if (!fs.existsSync(learnPath)) fail("learn.html is missing.");
for (const file of articleFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`article file is missing: ${file}`);
}
for (const file of learnItemListFiles) {
  if (!articleFiles.includes(file)) fail(`ItemList file is not registered as an article: ${file}`);
}

const current = fs.readFileSync(learnPath, "utf8");
const expected = replaceOrInsert(current, renderSchemaBlock());

console.log(writeMode ? "Learning item list sync" : "Learning item list sync check");
console.log(`Expected representative items: ${learnItemListFiles.length} of ${articleFiles.length} articles`);

if (writeMode) {
  fs.writeFileSync(learnPath, expected);
  console.log("Wrote ItemList JSON-LD to learn.html.");
  process.exit(0);
}

if (current !== expected) {
  console.error("\nErrors:");
  console.error("- learn.html ItemList JSON-LD is out of sync.");
  console.error("\nRun:");
  console.error("- node scripts/sync-learn-itemlist.cjs --write");
  process.exit(1);
}

console.log("\nOK: learn.html ItemList JSON-LD matches current representative learning articles.");
