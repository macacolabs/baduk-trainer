const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const start = "    <!-- SEARCH_CONSOLE_VERIFICATION_START -->";
const end = "    <!-- SEARCH_CONSOLE_VERIFICATION_END -->";
const meta = process.env.SEARCH_CONSOLE_META || process.argv.slice(2).join(" ");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!meta.trim()) {
  fail("Provide the Search Console meta tag as SEARCH_CONSOLE_META or as an argument.");
}

if (!/^<meta\s+name="google-site-verification"\s+content="[^"]+"\s*\/?>$/.test(meta.trim())) {
  fail('Expected a tag like: <meta name="google-site-verification" content="...">');
}

const html = fs.readFileSync(indexPath, "utf8");
const startIndex = html.indexOf(start);
const endIndex = html.indexOf(end);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  fail("Search Console verification markers are missing in index.html.");
}

const before = html.slice(0, startIndex + start.length);
const after = html.slice(endIndex);
const next = `${before}\n    ${meta.trim()}\n${after}`;

fs.writeFileSync(indexPath, next);
console.log("Updated index.html with Search Console verification meta tag.");
