# 📋 KSL 2027 — ชุดแปะโค้ดขึ้น Lovable (paste-ready bundle)

> ใช้กับโปรเจกต์ Lovable: `lovp_2w2k1qgfmk8r38qh8gvzwk3sz9`
> โค้ดสมบูรณ์อยู่ในเครื่อง `CSDP\ksl-hub\` — **build ✓ (1.65s) + tsc ✓ (0 errors) 22/08/2026**

## วิธีใช้ (แปะทั้งบล็อกนี้ให้ Lovable AI ทำทีละไฟล์)

เปิดโปรเจกต์ KSL ใน Lovable → Chat → วางข้อความด้านล่าง → Lovable แก้ไฟล์ตามรายการ → preview → publish

---

**ให้แก้ไฟล์เหล่านี้ให้ตรงกับเวอร์ชันบนเครื่อง (สำหรับ season 2027):**

1. **`lib/site.ts`** — `SITE_YEAR = "2027"` (SSOT — meta/head/footer ขยับตาม)
2. **`lib/divisions.ts`** — UUID divisions → 2027: Super League `bd770ed0-2027-47e0-ab34-901a151e9f7c` · U-16 `11111111-2027-4016-8000-000000000016`
3. **`lib/queries.ts`** — default divisionId → `bd770ed0-2027-...` + `fetchRecentResults`/`fetchUpcomingMatches` กรองตาม season ที่ active (`getActiveSeasonId()`) — กันผล 2026 ปนหน้า 2027
4. **`lib/i18n.tsx`** — ข้อความ hero/รางวัล: "จบฤดูกาล 2026 ✅ 14 นัด" → "เปิดฤดูกาล 2027 · Coming Soon" · แชมป์/โค้ช/ดาวซัลโว → "รอประกาศ"
5. **`components/home/HeroSection.tsx`** — "Season Concluded · Champions: เสิงสาง" → "Season 2027 · 8 Clubs · 32 Districts" · การ์ด featured → "KSL 2027 เปิดฉากฤดูกาลใหม่" · ลบสถิติ 56 นัด/274K+ views (ข้อมูล 2026)
6. **`components/home/SponsorsSection.tsx`** — เพิ่ม `import { SITE_YEAR }`
7. **`components/home/U16SpotlightSection.tsx`** — ตัด "120+" เหลือ "เยาวชนนักเตะจาก 8 อำเภอ · ฤดูกาล 2027"
8. **`components/home/DistrictCoverageSection.tsx`** — "Empty districts are marked for 2027 expansion" → "open for new clubs"
9. **`components/site/DistrictMap.tsx`** — tooltip "เปิดรับทีม 2027" → "เปิดรับทีมใหม่"
10. **`routes/standings.tsx`** — subtitle "แมตช์เดย์ 14" → "อัปเดตอัตโนมัติจากผลการแข่งขัน" + เพิ่ม `import { SITE_YEAR }`
11. **`routes/matches.$matchId.tsx`** — isU16 ใช้ `DIVISIONS.U16.id` แทน UUID 2026 hardcode
12. **`routes/news.tsx`** — เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม)
13. **`routes/news.$slug.tsx`** — เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม)
14. **`routes/sponsors.tsx`** — เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม)
15. **`components/sponsors/MediaMetricsSection.tsx`** + **`OfficialPartnersSection.tsx`** — `{SITE_YEAR}` ใน string literal → template literal + ข้อความ "ยอดสะสมของลีก"

**ไฟล์ใหม่ (สร้างเพิ่ม — วางทั้งไฟล์):**
16. **`lib/draw.ts`** (ใหม่) — Tournament draw engine (pure): shuffle · knockoutBracket (pad BYE) · roundRobin (circle) · groupDraw (seeded rng)
17. **`routes/tournament-draw.tsx`** (ใหม่) — หน้า `/tournament-draw` จับฉลาก/จับคู่ (เลือกฟอร์แมต + ทีม + seed code)
18. **`lib/i18n.tsx`** + **`components/site/Header.tsx`** — key `nav.draw` + ลิงก์เมนู "จับฉลาก"

**บั๊กแฝง (ห้ามลืม):**
- `routes/clubs.tsx` + `routes/top-scorers.tsx` — ใช้ `buildHead` โดยไม่ import → เพิ่ม `import { buildHead, SITE_YEAR } from "@/lib/site"`
- `routes/tournament-draw.tsx` — `PREVIEW_YEAR` ใช้เป็นค่าคงที่อิสระ (ไม่ผูก SITE_YEAR)

---

**ลำดับก่อนแปะโค้ด:** ต้องรัน `supabase/seed_2027_structure.sql` ที่ Supabase SQL Editor ก่อน (สร้าง season 2027 + divisions + club_seasons) — ไม่งั้นโค้ดชี้ UUID 2027 ที่ DB ยังไม่มี
