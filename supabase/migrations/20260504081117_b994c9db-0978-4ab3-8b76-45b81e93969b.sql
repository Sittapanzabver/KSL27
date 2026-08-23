-- เพิ่มดิวิชั่น U-16 ในซีซั่น 2026
INSERT INTO public.divisions (id, season_id, name, tier)
VALUES ('11111111-2026-4016-8000-000000000016', '423c1997-b247-4db6-ac40-7b01ca536b1d', 'U-16', 2);

-- ปรับ recalc_standings ให้ insert standings เฉพาะสโมสรที่ลงทะเบียนใน division นั้น (ผ่าน standings ที่มีอยู่แล้ว)
-- แทนที่จะ filter ด้วย clubs.division_id ซึ่งเก็บได้แค่ค่าเดียว
CREATE OR REPLACE FUNCTION public.recalc_standings(_season uuid, _division uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.standings
     SET played=0, won=0, drawn=0, lost=0, goals_for=0, goals_against=0, points=0, updated_at=now()
   WHERE season_id = _season AND division_id = _division;

  WITH agg AS (
    SELECT club_id,
           COUNT(*) AS played,
           SUM(CASE WHEN gf>ga THEN 1 ELSE 0 END) AS won,
           SUM(CASE WHEN gf=ga THEN 1 ELSE 0 END) AS drawn,
           SUM(CASE WHEN gf<ga THEN 1 ELSE 0 END) AS lost,
           SUM(gf) AS gf_total,
           SUM(ga) AS ga_total
    FROM (
      SELECT home_club_id AS club_id, home_score AS gf, away_score AS ga
        FROM public.matches
       WHERE status='finished' AND season_id=_season AND division_id=_division
         AND home_score IS NOT NULL AND away_score IS NOT NULL
      UNION ALL
      SELECT away_club_id, away_score, home_score
        FROM public.matches
       WHERE status='finished' AND season_id=_season AND division_id=_division
         AND home_score IS NOT NULL AND away_score IS NOT NULL
    ) t
    GROUP BY club_id
  )
  UPDATE public.standings s SET
    played = a.played, won = a.won, drawn = a.drawn, lost = a.lost,
    goals_for = a.gf_total, goals_against = a.ga_total,
    points = a.won*3 + a.drawn, updated_at = now()
  FROM agg a
  WHERE s.club_id=a.club_id AND s.season_id=_season AND s.division_id=_division;
END; $function$;