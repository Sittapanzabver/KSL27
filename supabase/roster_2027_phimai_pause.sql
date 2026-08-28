-- ═══════════════════════════════════════════════════════════════
-- KSL 2027 — Roster 7 สโมสร + พิมายพักฤดูกาล
-- สำหรับ: Supabase SQL Editor (project qzksqhlrkpqnbavjpieq)
-- สร้าง: 28/08/2026 โดย Hermes · ตรวจ UUID กับ DB จริงแล้ว
-- คุณสมบัติ: idempotent (รันซ้ำได้ ไม่พัง)
-- ═══════════════════════════════════════════════════════════════

-- ═══ 0) PRE-CHECK: ดูสถานะก่อนแก้ (ควรเห็นพิมายใน roster 2027 = 8 ทีม) ═══
SELECT c.name, c.slug, cs.season_name
FROM public.club_seasons cs
JOIN public.clubs c ON c.id = cs.club_id
JOIN public.seasons s ON s.id = cs.season_id
WHERE s.year = 2027
ORDER BY c.name;

-- ═══ 1) เอาพิมายออกจาก roster ฤดูกาล 2027 (แถวเดียว ไม่แตะอย่างอื่น) ═══
DELETE FROM public.club_seasons
WHERE season_id = (SELECT id FROM public.seasons WHERE year = 2027)
  AND club_id   = (SELECT id FROM public.clubs WHERE slug = 'phimai-fc');

-- ═══ 2) ย้าย 7 ทีมที่เหลือไป division 2027 (แก้กริดหน้าแรกว่างเปล่า) ═══
-- พิมายถูกเว้นไว้ = ไม่อยู่ในลีก 2027 แต่ข้อมูล/นักเตะ/หน้าสโมสรครบ
UPDATE public.clubs
SET division_id = 'bd770ed0-2027-47e0-ab34-901a151e9f7c'   -- Super League 2027
WHERE division_id = 'bd770ed0-a2f2-47e0-ab34-901a151e9f7c' -- Super League 2026
  AND slug <> 'phimai-fc';

-- ═══ 3) POST-CHECK: ผลที่ถูกต้อง ═══
-- 3a) roster 2027 ต้องเหลือ 7 ทีม ไม่มีพิมาย
SELECT c.name FROM public.club_seasons cs
JOIN public.clubs c ON c.id = cs.club_id
JOIN public.seasons s ON s.id = cs.season_id
WHERE s.year = 2027 ORDER BY c.name;

-- 3b) พิมายยังอยู่ครบ (แค่ไม่อยู่ div 2027)
SELECT name, slug, division_id FROM public.clubs WHERE slug = 'phimai-fc';
