const fs = require("fs");
const https = require("https");
const path = require("path");
const { spawnSync } = require("child_process");
const { siteBase } = require("./site-content.cjs");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const fastMode = args.includes("--fast");

function numberArg(name, fallback) {
  const inline = args.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) return Number.parseInt(inline.slice(name.length + 3), 10) || fallback;
  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1]) return Number.parseInt(args[index + 1], 10) || fallback;
  return fallback;
}

const maxAttempts = numberArg("attempts", fastMode ? 3 : 12);
const delayMs = numberArg("delay-ms", fastMode ? 2000 : 10000);
const requestTimeoutMs = numberArg("timeout-ms", fastMode ? 7000 : 15000);

function fail(message) {
  console.error(`Live deploy wait failed: ${message}`);
  process.exit(1);
}

function parseUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => match[1].trim());
}

function readLocalSitemapUrls() {
  const sitemapPath = path.join(root, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) fail("local sitemap.xml is missing.");
  const urls = parseUrls(fs.readFileSync(sitemapPath, "utf8"));
  if (!urls.length) fail("local sitemap.xml has no URLs.");
  return urls;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "baduk-trainer-live-deploy-wait/1.0",
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
    request.setTimeout(requestTimeoutMs, () => {
      request.destroy(new Error(`Timeout fetching ${url}`));
    });
    request.on("error", reject);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeError(error) {
  return error.message || error.code || String(error);
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
}

async function waitForSitemapMatch(expectedUrls) {
  const sitemapUrl = `${siteBase}sitemap.xml`;
  let lastMissing = expectedUrls;
  let lastExtra = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await fetchText(sitemapUrl);
      if (result.statusCode !== 200) {
        console.log(`- attempt ${attempt}/${maxAttempts}: live sitemap status ${result.statusCode}`);
      } else {
        const liveUrls = parseUrls(result.body);
        lastMissing = difference(expectedUrls, liveUrls);
        lastExtra = difference(liveUrls, expectedUrls);
        console.log(`- attempt ${attempt}/${maxAttempts}: live ${liveUrls.length}, local ${expectedUrls.length}, missing ${lastMissing.length}, extra ${lastExtra.length}`);
        if (!lastMissing.length && !lastExtra.length) return;
      }
    } catch (error) {
      console.log(`- attempt ${attempt}/${maxAttempts}: ${describeError(error)}`);
    }

    if (attempt < maxAttempts) await wait(delayMs);
  }

  console.error("\nLive sitemap did not match local sitemap.");
  if (lastMissing.length) {
    console.error("Missing on live:");
    for (const url of lastMissing.slice(0, 10)) console.error(`- ${url}`);
  }
  if (lastExtra.length) {
    console.error("Extra on live:");
    for (const url of lastExtra.slice(0, 10)) console.error(`- ${url}`);
  }
  process.exit(1);
}

function runFinalLiveCheck() {
  const finalArgs = ["scripts/check-live-site.cjs"];
  if (fastMode) finalArgs.push("--fast");
  console.log(`\n> node ${finalArgs.join(" ")}`);
  const result = spawnSync(process.execPath, finalArgs, {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

async function main() {
  const expectedUrls = readLocalSitemapUrls();
  console.log("Live deploy wait");
  console.log(`Expected sitemap URLs: ${expectedUrls.length}`);
  console.log(`Attempts: ${maxAttempts}, delay: ${delayMs}ms`);
  await waitForSitemapMatch(expectedUrls);
  console.log("\nOK: live sitemap matches local sitemap.");
  runFinalLiveCheck();
}

main().catch((error) => {
  fail(error.message);
});
