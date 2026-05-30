import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const outDir = path.join(root, "media", "blackjack-corgi-deck", "cards");
fs.mkdirSync(outDir, { recursive: true });

const suits = [
  { key: "S", name: "spades", symbol: "♠", color: "#17211f", accent: "#dbe4de" },
  { key: "H", name: "hearts", symbol: "♥", color: "#b42335", accent: "#fde8ec" },
  { key: "D", name: "diamonds", symbol: "♦", color: "#b42335", accent: "#fde8ec" },
  { key: "C", name: "clubs", symbol: "♣", color: "#17211f", accent: "#dbe4de" }
];

const ranks = [
  { key: "A", label: "A", value: 1 },
  { key: "2", label: "2", value: 2 },
  { key: "3", label: "3", value: 3 },
  { key: "4", label: "4", value: 4 },
  { key: "5", label: "5", value: 5 },
  { key: "6", label: "6", value: 6 },
  { key: "7", label: "7", value: 7 },
  { key: "8", label: "8", value: 8 },
  { key: "9", label: "9", value: 9 },
  { key: "10", label: "10", value: 10 },
  { key: "J", label: "J", value: 11, face: "Scout" },
  { key: "Q", label: "Q", value: 12, face: "Duchess" },
  { key: "K", label: "K", value: 13, face: "Captain" }
];

const pipLayouts = {
  2: [[125, 92], [125, 258]],
  3: [[125, 86], [125, 175], [125, 264]],
  4: [[78, 92], [172, 92], [78, 258], [172, 258]],
  5: [[78, 88], [172, 88], [125, 175], [78, 262], [172, 262]],
  6: [[78, 82], [172, 82], [78, 175], [172, 175], [78, 268], [172, 268]],
  7: [[78, 76], [172, 76], [125, 125], [78, 175], [172, 175], [78, 274], [172, 274]],
  8: [[78, 72], [172, 72], [125, 118], [78, 160], [172, 160], [125, 232], [78, 278], [172, 278]],
  9: [[78, 68], [172, 68], [78, 122], [172, 122], [125, 175], [78, 228], [172, 228], [78, 282], [172, 282]],
  10: [[78, 64], [172, 64], [125, 108], [78, 145], [172, 145], [78, 205], [172, 205], [125, 242], [78, 286], [172, 286]]
};

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  }[char]));
}

function suitPip(suit, x, y, size = 34, opacity = 1) {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="${size}" font-weight="900" fill="${suit.color}" opacity="${opacity}">${suit.symbol}</text>`;
}

function corner(rank, suit, rotate = false) {
  const transform = rotate ? `transform="rotate(180 125 175)"` : "";
  return `
    <g ${transform}>
      <text x="28" y="38" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${rank.key === "10" ? 27 : 30}" font-weight="900" fill="${suit.color}">${rank.label}</text>
      ${suitPip(suit, 28, 66, 27)}
    </g>`;
}

function corgiHead(x, y, scale = 1, mood = "happy") {
  const tongue = mood === "happy" ? `<path d="M ${x - 8 * scale} ${y + 31 * scale} q ${8 * scale} ${14 * scale} ${16 * scale} 0" fill="#e86f7a" stroke="#17211f" stroke-width="${2 * scale}" stroke-linecap="round"/>` : "";
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <path d="M -46 -22 L -26 -64 L -10 -30 Z" fill="#d89038" stroke="#17211f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 46 -22 L 26 -64 L 10 -30 Z" fill="#d89038" stroke="#17211f" stroke-width="3" stroke-linejoin="round"/>
      <path d="M -36 -22 q 0 -42 36 -42 t 36 42 q 8 14 2 36 q -7 33 -38 36 q -31 -3 -38 -36 q -6 -22 2 -36z" fill="#e3a146" stroke="#17211f" stroke-width="3"/>
      <path d="M -22 -19 q 22 10 44 0 q -2 43 -22 52 q -20 -9 -22 -52z" fill="#fff6e8"/>
      <ellipse cx="-17" cy="-17" rx="5" ry="7" fill="#17211f"/>
      <ellipse cx="17" cy="-17" rx="5" ry="7" fill="#17211f"/>
      <path d="M -7 4 q 7 -7 14 0 q -4 8 -14 0z" fill="#17211f"/>
      <path d="M 0 12 q -10 13 -22 5" fill="none" stroke="#17211f" stroke-width="3" stroke-linecap="round"/>
      <path d="M 0 12 q 10 13 22 5" fill="none" stroke="#17211f" stroke-width="3" stroke-linecap="round"/>
      ${tongue}
      <circle cx="-29" cy="2" r="6" fill="#f3b283" opacity=".72"/>
      <circle cx="29" cy="2" r="6" fill="#f3b283" opacity=".72"/>
    </g>`;
}

function corgiBody(rank, suit) {
  const faceLabel = rank.face || "Ace";
  const accessory = {
    J: `<path d="M 82 116 q 43 -22 86 0" fill="none" stroke="${suit.color}" stroke-width="8" stroke-linecap="round"/><circle cx="84" cy="116" r="8" fill="${suit.color}"/><circle cx="166" cy="116" r="8" fill="${suit.color}"/>`,
    Q: `<path d="M 92 107 L 109 81 L 125 106 L 141 81 L 158 107 Z" fill="#f4c95d" stroke="#17211f" stroke-width="3"/><circle cx="109" cy="81" r="4" fill="${suit.color}"/><circle cx="141" cy="81" r="4" fill="${suit.color}"/>`,
    K: `<path d="M 86 108 L 98 80 L 113 104 L 125 76 L 137 104 L 152 80 L 164 108 Z" fill="#f4c95d" stroke="#17211f" stroke-width="3"/><path d="M 88 224 h74" stroke="${suit.color}" stroke-width="8" stroke-linecap="round"/>`,
    A: `<circle cx="125" cy="175" r="76" fill="${suit.accent}" stroke="${suit.color}" stroke-width="5"/>`
  }[rank.key] || "";

  return `
    <g>
      ${rank.key === "A" ? "" : `<rect x="61" y="78" width="128" height="194" rx="18" fill="${suit.accent}" stroke="${suit.color}" stroke-width="4"/>`}
      ${accessory}
      ${corgiHead(125, rank.key === "A" ? 164 : 163, rank.key === "A" ? 1.12 : 1)}
      <text x="125" y="${rank.key === "A" ? 267 : 304}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="900" fill="${suit.color}">${esc(faceLabel)} ${suit.symbol}</text>
    </g>`;
}

function cardSvg(rank, suit) {
  const pips = rank.value > 1 && rank.value <= 10
    ? pipLayouts[rank.value].map(([x, y], index) => suitPip(suit, x, y, 34, index % 2 && rank.value > 6 ? 0.88 : 1)).join("\n")
    : corgiBody(rank, suit);

  const watermark = rank.value > 1 && rank.value <= 10
    ? `<g opacity=".12">${corgiHead(125, 175, 0.92)}</g>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="250" height="350" viewBox="0 0 250 350" role="img" aria-labelledby="title desc">
  <title id="title">${esc(rank.label)} of ${esc(suit.name)}</title>
  <desc id="desc">A matched cartoon corgi playing card with standard ${esc(suit.name)} suit styling.</desc>
  <rect x="7" y="7" width="236" height="336" rx="18" fill="#ffffff" stroke="#17211f" stroke-width="4"/>
  <rect x="15" y="15" width="220" height="320" rx="13" fill="none" stroke="${suit.color}" stroke-width="1.5" opacity=".22"/>
  ${corner(rank, suit)}
  ${corner(rank, suit, true)}
  ${watermark}
  ${pips}
</svg>
`;
}

function cardBackSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="250" height="350" viewBox="0 0 250 350" role="img" aria-labelledby="title desc">
  <title id="title">Corgi card back</title>
  <desc id="desc">A matched card back for the cartoon corgi blackjack deck.</desc>
  <rect x="7" y="7" width="236" height="336" rx="18" fill="#0f766e" stroke="#17211f" stroke-width="4"/>
  <rect x="22" y="22" width="206" height="306" rx="12" fill="none" stroke="#fff6e8" stroke-width="5"/>
  <pattern id="paws" width="42" height="42" patternUnits="userSpaceOnUse">
    <circle cx="21" cy="17" r="5" fill="#fff6e8" opacity=".26"/>
    <circle cx="12" cy="25" r="4" fill="#fff6e8" opacity=".26"/>
    <circle cx="30" cy="25" r="4" fill="#fff6e8" opacity=".26"/>
    <ellipse cx="21" cy="30" rx="8" ry="6" fill="#fff6e8" opacity=".26"/>
  </pattern>
  <rect x="29" y="29" width="192" height="292" rx="9" fill="url(#paws)"/>
  <circle cx="125" cy="175" r="77" fill="#fff6e8" stroke="#17211f" stroke-width="5"/>
  ${corgiHead(125, 165, 1.1)}
  <text x="125" y="275" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900" fill="#17211f">CORGI BLACKJACK</text>
</svg>
`;
}

for (const suit of suits) {
  for (const rank of ranks) {
    fs.writeFileSync(path.join(outDir, `${rank.key}${suit.key}.svg`), cardSvg(rank, suit));
  }
}

fs.writeFileSync(path.join(outDir, "BACK.svg"), cardBackSvg());

const manifest = {
  name: "Corgi Blackjack Deck",
  date: "2026-05-30",
  format: "SVG",
  cards: suits.flatMap(suit => ranks.map(rank => ({
    id: `${rank.key}${suit.key}`,
    rank: rank.key,
    suit: suit.name,
    file: `cards/${rank.key}${suit.key}.svg`
  }))),
  back: "cards/BACK.svg"
};

fs.writeFileSync(path.join(root, "media", "blackjack-corgi-deck", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Generated ${manifest.cards.length} cards plus card back in ${outDir}`);
