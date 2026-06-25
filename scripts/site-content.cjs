const siteBase = "https://macacolabs.github.io/baduk-trainer/";

const publicPages = [
  "index.html",
  "about.html",
  "learn.html",
  "faq.html",
  "privacy.html",
  "terms.html",
  "adsense-checklist.html",
  "search-console.html",
];

const articleFiles = [
  "baduk-beginner.html",
  "baduk-9x9-beginner.html",
  "baduk-atari.html",
  "baduk-atari-practice.html",
  "baduk-profitable-capture.html",
  "baduk-liberties.html",
  "baduk-glossary.html",
  "baduk-ko-rule.html",
  "baduk-opening.html",
  "baduk-opening-corner.html",
  "baduk-ai-review.html",
  "baduk-review-note.html",
  "baduk-life-and-death.html",
  "baduk-life-and-death-practice.html",
  "baduk-10k-to-5k.html",
  "baduk-5k-to-1k.html",
  "baduk-territory-scoring.html",
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-forbidden-moves.html",
  "omok-threats.html",
  "omok-attack-defense-priority.html",
  "omok-open-three.html",
  "omok-ai-difficulty.html",
  "omok-practice-routine.html",
];

const requiredPublicPages = publicPages;

const sitemapPages = [
  "privacy.html",
  "terms.html",
  "learn.html",
  "faq.html",
  "about.html",
  "adsense-checklist.html",
  "search-console.html",
  ...articleFiles,
];

module.exports = {
  articleFiles,
  publicPages,
  requiredPublicPages,
  siteBase,
  sitemapPages,
};
