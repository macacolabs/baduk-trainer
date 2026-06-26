const https = require("https");
const { articleFiles, feedItemLimit } = require("./site-content.cjs");

const baseUrl = "https://macacolabs.github.io/baduk-trainer/";
const adsenseApproved = process.env.ADSENSE_STATUS === "approved";
const fastMode = process.argv.includes("--fast");
const maxAttempts = fastMode ? 2 : 6;
const retryDelayMs = fastMode ? 2000 : 10000;
const requestTimeoutMs = fastMode ? 7000 : 15000;

const checks = [
  { path: "", expect: "큰돌" },
  { path: "about.html", expect: "콘텐츠 검수 기준" },
  { path: "learn.html", expect: "바둑과 오목" },
  { path: "baduk-learn.html", expect: "바둑은 활로" },
  { path: "omok-learn.html", expect: "오목은 5목" },
  { path: "faq.html", expect: "자주 묻는 질문" },
  { path: "omok-ai-difficulty.html", expect: "오목 AI 난이도" },
  { path: "adsense-checklist.html", expect: "AdSense" },
  { path: "search-console.html", expect: "check-search-console-meta.cjs" },
  { path: "privacy.html", expect: "개인정보" },
  { path: "terms.html", expect: "이용약관" },
  { path: "sitemap.xml", expect: "<urlset" },
  { path: "feed.xml", expect: "<rss" },
  { path: "robots.txt", expect: "Sitemap:" },
  { path: "manifest.webmanifest", expect: "\"short_name\": \"큰돌\"" },
  { path: "icon.svg", expect: "<svg" },
  { path: "social-card.svg", expect: "<svg" },
  { path: "offline.html", expect: "오프라인" },
  { path: "sw.js", expect: "CACHE_NAME" },
];

const privatePathChecks = [
  "scripts/preflight.cjs",
  "scripts/weekly-summary.cjs",
  "scripts/build-pages-artifact.cjs",
  ".github/workflows/pages.yml",
  "README.md",
  "SERVICE_ROADMAP.md",
  "OPERATION_CHECKLIST.md",
  "EXTERNAL_ACCOUNT_CHECKLIST.md",
  "SUBMISSION_PACKET.md",
  "CONTENT_PLAN.md",
  "OPERATIONS_REVIEW_TEMPLATE.md",
  "operations-reviews/",
  "local-katago-server.cjs",
  "KATAGO_LOCAL_SETUP.md",
];

if (adsenseApproved) {
  checks.push({ path: "ads.txt", expect: "google.com" });
} else {
  privatePathChecks.push("ads.txt");
}

function pathFromUrl(url) {
  if (!url.startsWith(baseUrl)) return null;
  return url.slice(baseUrl.length);
}

function extractSitemapPaths(xml) {
  const paths = [];
  const locPattern = /<loc>\s*([^<]+)\s*<\/loc>/g;
  let match = locPattern.exec(xml);

  while (match) {
    const nextPath = pathFromUrl(match[1].trim());
    if (nextPath !== null) paths.push(nextPath);
    match = locPattern.exec(xml);
  }

  return paths;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "baduk-trainer-live-check/1.0",
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

async function main() {
  const errors = [];
  console.log("Live site check");
  console.log(`AdSense mode: ${adsenseApproved ? "approved" : "pre-approval"}`);

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    let lastError = "";
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const result = await fetchText(url);
        console.log(`- ${url}: ${result.statusCode}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
        if (result.statusCode === 200 && result.body.includes(check.expect)) {
          lastError = "";
          break;
        }
        lastError = result.statusCode !== 200
          ? `expected 200, got ${result.statusCode}`
          : `missing expected text "${check.expect}"`;
      } catch (error) {
        lastError = error.message;
        console.log(`- ${url}: ${lastError}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
      }
      if (attempt < maxAttempts) {
        await wait(retryDelayMs);
      }
    }
    if (lastError) {
      errors.push(`${url}: ${lastError}`);
    }
  }

  let sitemapPaths = [];
  try {
    const sitemap = await fetchText(`${baseUrl}sitemap.xml`);
    if (sitemap.statusCode !== 200) {
      errors.push(`${baseUrl}sitemap.xml: expected 200 before sitemap scan, got ${sitemap.statusCode}`);
    } else {
      sitemapPaths = extractSitemapPaths(sitemap.body);
    }
  } catch (error) {
    errors.push(`${baseUrl}sitemap.xml: ${error.message}`);
  }

  try {
    const feed = await fetchText(`${baseUrl}feed.xml`);
    if (feed.statusCode !== 200) {
      errors.push(`${baseUrl}feed.xml: expected 200 before feed scan, got ${feed.statusCode}`);
    } else {
      const feedItems = feed.body.match(/<item>/g) || [];
      const expectedFeedItems = Math.min(feedItemLimit, articleFiles.length);
      console.log(`\nLive feed item check: ${feedItems.length}/${expectedFeedItems}`);
      if (feedItems.length !== expectedFeedItems) {
        errors.push(`${baseUrl}feed.xml: expected ${expectedFeedItems} items, found ${feedItems.length}`);
      }
    }
  } catch (error) {
    errors.push(`${baseUrl}feed.xml: ${error.message}`);
  }

  const explicitlyChecked = new Set(checks.map((check) => check.path));
  const sitemapOnlyPaths = sitemapPaths.filter((path) => !explicitlyChecked.has(path));
  console.log(`\nSitemap URL check: ${sitemapOnlyPaths.length} additional paths`);

  for (const checkPath of sitemapOnlyPaths) {
    const url = `${baseUrl}${checkPath}`;
    let lastError = "";
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const result = await fetchText(url);
        console.log(`- ${url}: ${result.statusCode}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
        if (result.statusCode === 200) {
          lastError = "";
          break;
        }
        lastError = `expected 200, got ${result.statusCode}`;
      } catch (error) {
        lastError = error.message;
        console.log(`- ${url}: ${lastError}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
      }
      if (attempt < maxAttempts) {
        await wait(retryDelayMs);
      }
    }
    if (lastError) {
      errors.push(`${url}: ${lastError}`);
    }
  }

  console.log(`\nPrivate path check: ${privatePathChecks.length} paths`);
  for (const checkPath of privatePathChecks) {
    const url = `${baseUrl}${checkPath}`;
    let lastError = "";
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const result = await fetchText(url);
        console.log(`- ${url}: ${result.statusCode}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
        if (result.statusCode === 404) {
          lastError = "";
          break;
        }
        lastError = `expected 404, got ${result.statusCode}`;
      } catch (error) {
        lastError = error.message;
        console.log(`- ${url}: ${lastError}${attempt > 1 ? ` (attempt ${attempt})` : ""}`);
      }
      if (attempt < maxAttempts) {
        await wait(retryDelayMs);
      }
    }
    if (lastError) {
      errors.push(`${url}: ${lastError}`);
    }
  }

  if (errors.length) {
    console.error("\nErrors:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("\nOK: live site pages are reachable.");
}

main();
