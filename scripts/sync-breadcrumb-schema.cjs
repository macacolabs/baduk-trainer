const fs = require("fs");
const path = require("path");
const { siteBase, sitemapPages } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const writeMode = process.argv.includes("--write");
const start = "    <!-- BREADCRUMB_SCHEMA_START -->";
const end = "    <!-- BREADCRUMB_SCHEMA_END -->";
const errors = [];
let changed = 0;

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

function pageUrl(file) {
  return `${siteBase}${file}`;
}

function titleFor(file, html) {
  return (
    html.match(/<h1>([^<]+)<\/h1>/)?.[1] ||
    html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s+-\s+큰돌$/, "") ||
    file
  ).trim();
}

function sectionFor(file) {
  if (file.startsWith("baduk-")) return { name: "바둑 배우기", item: pageUrl("baduk-learn.html") };
  if (file.startsWith("omok-")) return { name: "오목 배우기", item: pageUrl("omok-learn.html") };
  return null;
}

function crumbSchema(file, html) {
  const items = [{ name: "큰돌", item: siteBase }];
  if (file === "baduk-learn.html" || file === "omok-learn.html") {
    items.push({ name: "학습 허브", item: pageUrl("learn.html") });
  } else {
    const section = sectionFor(file);
    if (section && file !== "baduk-learn.html" && file !== "omok-learn.html") items.push(section);
  }
  items.push({ name: titleFor(file, html), item: pageUrl(file) });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function renderBlock(file, html) {
  return [
    start,
    '    <script type="application/ld+json">',
    `      ${JSON.stringify(crumbSchema(file, html))}`,
    "    </script>",
    end,
  ].join("\n");
}

function replaceBlock(html, block) {
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex !== -1 || endIndex !== -1) {
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      return { error: "breadcrumb markers are incomplete or out of order" };
    }
    return {
      html: `${html.slice(0, startIndex)}${block}${html.slice(endIndex + end.length)}`,
    };
  }

  if (!html.includes("  </head>")) return { error: "missing </head> marker" };
  return { html: html.replace("  </head>", `${block}\n  </head>`) };
}

for (const file of sitemapPages) {
  if (!fs.existsSync(filePath(file))) {
    errors.push(`${file}: missing file`);
    continue;
  }

  const html = read(file);
  const expected = renderBlock(file, html);
  const current = html.slice(html.indexOf(start), html.indexOf(end) + end.length);

  if (!writeMode) {
    if (!html.includes(start) || !html.includes(end)) {
      errors.push(`${file}: missing breadcrumb schema block`);
    } else if (current !== expected) {
      errors.push(`${file}: breadcrumb schema is out of sync`);
    }
    continue;
  }

  const result = replaceBlock(html, expected);
  if (result.error) {
    errors.push(`${file}: ${result.error}`);
    continue;
  }
  if (result.html !== html) {
    fs.writeFileSync(filePath(file), result.html);
    changed += 1;
  }
}

console.log(writeMode ? "Breadcrumb schema sync" : "Breadcrumb schema sync check");
console.log(`Checked ${sitemapPages.length} sitemap pages.`);
if (writeMode) console.log(`Updated ${changed} file(s).`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  console.error("\nRun:");
  console.error("- node scripts/sync-breadcrumb-schema.cjs --write");
  process.exit(1);
}

console.log("\nOK: breadcrumb schema is in sync.");
