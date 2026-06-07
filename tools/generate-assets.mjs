import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";

const outDir = "assets";
mkdirSync(outDir, { recursive: true });
const require = createRequire(import.meta.url);

function svg(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${body}</svg>`;
}

function write(name, width, height, body) {
  const path = join(outDir, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg(width, height, body), "utf8");
  return path.replaceAll("\\", "/");
}

function loadSharp() {
  const candidates = ["sharp"];
  const home = process.env.USERPROFILE || process.env.HOME;
  if (home) {
    candidates.push(join(home, ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "sharp"));
  }
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      // Optional renderer: SVG source files remain valid if sharp is unavailable.
    }
  }
  return null;
}

const sharp = loadSharp();
const bundledPython = join(
  process.env.USERPROFILE || process.env.HOME || "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "python",
  "python.exe",
);

const files = [
  write(
    "capsule-main.svg",
    920,
    430,
    `
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#d8f0df"/>
        <stop offset="0.55" stop-color="#f6f0cf"/>
        <stop offset="1" stop-color="#9ab874"/>
      </linearGradient>
      <linearGradient id="ring" x1="0" x2="1">
        <stop offset="0" stop-color="#c88b37"/>
        <stop offset="1" stop-color="#e7c36f"/>
      </linearGradient>
    </defs>
    <rect width="920" height="430" fill="url(#sky)"/>
    <path d="M0 320 C160 260 230 360 370 300 C530 230 670 260 920 210 L920 430 L0 430Z" fill="#6f965b"/>
    <path d="M55 260 L210 210 L355 260 L355 390 L55 390Z" fill="#8b6a48"/>
    <path d="M80 274 L210 232 L332 274" fill="none" stroke="#583f30" stroke-width="18"/>
    <rect x="118" y="294" width="74" height="96" fill="#f6f0cf"/>
    <rect x="230" y="294" width="68" height="96" fill="#2b6f5b"/>
    <ellipse cx="612" cy="306" rx="108" ry="92" fill="#fff0c8" stroke="#7a583e" stroke-width="10"/>
    <path d="M564 232 C576 170 640 172 656 230" fill="none" stroke="#2f7d57" stroke-width="18" stroke-linecap="round"/>
    <circle cx="582" cy="294" r="11" fill="#18342d"/>
    <circle cx="642" cy="294" r="11" fill="#18342d"/>
    <path d="M590 334 Q612 352 638 334" fill="none" stroke="#8b4c37" stroke-width="9" stroke-linecap="round"/>
    <circle cx="760" cy="168" r="84" fill="none" stroke="url(#ring)" stroke-width="18"/>
    <circle cx="760" cy="168" r="46" fill="none" stroke="#286f58" stroke-width="8"/>
    <text x="52" y="92" font-size="54" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">仙农洞天</text>
    <text x="58" y="146" font-size="28" font-family="Microsoft YaHei, serif" fill="#286f58">精怪工坊</text>
    <text x="58" y="186" font-size="20" font-family="Microsoft YaHei, serif" fill="#5d6f65">种下灵植，唤醒精怪，经营你的修仙小镇</text>
    `,
  ),
  write(
    "spirit-luobo.svg",
    256,
    256,
    `
    <rect width="256" height="256" rx="36" fill="#eef6df"/>
    <ellipse cx="128" cy="144" rx="76" ry="82" fill="#fff2c9" stroke="#826246" stroke-width="8"/>
    <path d="M96 76 C100 35 141 32 148 76" fill="none" stroke="#286f58" stroke-width="18" stroke-linecap="round"/>
    <path d="M130 78 C160 42 196 58 178 94" fill="none" stroke="#48a868" stroke-width="15" stroke-linecap="round"/>
    <circle cx="104" cy="136" r="8" fill="#17231d"/>
    <circle cx="152" cy="136" r="8" fill="#17231d"/>
    <path d="M105 174 Q128 190 153 174" fill="none" stroke="#be4f37" stroke-width="7" stroke-linecap="round"/>
    <circle cx="72" cy="160" r="16" fill="#f3c28b" opacity="0.55"/>
    <circle cx="184" cy="160" r="16" fill="#f3c28b" opacity="0.55"/>
    `,
  ),
  write(
    "crop-bailuobo.svg",
    256,
    256,
    `
    <rect width="256" height="256" rx="36" fill="#f5f3e6"/>
    <path d="M116 66 C102 24 150 24 139 66" fill="#48a868"/>
    <path d="M138 72 C160 32 198 46 170 82" fill="#286f58"/>
    <path d="M120 70 C76 102 76 190 128 218 C180 190 180 102 136 70Z" fill="#fff0c8" stroke="#826246" stroke-width="8"/>
    <path d="M96 128 C116 120 140 120 160 128" fill="none" stroke="#d8c08f" stroke-width="6" stroke-linecap="round"/>
    <path d="M96 160 C118 152 140 152 162 160" fill="none" stroke="#d8c08f" stroke-width="6" stroke-linecap="round"/>
    `,
  ),
  write(
    "crop-baicai.svg",
    256,
    256,
    `
    <rect width="256" height="256" rx="36" fill="#eef6df"/>
    <path d="M128 206 C74 184 58 118 94 72 C112 50 144 50 162 72 C198 118 182 184 128 206Z" fill="#d9f0c4" stroke="#5d8c5a" stroke-width="8"/>
    <path d="M128 202 C106 168 104 116 128 72 C152 116 150 168 128 202Z" fill="#fff8d8" stroke="#8dbb72" stroke-width="6"/>
    <path d="M96 106 C118 118 138 118 160 106" fill="none" stroke="#6aa35f" stroke-width="6" stroke-linecap="round"/>
    <path d="M88 144 C112 158 144 158 168 144" fill="none" stroke="#6aa35f" stroke-width="6" stroke-linecap="round"/>
    <path d="M116 56 C104 34 126 26 134 50 C148 28 174 38 156 64" fill="#48a868"/>
    `,
  ),
  write(
    "shop-sign.svg",
    512,
    256,
    `
    <rect width="512" height="256" rx="24" fill="#f7f0d8"/>
    <path d="M56 66 H456 V196 H56Z" fill="#8b6a48" stroke="#583f30" stroke-width="12"/>
    <path d="M88 98 H424 V164 H88Z" fill="#fff8e8"/>
    <text x="142" y="144" font-size="44" font-family="Microsoft YaHei, serif" font-weight="800" fill="#286f58">洞天旧铺</text>
    <circle cx="92" cy="68" r="18" fill="#c88b37"/>
    <circle cx="420" cy="68" r="18" fill="#c88b37"/>
    `,
  ),
  write(
    "customer-villager.svg",
    256,
    256,
    `
    <rect width="256" height="256" rx="36" fill="#eef3df"/>
    <circle cx="128" cy="118" r="58" fill="#f1cda5" stroke="#826246" stroke-width="7"/>
    <path d="M74 118 C78 66 110 46 150 54 C182 62 196 86 190 124 C166 102 122 100 74 118Z" fill="#583f30"/>
    <circle cx="106" cy="122" r="7" fill="#17231d"/>
    <circle cx="150" cy="122" r="7" fill="#17231d"/>
    <path d="M106 154 Q128 168 152 154" fill="none" stroke="#8b4c37" stroke-width="7" stroke-linecap="round"/>
    <path d="M66 238 C78 190 104 176 128 176 C154 176 180 190 190 238Z" fill="#286f58"/>
    <path d="M92 198 H164" stroke="#e7c36f" stroke-width="8" stroke-linecap="round"/>
    `,
  ),
  write(
    "control-hints.svg",
    512,
    256,
    `
    <rect width="512" height="256" rx="28" fill="#f7f0d8"/>
    <rect x="54" y="64" width="160" height="94" rx="28" fill="#286f58"/>
    <circle cx="96" cy="112" r="18" fill="#edf3df"/>
    <circle cx="154" cy="112" r="18" fill="#edf3df"/>
    <path d="M86 184 H180" stroke="#826246" stroke-width="12" stroke-linecap="round"/>
    <rect x="278" y="64" width="58" height="58" rx="12" fill="#fff8e8" stroke="#826246" stroke-width="6"/>
    <rect x="348" y="64" width="58" height="58" rx="12" fill="#fff8e8" stroke="#826246" stroke-width="6"/>
    <rect x="314" y="132" width="58" height="58" rx="12" fill="#fff8e8" stroke="#826246" stroke-width="6"/>
    <text x="64" y="224" font-size="24" font-family="Microsoft YaHei, serif" fill="#17231d">手柄 / 键鼠基础提示</text>
    `,
  ),
  write(
    "screenshot-farm.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#d9efdf"/>
    <path d="M0 260 C120 210 210 300 340 245 C470 190 540 220 640 178 L640 360 L0 360Z" fill="#8da462"/>
    <g fill="#826246">${Array.from({ length: 18 }, (_, i) => `<rect x="${120 + (i % 6) * 58}" y="${118 + Math.floor(i / 6) * 58}" width="46" height="46"/>`).join("")}</g>
    <path d="M48 196 L118 156 L190 196 V278 H48Z" fill="#8b6a48"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">荒废洞天初始</text>
    `,
  ),
  write(
    "screenshot-spirit.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#d8f0df"/>
    <path d="M0 268 C130 210 220 292 360 232 C500 176 560 220 640 184 L640 360 L0 360Z" fill="#8da462"/>
    <g fill="#577f80">${Array.from({ length: 9 }, (_, i) => `<rect x="${228 + (i % 3) * 56}" y="${128 + Math.floor(i / 3) * 56}" width="46" height="46"/>`).join("")}</g>
    <ellipse cx="140" cy="210" rx="54" ry="62" fill="#fff0c8" stroke="#826246" stroke-width="7"/>
    <path d="M122 154 C126 118 164 120 170 154" fill="none" stroke="#286f58" stroke-width="14" stroke-linecap="round"/>
    <circle cx="126" cy="204" r="6" fill="#17231d"/><circle cx="154" cy="204" r="6" fill="#17231d"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">第一只精怪浇水</text>
    `,
  ),
  write(
    "screenshot-shop.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#f6f0cf"/>
    <rect x="70" y="92" width="500" height="210" fill="#8b6a48" stroke="#583f30" stroke-width="12"/>
    <rect x="105" y="130" width="170" height="126" fill="#fff8e8"/>
    <rect x="318" y="130" width="205" height="126" fill="#fff8e8"/>
    <circle cx="380" cy="214" r="34" fill="#fff0c8" stroke="#826246" stroke-width="5"/>
    <circle cx="462" cy="214" r="34" fill="#c88b37" stroke="#826246" stroke-width="5"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">旧铺开门经营</text>
    `,
  ),
  write(
    "screenshot-term.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#c9e7de"/>
    <path d="M0 250 C100 210 210 270 330 220 C470 160 560 202 640 170 L640 360 L0 360Z" fill="#7fab79"/>
    <g fill="#48a868">${Array.from({ length: 20 }, (_, i) => `<circle cx="${110 + (i % 5) * 70}" cy="${130 + Math.floor(i / 5) * 42}" r="${12 + (i % 3) * 3}"/>`).join("")}</g>
    <circle cx="510" cy="80" r="44" fill="#e7c36f" opacity="0.9"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">节气影响农田</text>
    <text x="36" y="316" font-size="20" font-family="Microsoft YaHei, serif" fill="#286f58">谷雨：木系作物与精怪工作效率上升</text>
    `,
  ),
  write(
    "screenshot-ecology.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#dfead3"/>
    <path d="M0 260 C90 212 190 278 310 224 C438 166 540 204 640 168 L640 360 L0 360Z" fill="#7fab79"/>
    <circle cx="118" cy="206" r="44" fill="#fff0c8" stroke="#826246" stroke-width="6"/>
    <path d="M96 164 C104 122 142 124 150 164" fill="none" stroke="#286f58" stroke-width="12" stroke-linecap="round"/>
    <circle cx="276" cy="194" r="38" fill="#d9f0c4" stroke="#5d8c5a" stroke-width="6"/>
    <path d="M246 158 C238 126 276 116 286 154" fill="none" stroke="#48a868" stroke-width="11" stroke-linecap="round"/>
    <circle cx="430" cy="210" r="46" fill="#c9e7de" stroke="#4d91a6" stroke-width="6"/>
    <path d="M398 172 C424 134 464 146 458 184" fill="none" stroke="#286f58" stroke-width="11" stroke-linecap="round"/>
    <rect x="70" y="266" width="500" height="32" rx="16" fill="#e7c36f" opacity="0.75"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">精怪生态庭院</text>
    <text x="36" y="318" font-size="20" font-family="Microsoft YaHei, serif" fill="#286f58">多精怪组合触发生态共鸣与长期养成</text>
    `,
  ),
  write(
    "screenshot-dungeon.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#26323a"/>
    <path d="M0 270 C120 226 260 282 384 230 C512 176 574 206 640 188 L640 360 L0 360Z" fill="#4d5b4f"/>
    <rect x="54" y="92" width="210" height="168" rx="24" fill="#6b6b5d" stroke="#c88b37" stroke-width="6"/>
    <circle cx="164" cy="172" r="54" fill="#8b6a48" stroke="#e7c36f" stroke-width="7"/>
    <path d="M128 144 L106 116 M200 144 L224 116" stroke="#e7c36f" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="430" cy="214" rx="52" ry="58" fill="#fff0c8" stroke="#826246" stroke-width="6"/>
    <path d="M410 166 C416 132 452 136 458 166" fill="none" stroke="#48a868" stroke-width="12" stroke-linecap="round"/>
    <path d="M300 230 C340 196 382 196 420 230" fill="none" stroke="#f0b35e" stroke-width="8" stroke-linecap="round"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#f7f0d8">青云矿洞战斗</text>
    <text x="36" y="318" font-size="20" font-family="Microsoft YaHei, serif" fill="#e7c36f">精怪随行挑战裂甲木卫，秘境掉落进入工坊循环</text>
    `,
  ),
  write(
    "screenshot-trade.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#c9e7de"/>
    <path d="M0 250 C110 204 206 268 340 210 C470 154 554 202 640 162 L640 360 L0 360Z" fill="#7fab79"/>
    <path d="M96 160 C196 82 326 86 470 154" fill="none" stroke="#f7f0d8" stroke-width="16" stroke-linecap="round" opacity="0.9"/>
    <path d="M204 166 L318 120 L442 166 L326 212Z" fill="#8b6a48" stroke="#583f30" stroke-width="7"/>
    <path d="M316 78 L350 150 L286 150Z" fill="#e7c36f" stroke="#826246" stroke-width="6"/>
    <circle cx="505" cy="118" r="54" fill="#fff8e8" opacity="0.85"/>
    <rect x="474" y="102" width="62" height="44" rx="8" fill="#286f58"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#17231d">跨界商路启航</text>
    <text x="36" y="318" font-size="20" font-family="Microsoft YaHei, serif" fill="#286f58">飞舟商队、补给风险与隐藏秘境轮换</text>
    `,
  ),
  write(
    "screenshot-final-support.svg",
    640,
    360,
    `
    <rect width="640" height="360" fill="#202b35"/>
    <circle cx="320" cy="176" r="112" fill="none" stroke="#e7c36f" stroke-width="10"/>
    <circle cx="320" cy="176" r="70" fill="none" stroke="#48a868" stroke-width="6"/>
    <g fill="#f7f0d8">${Array.from({ length: 24 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 24;
      const x = 320 + Math.cos(angle) * 112;
      const y = 176 + Math.sin(angle) * 112;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
    }).join("")}</g>
    <circle cx="182" cy="230" r="34" fill="#f1cda5" stroke="#826246" stroke-width="5"/>
    <circle cx="458" cy="230" r="34" fill="#f1cda5" stroke="#826246" stroke-width="5"/>
    <ellipse cx="320" cy="202" rx="42" ry="50" fill="#fff0c8" stroke="#826246" stroke-width="6"/>
    <path d="M300 160 C304 128 338 132 344 160" fill="none" stroke="#48a868" stroke-width="10" stroke-linecap="round"/>
    <path d="M218 218 C254 188 284 180 320 176 C356 180 386 188 422 218" fill="none" stroke="#e7c36f" stroke-width="7" stroke-linecap="round"/>
    <text x="34" y="54" font-size="28" font-family="Microsoft YaHei, serif" font-weight="800" fill="#f7f0d8">终章支援建阵</text>
    <text x="36" y="318" font-size="20" font-family="Microsoft YaHei, serif" fill="#e7c36f">NPC 支援、精怪共鸣与二十四节气大阵收束主线</text>
    `,
  ),
];

function writeSteamSvg(name, width, height, body) {
  const path = join(outDir, "steam-ready", "source-svg", name);
  mkdirSync(dirname(path), { recursive: true });
  const text = svg(width, height, body);
  writeFileSync(path, text, "utf8");
  return {
    path: path.replaceAll("\\", "/"),
    width,
    height,
    bytes: Buffer.byteLength(text),
  };
}

async function renderPng(source, targetName) {
  const path = join(outDir, "steam-ready", "png", targetName);
  mkdirSync(dirname(path), { recursive: true });
  if (!sharp) return null;
  await sharp(Buffer.from(source.text)).png().toFile(path);
  return path.replaceAll("\\", "/");
}

function renderSteamPngsWithPython(specs) {
  const python = bundledPython || "python";
  const payload = JSON.stringify(specs.map(({ id, name, width, height, type }) => ({ id, name, width, height, type })));
  try {
    const output = execFileSync(python, ["tools/render-steam-assets.py", payload], { encoding: "utf8" });
    return new Map(JSON.parse(output).map((entry) => [entry.id, entry.png]));
  } catch (error) {
    return new Map();
  }
}

function titleArt(width, height, { title = "仙农洞天", subtitle = "精怪工坊", label = "种下灵植 · 唤醒精怪 · 经营修仙小镇", mode = "store" } = {}) {
  const wide = width / height > 2;
  const vertical = height > width;
  const titleSize = vertical ? width * 0.11 : width * 0.078;
  const subtitleSize = vertical ? width * 0.055 : width * 0.036;
  const labelSize = vertical ? width * 0.035 : width * 0.023;
  const titleX = vertical ? width * 0.1 : width * 0.065;
  const titleY = vertical ? height * 0.17 : height * 0.24;
  const badgeX = vertical ? width * 0.68 : width * 0.78;
  const badgeY = vertical ? height * 0.19 : height * 0.27;
  const spiritX = vertical ? width * 0.5 : width * 0.69;
  const spiritY = vertical ? height * 0.62 : height * 0.66;
  const spiritRx = vertical ? width * 0.21 : width * 0.12;
  const spiritRy = vertical ? height * 0.13 : height * 0.18;
  const hillY = vertical ? height * 0.73 : height * 0.7;
  const shopX = vertical ? width * 0.1 : width * 0.09;
  const shopY = vertical ? height * 0.42 : height * 0.49;
  const shopW = vertical ? width * 0.37 : width * 0.28;
  const shopH = vertical ? height * 0.19 : height * 0.28;
  const glow = mode === "hero" ? "#f4dd91" : "#e7c36f";
  return `
    <defs>
      <linearGradient id="steamSky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#d6f1e2"/>
        <stop offset="0.45" stop-color="#f7f0d8"/>
        <stop offset="1" stop-color="#8fb173"/>
      </linearGradient>
      <linearGradient id="steamGold" x1="0" x2="1">
        <stop offset="0" stop-color="#b9792f"/>
        <stop offset="1" stop-color="${glow}"/>
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="${Math.max(3, height * 0.01)}" stdDeviation="${Math.max(5, height * 0.018)}" flood-color="#17231d" flood-opacity="0.25"/>
      </filter>
      <pattern id="ricePattern" width="${Math.max(28, width * 0.035)}" height="${Math.max(28, width * 0.035)}" patternUnits="userSpaceOnUse">
        <path d="M4 18 Q14 4 26 18" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#steamSky)"/>
    <rect width="${width}" height="${height}" fill="url(#ricePattern)" opacity="0.65"/>
    <circle cx="${width * 0.83}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.18}" fill="${glow}" opacity="0.35"/>
    <circle cx="${badgeX}" cy="${badgeY}" r="${Math.min(width, height) * 0.13}" fill="none" stroke="url(#steamGold)" stroke-width="${Math.max(6, width * 0.014)}"/>
    <circle cx="${badgeX}" cy="${badgeY}" r="${Math.min(width, height) * 0.075}" fill="none" stroke="#286f58" stroke-width="${Math.max(4, width * 0.007)}"/>
    <path d="M0 ${hillY} C${width * 0.18} ${height * 0.52} ${width * 0.32} ${height * 0.86} ${width * 0.49} ${height * 0.68} C${width * 0.66} ${height * 0.49} ${width * 0.78} ${height * 0.65} ${width} ${height * 0.52} L${width} ${height} L0 ${height}Z" fill="#668a52"/>
    <path d="M${shopX} ${shopY + shopH * 0.25} L${shopX + shopW * 0.5} ${shopY} L${shopX + shopW} ${shopY + shopH * 0.25} L${shopX + shopW} ${shopY + shopH} L${shopX} ${shopY + shopH}Z" fill="#8b6a48" filter="url(#softShadow)"/>
    <path d="M${shopX + shopW * 0.12} ${shopY + shopH * 0.28} L${shopX + shopW * 0.5} ${shopY + shopH * 0.1} L${shopX + shopW * 0.88} ${shopY + shopH * 0.28}" fill="none" stroke="#583f30" stroke-width="${Math.max(8, width * 0.014)}" stroke-linecap="round"/>
    <rect x="${shopX + shopW * 0.18}" y="${shopY + shopH * 0.42}" width="${shopW * 0.23}" height="${shopH * 0.42}" fill="#fff6d8"/>
    <rect x="${shopX + shopW * 0.57}" y="${shopY + shopH * 0.42}" width="${shopW * 0.23}" height="${shopH * 0.42}" fill="#286f58"/>
    <g filter="url(#softShadow)">
      <ellipse cx="${spiritX}" cy="${spiritY}" rx="${spiritRx}" ry="${spiritRy}" fill="#fff0c8" stroke="#7a583e" stroke-width="${Math.max(6, width * 0.012)}"/>
      <path d="M${spiritX - spiritRx * 0.38} ${spiritY - spiritRy * 0.78} C${spiritX - spiritRx * 0.22} ${spiritY - spiritRy * 1.48} ${spiritX + spiritRx * 0.32} ${spiritY - spiritRy * 1.42} ${spiritX + spiritRx * 0.42} ${spiritY - spiritRy * 0.78}" fill="none" stroke="#286f58" stroke-width="${Math.max(10, width * 0.018)}" stroke-linecap="round"/>
      <path d="M${spiritX + spiritRx * 0.02} ${spiritY - spiritRy * 0.82} C${spiritX + spiritRx * 0.3} ${spiritY - spiritRy * 1.42} ${spiritX + spiritRx * 0.76} ${spiritY - spiritRy * 1.08} ${spiritX + spiritRx * 0.52} ${spiritY - spiritRy * 0.56}" fill="none" stroke="#48a868" stroke-width="${Math.max(8, width * 0.014)}" stroke-linecap="round"/>
      <circle cx="${spiritX - spiritRx * 0.28}" cy="${spiritY - spiritRy * 0.04}" r="${Math.max(5, width * 0.01)}" fill="#17231d"/>
      <circle cx="${spiritX + spiritRx * 0.26}" cy="${spiritY - spiritRy * 0.04}" r="${Math.max(5, width * 0.01)}" fill="#17231d"/>
      <path d="M${spiritX - spiritRx * 0.18} ${spiritY + spiritRy * 0.32} Q${spiritX} ${spiritY + spiritRy * 0.5} ${spiritX + spiritRx * 0.22} ${spiritY + spiritRy * 0.32}" fill="none" stroke="#8b4c37" stroke-width="${Math.max(5, width * 0.009)}" stroke-linecap="round"/>
    </g>
    <g fill="#704c36" opacity="0.92">
      ${Array.from({ length: vertical ? 12 : 20 }, (_, index) => {
        const cols = vertical ? 4 : 10;
        const cellW = vertical ? width * 0.16 : width * 0.055;
        const cellH = vertical ? height * 0.045 : height * 0.075;
        const x = width * (vertical ? 0.16 : 0.34) + (index % cols) * cellW;
        const y = height * (vertical ? 0.76 : 0.74) + Math.floor(index / cols) * cellH;
        return `<rect x="${x}" y="${y}" width="${cellW * 0.78}" height="${cellH * 0.7}" rx="${Math.max(3, width * 0.004)}"/>`;
      }).join("")}
    </g>
    <g filter="url(#softShadow)">
      <text x="${titleX}" y="${titleY}" font-size="${titleSize}" font-family="Microsoft YaHei, SimSun, serif" font-weight="900" fill="#17231d">${title}</text>
      <text x="${titleX}" y="${titleY + titleSize * 0.9}" font-size="${subtitleSize}" font-family="Microsoft YaHei, SimSun, serif" font-weight="800" fill="#286f58">${subtitle}</text>
      ${wide ? "" : `<text x="${titleX}" y="${titleY + titleSize * 1.55}" font-size="${labelSize}" font-family="Microsoft YaHei, SimSun, serif" fill="#5d6f65">${label}</text>`}
    </g>
    ${wide ? `<text x="${titleX}" y="${height * 0.88}" font-size="${labelSize}" font-family="Microsoft YaHei, SimSun, serif" fill="#f7f0d8">${label}</text>` : ""}
  `;
}

function screenshotArt(width, height, { title, subtitle, scene }) {
  const base = {
    farm: { sky: "#d9efdf", hill: "#8da462", accent: "#704c36" },
    spirit: { sky: "#d8f0df", hill: "#7fab79", accent: "#577f80" },
    shop: { sky: "#f6f0cf", hill: "#b2875c", accent: "#8b6a48" },
    term: { sky: "#c9e7de", hill: "#7fab79", accent: "#48a868" },
    ecology: { sky: "#dfead3", hill: "#7fab79", accent: "#e7c36f" },
    dungeon: { sky: "#26323a", hill: "#4d5b4f", accent: "#c88b37" },
    trade: { sky: "#c9e7de", hill: "#7fab79", accent: "#8b6a48" },
    final: { sky: "#202b35", hill: "#30414a", accent: "#e7c36f" },
  }[scene] || { sky: "#d9efdf", hill: "#8da462", accent: "#704c36" };
  const dark = scene === "dungeon" || scene === "final";
  const textColor = dark ? "#f7f0d8" : "#17231d";
  const subColor = dark ? "#e7c36f" : "#286f58";
  const horizon = height * 0.7;
  const titleSize = width * 0.038;
  return `
    <defs>
      <linearGradient id="shotSky" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${base.sky}"/>
        <stop offset="1" stop-color="${dark ? "#18242b" : "#f7f0d8"}"/>
      </linearGradient>
      <filter id="shotShadow">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#17231d" flood-opacity="0.28"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#shotSky)"/>
    <circle cx="${width * 0.82}" cy="${height * 0.18}" r="${height * 0.13}" fill="${base.accent}" opacity="${dark ? 0.28 : 0.4}"/>
    <path d="M0 ${horizon} C${width * 0.18} ${height * 0.55} ${width * 0.34} ${height * 0.83} ${width * 0.5} ${height * 0.66} C${width * 0.68} ${height * 0.47} ${width * 0.78} ${height * 0.64} ${width} ${height * 0.52} L${width} ${height} L0 ${height}Z" fill="${base.hill}"/>
    ${scene === "dungeon" ? `<rect x="${width * 0.09}" y="${height * 0.28}" width="${width * 0.32}" height="${height * 0.36}" rx="${width * 0.025}" fill="#6b6b5d" stroke="${base.accent}" stroke-width="${width * 0.008}" filter="url(#shotShadow)"/><circle cx="${width * 0.25}" cy="${height * 0.46}" r="${height * 0.11}" fill="#8b6a48" stroke="#e7c36f" stroke-width="${width * 0.006}"/>` : ""}
    ${scene === "shop" ? `<rect x="${width * 0.12}" y="${height * 0.27}" width="${width * 0.66}" height="${height * 0.48}" rx="${width * 0.018}" fill="#8b6a48" stroke="#583f30" stroke-width="${width * 0.012}" filter="url(#shotShadow)"/><rect x="${width * 0.18}" y="${height * 0.39}" width="${width * 0.22}" height="${height * 0.25}" fill="#fff8e8"/><rect x="${width * 0.49}" y="${height * 0.39}" width="${width * 0.22}" height="${height * 0.25}" fill="#fff8e8"/>` : ""}
    ${scene === "trade" ? `<path d="M${width * 0.16} ${height * 0.45} C${width * 0.32} ${height * 0.22} ${width * 0.5} ${height * 0.24} ${width * 0.76} ${height * 0.44}" fill="none" stroke="#f7f0d8" stroke-width="${width * 0.018}" stroke-linecap="round" opacity="0.9"/><path d="M${width * 0.34} ${height * 0.46} L${width * 0.51} ${height * 0.35} L${width * 0.69} ${height * 0.46} L${width * 0.52} ${height * 0.58}Z" fill="#8b6a48" stroke="#583f30" stroke-width="${width * 0.007}" filter="url(#shotShadow)"/>` : ""}
    ${scene === "final" ? `<circle cx="${width * 0.5}" cy="${height * 0.47}" r="${height * 0.23}" fill="none" stroke="#e7c36f" stroke-width="${width * 0.01}"/><circle cx="${width * 0.5}" cy="${height * 0.47}" r="${height * 0.14}" fill="none" stroke="#48a868" stroke-width="${width * 0.006}"/>` : ""}
    ${scene !== "shop" && scene !== "dungeon" && scene !== "trade" && scene !== "final" ? `<g fill="${base.accent}" opacity="0.92">${Array.from({ length: 32 }, (_, index) => `<rect x="${width * 0.25 + (index % 8) * width * 0.055}" y="${height * 0.36 + Math.floor(index / 8) * height * 0.065}" width="${width * 0.038}" height="${height * 0.045}" rx="${width * 0.006}"/>`).join("")}</g>` : ""}
    <g filter="url(#shotShadow)">
      <ellipse cx="${width * 0.68}" cy="${height * 0.58}" rx="${width * 0.08}" ry="${height * 0.13}" fill="#fff0c8" stroke="#826246" stroke-width="${width * 0.008}"/>
      <path d="M${width * 0.65} ${height * 0.47} C${width * 0.66} ${height * 0.38} ${width * 0.71} ${height * 0.39} ${width * 0.72} ${height * 0.47}" fill="none" stroke="#286f58" stroke-width="${width * 0.014}" stroke-linecap="round"/>
      <circle cx="${width * 0.66}" cy="${height * 0.56}" r="${width * 0.006}" fill="#17231d"/>
      <circle cx="${width * 0.7}" cy="${height * 0.56}" r="${width * 0.006}" fill="#17231d"/>
    </g>
    <rect x="${width * 0.025}" y="${height * 0.055}" width="${width * 0.48}" height="${height * 0.17}" rx="${width * 0.018}" fill="${dark ? "#17231d" : "#fff8e8"}" opacity="0.82"/>
    <text x="${width * 0.045}" y="${height * 0.12}" font-size="${titleSize}" font-family="Microsoft YaHei, SimSun, serif" font-weight="900" fill="${textColor}">${title}</text>
    <text x="${width * 0.045}" y="${height * 0.178}" font-size="${width * 0.021}" font-family="Microsoft YaHei, SimSun, serif" fill="${subColor}">${subtitle}</text>
  `;
}

const steamAssetSpecs = [
  { id: "store_header_capsule", name: "store-header-capsule-920x430", width: 920, height: 430, type: "store_capsule", officialUse: "Steam store header capsule", body: titleArt(920, 430, { mode: "store" }) },
  { id: "store_small_capsule", name: "store-small-capsule-462x174", width: 462, height: 174, type: "store_capsule", officialUse: "Steam store small capsule", body: titleArt(462, 174, { label: "种田经营 · 精怪自动化", mode: "store" }) },
  { id: "store_main_capsule", name: "store-main-capsule-1232x706", width: 1232, height: 706, type: "store_capsule", officialUse: "Steam store main capsule", body: titleArt(1232, 706, { label: "二十四节气种田经营 RPG", mode: "store" }) },
  { id: "store_vertical_capsule", name: "store-vertical-capsule-748x896", width: 748, height: 896, type: "store_capsule", officialUse: "Steam store vertical capsule", body: titleArt(748, 896, { label: "修复洞天，振兴凡仙镇", mode: "store" }) },
  { id: "library_capsule", name: "library-capsule-600x900", width: 600, height: 900, type: "library_asset", officialUse: "Steam library capsule", body: titleArt(600, 900, { label: "灵植成精，前店后厂", mode: "library" }) },
  { id: "library_header", name: "library-header-920x430", width: 920, height: 430, type: "library_asset", officialUse: "Steam library header", body: titleArt(920, 430, { label: "精怪工坊 Demo", mode: "library" }) },
  { id: "library_hero", name: "library-hero-3840x1240", width: 3840, height: 1240, type: "library_asset", officialUse: "Steam library hero", body: titleArt(3840, 1240, { label: "二十四节气、精怪自动化与修仙小镇经营", mode: "hero" }) },
  { id: "screenshot_farm", name: "screenshot-farm-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "荒废洞天初始", subtitle: "从第一块灵田开始修复洞天", scene: "farm" }) },
  { id: "screenshot_spirit", name: "screenshot-spirit-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "第一只精怪浇水", subtitle: "从手忙脚乱到自动化解放", scene: "spirit" }) },
  { id: "screenshot_shop", name: "screenshot-shop-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "旧铺开门经营", subtitle: "定价、陈列、顾客反馈串起前店后厂", scene: "shop" }) },
  { id: "screenshot_term", name: "screenshot-term-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "节气影响农田", subtitle: "二十四节气改变作物、天气和风险", scene: "term" }) },
  { id: "screenshot_ecology", name: "screenshot-ecology-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "精怪生态庭院", subtitle: "多精怪组合触发生态共鸣", scene: "ecology" }) },
  { id: "screenshot_dungeon", name: "screenshot-dungeon-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "青云矿洞战斗", subtitle: "精怪随行挑战秘境 Boss", scene: "dungeon" }) },
  { id: "screenshot_trade", name: "screenshot-trade-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "跨界商路启航", subtitle: "商队利润、补给风险与隐藏秘境轮换", scene: "trade" }) },
  { id: "screenshot_final_support", name: "screenshot-final-support-1920x1080", width: 1920, height: 1080, type: "screenshot", officialUse: "Steam screenshot", body: screenshotArt(1920, 1080, { title: "终章支援建阵", subtitle: "NPC 支援和二十四节气大阵收束主线", scene: "final" }) },
];

const steamAssets = [];

for (const spec of steamAssetSpecs) {
  const svgMeta = writeSteamSvg(`${spec.name}.svg`, spec.width, spec.height, spec.body);
  steamAssets.push({
    id: spec.id,
    name: spec.name,
    type: spec.type,
    official_use: spec.officialUse,
    width: spec.width,
    height: spec.height,
    source_svg: svgMeta.path,
    png: null,
    status: "svg_ready_renderer_unavailable",
  });
  files.push(svgMeta.path);
}

let renderer = sharp ? "sharp" : "none";
if (sharp) {
  for (const spec of steamAssetSpecs) {
    const asset = steamAssets.find((entry) => entry.id === spec.id);
    const source = { text: svg(spec.width, spec.height, spec.body) };
    asset.png = await renderPng(source, `${spec.name}.png`);
    asset.status = asset.png ? "png_ready" : "svg_ready_renderer_unavailable";
  }
}

if (!steamAssets.every((asset) => asset.png)) {
  const rendered = renderSteamPngsWithPython(steamAssetSpecs);
  if (rendered.size) renderer = "python-pillow";
  for (const asset of steamAssets) {
    if (asset.png) continue;
    const pngPath = rendered.get(asset.id) || null;
    asset.png = pngPath;
    asset.status = pngPath ? "png_ready" : "svg_ready_renderer_unavailable";
  }
}

for (const asset of steamAssets) {
  if (asset.png) files.push(asset.png);
}

writeFileSync(
  join(outDir, "steam-ready", "STEAM_ASSET_README.md"),
  `# Steam Ready Asset Pack

状态：\`procedural_placeholder_ready\`

这批素材由 \`tools/generate-assets.mjs\` 生成，目标是让发行/QA 先拥有尺寸正确、项目自有、可替换的 Steam 图形资产包。当前为程序化占位素材，不替代最终实机截图、正式 key art 或 PV。

## 包含

- Store Header Capsule 920x430
- Store Small Capsule 462x174
- Store Main Capsule 1232x706
- Store Vertical Capsule 748x896
- Library Capsule 600x900
- Library Header 920x430
- Library Hero 3840x1240
- 8 张 1920x1080 Steam 截图占位图

## 目录

- \`source-svg/\`：可编辑 SVG 源文件。
- \`png/\`：由本地 \`sharp\` 或 bundled Python/Pillow 渲染的 PNG；如运行环境缺少渲染器，manifest 会标记为 \`svg_ready_renderer_unavailable\`。

## 上架前边界

- 最终 Steam 页面仍应使用最终可执行文件捕获的真实截图和 PV。
- 当前 PNG 主要用于商店页布局、尺寸检查、发行清单预审和 Demo 宣发占位。
- 若美术替换，请保持 manifest 中的尺寸和文件命名规则，便于 QA 自动校验。
`,
  "utf8",
);

writeFileSync(
  join(outDir, "asset-manifest.json"),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      license: "Project-owned procedural SVG assets generated from code.",
      renderer,
      files,
      steam_ready: {
        status: steamAssets.every((asset) => asset.png) ? "png_ready" : "svg_ready_renderer_unavailable",
        directory: "assets/steam-ready",
        official_reference: "Steamworks Store Graphical Assets and Library Assets dimensions checked on 2026-06-02.",
        assets: steamAssets,
      },
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`Generated ${files.length} assets in ${outDir}`);
console.log(`Steam-ready assets: ${steamAssets.length}; PNG renderer: ${renderer}.`);
