import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = join(__dirname, "../public/images/best-logo.png");
const outPath = join(__dirname, "../public/images/map-marker.svg");

const logo = readFileSync(logoPath);
const b64 = logo.toString("base64");
const dataUrl = `data:image/png;base64,${b64}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="56" height="56" viewBox="0 0 56 56">
  <defs>
    <clipPath id="circle">
      <circle cx="28" cy="24" r="22"/>
    </clipPath>
  </defs>
  <circle cx="28" cy="24" r="22" fill="white" stroke="#d1d5db" stroke-width="2"/>
  <image href="${dataUrl}" x="4" y="2" width="48" height="44" preserveAspectRatio="xMidYMid meet" clip-path="url(#circle)"/>
  <path d="M28 46 L22 56 L34 56 Z" fill="white" stroke="#d1d5db" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

writeFileSync(outPath, svg);
console.log("Generated map-marker.svg");
