const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const faqPath = path.join(root, "faq.html");
const errors = [];

function fail(message) {
  errors.push(message);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

if (!fs.existsSync(faqPath)) {
  fail("faq.html is missing.");
} else {
  const html = fs.readFileSync(faqPath, "utf8");
  const scripts = [...html.matchAll(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)]
    .map((match) => match[1].trim());
  const faqScripts = scripts.filter((script) => script.includes('"@type": "FAQPage"'));
  if (faqScripts.length !== 1) fail(`expected one FAQPage JSON-LD script, found ${faqScripts.length}.`);

  const visiblePairs = [...html.matchAll(/<section>\s*<h2>([^<]+)<\/h2>\s*<p>([\s\S]*?)<\/p>/g)]
    .map(([, question, answer]) => ({
      question: normalize(question),
      answer: stripTags(answer),
    }));

  if (!visiblePairs.length) fail("faq.html has no visible FAQ sections.");

  if (faqScripts.length === 1) {
    let schema = null;
    try {
      schema = JSON.parse(faqScripts[0]);
    } catch (error) {
      fail(`FAQPage JSON-LD is not valid JSON: ${error.message}`);
    }

    const items = schema?.mainEntity || [];
    if (!Array.isArray(items)) fail("FAQPage mainEntity must be an array.");
    else {
      if (items.length !== visiblePairs.length) {
        fail(`FAQPage question count ${items.length} does not match visible FAQ count ${visiblePairs.length}.`);
      }

      visiblePairs.forEach((visible, index) => {
        const item = items[index];
        if (!item) return;
        const schemaQuestion = normalize(item.name);
        const schemaAnswer = normalize(item.acceptedAnswer?.text);
        if (schemaQuestion !== visible.question) {
          fail(`FAQ question ${index + 1} mismatch: expected "${visible.question}", got "${schemaQuestion}".`);
        }
        if (schemaAnswer !== visible.answer) {
          fail(`FAQ answer ${index + 1} mismatch for "${visible.question}".`);
        }
      });
    }
  }
}

console.log("FAQ schema check");

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nOK: FAQ schema matches visible questions.");
