const https = require("https");

const baseUrl = "https://macacolabs.github.io/baduk-trainer/";
const maxAttempts = 6;
const retryDelayMs = 10000;

const checks = [
  { path: "", expect: "큰돌" },
  { path: "about.html", expect: "서비스 소개" },
  { path: "learn.html", expect: "바둑과 오목" },
  { path: "faq.html", expect: "자주 묻는 질문" },
  { path: "omok-ai-difficulty.html", expect: "오목 AI 난이도" },
  { path: "adsense-checklist.html", expect: "AdSense" },
  { path: "search-console.html", expect: "Search Console" },
  { path: "privacy.html", expect: "개인정보" },
  { path: "terms.html", expect: "이용약관" },
  { path: "sitemap.xml", expect: "<urlset" },
  { path: "robots.txt", expect: "Sitemap:" },
];

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
    request.setTimeout(15000, () => {
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

  if (errors.length) {
    console.error("\nErrors:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("\nOK: live site pages are reachable.");
}

main();
