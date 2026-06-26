const fs = require("fs");
const path = require("path");
const { siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const socialImage = `${siteBase}social-card.svg`;
const pages = [
  "index.html",
  "learn.html",
  "baduk-learn.html",
  "omok-learn.html",
  "faq.html",
  "about.html",
];
const errors = [];

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  return fs.readFileSync(filePath(file), "utf8");
}

function extract(html, regex) {
  return html.match(regex)?.[1]?.trim() || "";
}

function expectedCanonical(file) {
  return file === "index.html" ? siteBase : `${siteBase}${file}`;
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(fs.existsSync(filePath("social-card.svg")), "social-card.svg: missing social preview image");

for (const file of pages) {
  check(fs.existsSync(filePath(file)), `${file}: missing social page`);
  if (!fs.existsSync(filePath(file))) continue;

  const html = read(file);
  const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  const expectedUrl = expectedCanonical(file);
  const ogUrl = extract(html, /<meta\s+property="og:url"\s+content="([^"]+)"/);
  const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]+)"/);
  const ogDescription = extract(html, /<meta\s+property="og:description"\s+content="([^"]+)"/);
  const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]+)"/);
  const twitterCard = extract(html, /<meta\s+name="twitter:card"\s+content="([^"]+)"/);
  const twitterTitle = extract(html, /<meta\s+name="twitter:title"\s+content="([^"]+)"/);
  const twitterDescription = extract(html, /<meta\s+name="twitter:description"\s+content="([^"]+)"/);
  const twitterImage = extract(html, /<meta\s+name="twitter:image"\s+content="([^"]+)"/);

  check(canonical === expectedUrl, `${file}: canonical mismatch for social page`);
  check(html.includes('property="og:type"'), `${file}: missing og:type`);
  check(html.includes('property="og:site_name" content="큰돌"'), `${file}: missing og:site_name`);
  check(ogUrl === expectedUrl, `${file}: og:url mismatch`);
  check(ogTitle.length >= 2, `${file}: missing og:title`);
  check(ogDescription.length >= 35, `${file}: missing or short og:description`);
  check(ogImage === socialImage, `${file}: og:image mismatch`);
  check(twitterCard === "summary_large_image", `${file}: twitter:card must be summary_large_image`);
  check(twitterTitle.length >= 2, `${file}: missing twitter:title`);
  check(twitterDescription.length >= 35, `${file}: missing or short twitter:description`);
  check(twitterImage === socialImage, `${file}: twitter:image mismatch`);
}

console.log("Social metadata check");
console.log(`Checked ${pages.length} core sharing pages.`);

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: social metadata checks passed.");
