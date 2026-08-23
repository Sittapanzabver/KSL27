# LOVABLE_HANDOFF — อัปโค้ด KSL 2027 ขึ้น Lovable (ทางเดียว)

> **Owner:** Sp1cyP · **Date:** 22/08/2026 · **สถานะ:** 🔵 พร้อมทำตามขั้นตอนนี้
> **หลักการ:** KSL อยู่ **Lovable ทางเดียว** (อนุมัติ 22/08) — deploy + SQL Editor + DB `qzksqhlrkpqnbavjpieq` · deployment Vercel เก่า (`koratsuperleague.vercel.app`) = ปิด/ลบ
> **อ่านคู่กับ:** `DEPLOYMENT_DIRECTIVE.md` (Change Log 22/08) · `SKILL.md` · `supabase/seed_2027_structure.sql`

---

## 0. สรุปสิ่งที่ต้องทำ (3 ขั้น)

1. **รัน SQL** — สร้าง season 2027 + divisions + club_seasons + flip is_active (ทำก่อนโค้ด)
2. **อัปโค้ด 2027** — แปะการแก้ 15 ไฟล์ลงโปรเจกต์ Lovable (`lovp_2w2k1qgfmk8r38qh8gvzwk3sz9`)
3. **Publish + ปิด Vercel เก่า** — ตรวจหน้าเว็บแล้วปิด deployment ซ้ำ

---

## 1. ขั้นตอนที่ 1 — รัน SQL (ก่อนโค้ด)

1. เปิด [Lovable](https://lovable.dev/projects/lovp_2w2k1qgfmk8r38qh8gvzwk3sz9) → โปรเจกต์ KSL
2. เปิด **Supabase** (ไอคอนฐานข้อมูลด้านซ้าย) → **SQL Editor**
3. วางเนื้อหาไฟล์ `supabase/seed_2027_structure.sql` (ในเครื่อง `CSDP\ksl-hub\supabase\`) → **Run**
4. ตรวจผล: ควรได้ season 2027 (is_active = true) + divisions 2 แถว + club_seasons 8 แถว

> SQL นี้ idempotent (รันซ้ำได้ ไม่ซ้ำ) — UUID ตรงกับโค้ดในข้อ 2 แล้ว ไม่ต้องแก้อะไร

```sql
-- ============================================================
-- เตรียมโครงสร้าง season 2027 (จากรายชื่อทีมเดิมของ 2026)
-- UUID ที่ใช้ตรงกับ src/lib/divisions.ts (SUPER_LEAGUE / U16)
-- ============================================================
BEGIN;

-- 1) ใส่ season 2027 ถ้ายังไม่มี (id deterministic กันรันซ้ำ)
INSERT INTO public.seasons (id, name, year, is_active, start_date, end_date)
VALUES (
  '7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d',
  'Korat Super League 2027',
  2027,
  true,
  '2027-01-01',
  '2027-12-31'
)
ON CONFLICT (id) DO NOTHING;

-- 2) ยกเลิก season เดิมที่ active ไว้ (2026) — เหลือ 2027 active เท่านั้น
UPDATE public.seasons
SET is_active = false
WHERE is_active = true AND year <> 2027;

-- 3) divisions ของ 2027 (Super League tier 1 + U-16 tier 2) — ตรงกับ src/lib/divisions.ts
INSERT INTO public.divisions (id, season_id, name, tier)
VALUES
  ('bd770ed0-2027-47e0-ab34-901a151e9f7c', '7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d', 'Super League', 1),
  ('11111111-2027-4016-8000-000000000016', '7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d', 'U-16', 2)
ON CONFLICT (id) DO NOTHING;

-- 4) ผูก club_seasons ให้ 8 ทีมเดิม (ดูจาก clubs ที่มีอยู่, season_short_name = code)
INSERT INTO public.club_seasons (season_id, club_id, season_name, season_short_name)
SELECT s.id, c.id, 'KSL 2027', c.short_name
FROM public.seasons s
CROSS JOIN public.clubs c
WHERE s.year = 2027
  AND NOT EXISTS (
    SELECT 1 FROM public.club_seasons cs
    WHERE cs.season_id = s.id AND cs.club_id = c.id AND cs.season_short_name = c.short_name
  );

COMMIT;
```

---

## 2. ขั้นตอนที่ 2 — อัปโค้ด 2027 (15 ไฟล์)

**วิธีทำ:** เปิดโปรเจกต์ Lovable → ใช้ Chat (หรือ file editor) → บอกให้แก้ตามรายการนี้ (หรือแปะเนื้อหาไฟล์จากเครื่อง `CSDP\ksl-hub\src\...` ทับไฟล์เดิม) → Lovable จะ build + preview ให้

> 💡 วิธีเร็วสุด: แปะ **รายการด้านล่างนี้ทั้งบล็อก** ให้ Lovable AI ทำทีละไฟล์ — ทุกไฟล์มีอยู่ในเครื่องเป็นเวอร์ชันสมบูรณ์แล้ว

### ไฟล์ที่แก้ (เรียงตามลำดับ)

| # | ไฟล์ (ในเครื่อง `src\...`) | เปลี่ยนอะไร |
|---|---|---|
| 1 | `lib/site.ts` | `SITE_YEAR = "2027"` (SSOT — meta/head/footer ขยับตาม) |
| 2 | `lib/divisions.ts` | UUID divisions → 2027: Super League `bd770ed0-2027-47e0-ab34-901a151e9f7c` · U-16 `11111111-2027-4016-8000-000000000016` |
| 3 | `lib/queries.ts` | default divisionId → `bd770ed0-2027-...` + `fetchRecentResults`/`fetchUpcomingMatches` กรองตาม season ที่ active (`getActiveSeasonId()`) — กันผล 2026 ปนหน้า 2027 |
| 4 | `lib/i18n.tsx` | ข้อความ hero/รางวัล: "จบฤดูกาล 2026 ✅ 14 นัด" → "เปิดฤดูกาล 2027 · Coming Soon" · แชมป์/โค้ช/ดาวซัลโว → "รอประกาศ" |
| 5 | `components/home/HeroSection.tsx` | "Season Concluded · Champions: เสิงสาง" → "Season 2027 · 8 Clubs · 32 Districts" · การ์ด featured "เสิงสาง คัมแบ็ค!! ทวงแชมป์" → "KSL 2027 เปิดฉากฤดูกาลใหม่" · ลบสถิติ 56 นัด/274K+ views (ข้อมูล 2026) |
| 6 | `components/home/SponsorsSection.tsx` | เพิ่ม `import { SITE_YEAR }` (บั๊กเดิมใช้โดยไม่ import) |
| 7 | `components/home/U16SpotlightSection.tsx` | ตัด "120+" (ตัวเลข 2026) เหลือ "เยาวชนนักเตะจาก 8 อำเภอ · ฤดูกาล 2027" |
| 8 | `components/home/DistrictCoverageSection.tsx` | "Empty districts are marked for 2027 expansion" → "open for new clubs" |
| 9 | `components/site/DistrictMap.tsx` | tooltip "เปิดรับทีม 2027" → "เปิดรับทีมใหม่" |
| 10 | `routes/standings.tsx` | subtitle "แมตช์เดย์ 14" → "อัปเดตอัตโนมัติจากผลการแข่งขัน" + เพิ่ม `import { SITE_YEAR }` |
| 11 | `routes/matches.$matchId.tsx` | isU16 ใช้ `DIVISIONS.U16.id` แทน UUID 2026 hardcode |
| 12 | `routes/news.tsx` | เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม) |
| 13 | `routes/news.$slug.tsx` | เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม) |
| 14 | `routes/sponsors.tsx` | เพิ่ม `SITE_YEAR` ใน import (บั๊กเดิม) |
| 15 | `components/sponsors/MediaMetricsSection.tsx` + `OfficialPartnersSection.tsx` | `{SITE_YEAR}` ใน string literal → template literal (แสดงปีจริง) + ข้อความ "ยอดสะสมของลีก" |
| 16 | `lib/draw.ts` (**ใหม่**) | Tournament draw engine (pure): shuffle · knockoutBracket (pad BYE) · roundRobin (circle) · groupDraw (seeded rng)` — จับฉลาก/จับคู่ 2027 |
| 17 | `routes/tournament-draw.tsx` (**ใหม่**) | หน้า `/tournament-draw` — เลือกฟอร์แมต + ทีม (8 สโมสรจริง/เพิ่มเอง) + seed code → แสดง bracket. ใช้ `PREVIEW_YEAR` (วางพร้อมรันได้เลย) |
| 18 | `lib/i18n.tsx` + `components/site/Header.tsx` | เพิ่ม key `nav.draw` + ลิงก์เมนู "จับฉลาก" |

### ⚠️ บั๊กแฝงที่แก้แถม (ห้ามลืมแปะด้วย)
- `routes/clubs.tsx` + `routes/top-scorers.tsx` — ใช้ `buildHead` โดยไม่ import → เพิ่ม `import { buildHead, SITE_YEAR } from "@/lib/site"`
- `routes/tournament-draw.tsx` — `PREVIEW_YEAR = Number(SITE_YEAR)` + import `SITE_YEAR`

> ตรวจหลังแปะ: ให้ Lovable รัน build — ต้องไม่มี error (ในเครื่อง: `npm run build` ✅ 1.79s + `tsc --noEmit` ✅)

---

## 3. ขั้นตอนที่ 3 — Publish + ปิด Vercel เก่า

1. **Preview ตรวจ** (Lovable preview): หน้าแรกขึ้น "Season 2027 · Coming Soon" · `/standings` แสดง "ยังไม่มีข้อมูล" (ปกติ — ยังไม่มีผลแข่ง 2027) · ลิงก์/ข่าว/สโมสรโหลดได้
2. **Publish** → หน้า `koratsuperleague.lovable.app` อัปเดตเป็น 2027
3. **ปิด Vercel เก่า** (กันสับสน/2 หน้าไม่ตรง): ล็อกอิน [vercel.com](https://vercel.com) → โปรเจกต์ `koratsuperleague` → **Settings → Danger Zone → Delete Project** (หรือ Pause deployment) — หลังปิด `koratsuperleague.vercel.app` จะ 404/offline

---

## 4. หลังเสร็จ (ตรวจสอบ)

- [ ] `koratsuperleague.lovable.app` แสดง "Season 2027" ทั้ง title/hero/footer
- [ ] `/standings` + `/matches` มี dropdown ฤดูกาล → 2027 ว่าง (รอผลแข่ง)
- [ ] `/sponsors` ข้อความปี 2027 ถูกต้อง
- [ ] `koratsuperleague.vercel.app` offline
- [ ] อัปเดต `DEPLOYMENT_DIRECTIVE.md` (ถ้าปิด Vercel แล้ว เปลี่ยนสถานะเป็น "ปิดแล้ว")

## 5. งาน 2027 ถัดไป (เมื่อฤดูกาลเริ่ม)

- ใส่ผลแข่ง: INSERT matches (season_id `7f3c9a2e-...`) + `recalc_standings()` — ตาม `SKILL.md` §9
- ใส่ดาวซัลโว: INSERT top_scorers (season = 2027) — หรือรอ spreadsheet sync
- เปลี่ยนเนื้อหา hero เมื่อมีแชมป์/ผลจริง (ไฟล์เดียวกับข้อ 2.5/2.4)

---

*ไฟล์นี้เป็นคู่มือส่งมอบ — โค้ดสมบูรณ์อยู่ในเครื่อง `CSDP\ksl-hub\` (build+tsc ผ่าน 22/08) · ใช้แปะขึ้น Lovable ทางเดียว*