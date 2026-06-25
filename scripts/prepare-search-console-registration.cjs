const { spawnSync } = require("child_process");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const includeLive = process.argv.includes("--live");
const siteUrl = "https://macacolabs.github.io/baduk-trainer/";
const sitemapUrl = `${siteUrl}sitemap.xml`;
const liveChecks = [
  [siteUrl, "큰돌"],
  [`${siteUrl}learn.html`, "바둑과 오목"],
  [`${siteUrl}privacy.html`, "개인정보"],
  [`${siteUrl}terms.html`, "이용약관"],
  [`${siteUrl}search-console.html`, "Search Console"],
  [sitemapUrl, "<urlset"],
];

function run(label, args) {
  console.log(`\n> node ${args.join(" ")}`);
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\nFailed: ${label}`);
    process.exit(result.status || 1);
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "baduk-trainer-search-console-registration/1.0",
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
    request.setTimeout(10000, () => {
      request.destroy(new Error(`Timeout fetching ${url}`));
    });
    request.on("error", reject);
  });
}

async function checkLiveUrls() {
  console.log("\nLive URL check");
  for (const [url, expected] of liveChecks) {
    const result = await fetchText(url);
    console.log(`- ${url}: ${result.statusCode}`);
    if (result.statusCode !== 200) {
      console.error(`Expected 200 for ${url}, got ${result.statusCode}`);
      process.exit(1);
    }
    if (!result.body.includes(expected)) {
      console.error(`Expected "${expected}" in ${url}`);
      process.exit(1);
    }
  }
  console.log("OK: Search Console registration URLs are reachable.");
}

console.log("Search Console registration packet");
console.log("");
console.log("Copy values:");
console.log(`- Property type: URL prefix`);
console.log(`- Site URL: ${siteUrl}`);
console.log(`- Sitemap URL: ${sitemapUrl}`);
console.log("");
console.log("Open:");
console.log("- https://search.google.com/search-console");
console.log(`- ${siteUrl}search-console.html`);

async function main() {
  if (includeLive) {
    await checkLiveUrls();
  }

  run("submission packet", ["scripts/check-submission-packet.cjs"]);
  run("indexing priority", ["scripts/indexing-priority.cjs"]);
  run("external account status", ["scripts/external-account-status.cjs"]);

  console.log("\nAfter adding the URL prefix property:");
  console.log('- node scripts/mark-external-task.cjs "Search Console" "URL 접두어 속성으로 사이트 등록" --note "Search Console URL 접두어 속성에 사이트 URL 등록"');
  console.log("- node scripts/external-next-action.cjs");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
