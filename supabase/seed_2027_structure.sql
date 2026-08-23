-- ============================================================
-- เตรียมโครงสร้าง season 2027 (จากรายชื่อทีมเดิมของ 2026)
-- หมายเหตุ: นี่เป็น STRUCTURE (seasons + divisions + club_seasons) ไม่มีผลการแข่งขัน
-- ราคา/ผล 2027 ยังไม่มีการลง ต้องเติมเมื่อเริ่มฤดูกาลจริง
-- ใช้งาน: เมื่อ SITE_YEAR เตรียมขยับเป็น 2027
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