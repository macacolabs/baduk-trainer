const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const includeLive = process.argv.includes("--live");
const siteUrl = "https://macacolabs.github.io/baduk-trainer/";
const start = "<!-- SEARCH_CONSOLE_VERIFICATION_START -->";
const end = "<!-- SEARCH_CONSOLE_VERIFICATION_END -->";
const metaPattern = /<meta\s+name="google-site-verification"\s+content="([^"]+)"\s*\/?>/g;

function fail(message) {
  console.error(`Search Console meta check failed: ${message}`);
  process.exit(1);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "baduk-trainer-search-console-meta-check/1.0",
        },
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({ statusCode: response.statusCode || 0, body });
        });
      },
    );
    request.setTimeout(10000, () => request.destroy(new Error(`Timeout fetching ${url}`)));
    request.on("error", reject);
  });
}

function markerBlock(html) {
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    fail("verification markers are missing or out of order in index.html.");
  }
  return html.slice(startIndex + start.length, endIndex);
}

function metaTags(html) {
  return [...html.matchAll(metaPattern)].map((match) => ({
    tag: match[0],
    content: match[1],
  }));
}

async function main() {
  if (!fs.existsSync(indexPath)) fail("index.html is missing.");

  const localHtml = fs.readFileSync(indexPath, "utf8");
  const block = markerBlock(localHtml);
  const localTags = metaTags(block);
  const allLocalTags = metaTags(localHtml);

  console.log("Search Console meta check");
  console.log(`Local meta tags in marker: ${localTags.length}`);

  if (!localTags.length) {
    console.log("Status: not configured yet.");
    console.log("OK: pre-registration state is valid.");
    return;
  }

  if (localTags.length > 1) fail("more than one verification meta tag inside marker block.");
  if (allLocalTags.length > 1) fail("more than one google-site-verification meta tag in index.html.");
  if (localTags[0].content.length < 8) fail("verification content looks too short.");

  console.log("Status: local verification meta configured.");

  if (!includeLive) {
    console.log("OK: local Search Console meta is valid.");
    return;
  }

  const live = await fetchText(siteUrl);
  console.log(`Live URL: ${siteUrl} ${live.statusCode}`);
  if (live.statusCode !== 200) fail(`live index returned ${live.statusCode}.`);

  const liveTags = metaTags(live.body);
  if (liveTags.length !== 1) fail(`expected one live verification meta tag, found ${liveTags.length}.`);
  if (liveTags[0].content !== localTags[0].content) {
    fail("live verification content does not match local index.html.");
  }

  console.log("OK: live Search Console meta matches local index.html.");
}

main().catch((error) => fail(error.message));
