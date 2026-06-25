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
  "baduk-19x19-start.html",
  "baduk-rank-roadmap.html",
  "baduk-beginner-mistakes.html",
  "baduk-atari.html",
  "baduk-atari-practice.html",
  "baduk-ladder.html",
  "baduk-net.html",
  "baduk-cut-connect.html",
  "baduk-attack-weak-stones.html",
  "baduk-profitable-capture.html",
  "baduk-liberties.html",
  "baduk-shape-empty-triangle.html",
  "baduk-glossary.html",
  "baduk-ko-rule.html",
  "baduk-opening.html",
  "baduk-opening-corner.html",
  "baduk-ai-review.html",
  "baduk-review-note.html",
  "baduk-review-10-minute.html",
  "baduk-life-and-death.html",
  "baduk-life-and-death-practice.html",
  "baduk-false-eye.html",
  "baduk-10k-to-5k.html",
  "baduk-5k-to-1k.html",
  "baduk-territory-scoring.html",
  "baduk-endgame.html",
  "baduk-endgame-big-move.html",
  "baduk-sente-gote.html",
  "omok-strategy.html",
  "omok-forbidden-moves.html",
  "omok-threats.html",
  "omok-double-threat.html",
  "omok-attack-defense-priority.html",
  "omok-defense-to-attack.html",
  "omok-block-four.html",
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
