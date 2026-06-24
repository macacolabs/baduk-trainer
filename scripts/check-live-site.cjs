const https = require("https");

const baseUrl = "https://macacolabs.github.io/baduk-trainer/";

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

async function main() {
  const errors = [];
  console.log("Live site check");

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    try {
      const result = await fetchText(url);
      console.log(`- ${url}: ${result.statusCode}`);
      if (result.statusCode !== 200) {
        errors.push(`${url}: expected 200, got ${result.statusCode}`);
        continue;
      }
      if (!result.body.includes(check.expect)) {
        errors.push(`${url}: missing expected text "${check.expect}"`);
      }
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
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
