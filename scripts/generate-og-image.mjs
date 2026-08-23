#!/usr/bin/env node
/**
 * generate-og-image.mjs — สร้างรูป share (og:image) 1200×630 แบบ stable
 * ใช้ logo + แบรนด์ KSL — รันใหม่ได้ทุกเมื่อ ไม่มี dependency เพิ่ม
 *
 * รัน: node scripts/generate-og-image.mjs
 * ไฟล์ออก: public/og-image.png
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const logoPath = path.join(root, "public", "ksl-logo.png");
const outPath = path.join(root, "public", "og-image.png");

if (!fs.existsSync(logoPath)) {
  console.error("❌ ไม่พบ public/ksl-logo.png");
  process.exit(1);
}
const logoB64 = fs.readFileSync(logoPath).toString("base64");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7f1d1d"/>
      <stop offset="55%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#3f0a0a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- แถบตกแต่ง -->
  <rect x="0" y="0" width="1200" height="14" fill="#fca5a5" opacity="0.9"/>
  <rect x="0" y="616" width="1200" height="14" fill="#fca5a5" opacity="0.9"/>
  <polygon points="0,520 1200,430 1200,520 0,610" fill="#ffffff" opacity="0.06"/>
  <polygon points="0,560 1200,470 1200,560 0,650" fill="#ffffff" opacity="0.05"/>
  <!-- โลโก้ -->
  <image href="data:image/png;base64,${logoB64}" x="470" y="46" width="260" height="260" preserveAspectRatio="xMidYMid meet"/>
  <text x="600" y="375" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="6">KORAT SUPER LEAGUE</text>
  <text x="600" y="430" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#fca5a5" text-anchor="middle" letter-spacing="10">SEASON 2026</text>
  <text x="600" y="480" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="3" fill="#fecaca" text-anchor="middle">32 DISTRICTS · ONE LEAGUE</text>
  <rect x="0" y="536" width="1200" height="80" fill="#000000" opacity="0.28"/>
  <text x="600" y="586" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="4">MEINHARD SPORTS · MSK26</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
const meta = await sharp(outPath).metadata();
console.log(`✅ สร้าง ${outPath} — ${meta.width}×${meta.height} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
