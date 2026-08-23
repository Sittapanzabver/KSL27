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

  INSERT INTO public.standings (club_id, season_id, division_id)
  SELECT c.id, _season, _division FROM public.clubs c
  WHERE c.division_id = _division
    AND NOT EXISTS (SELECT 1 FROM public.standings s WHERE s.club_id=c.id AND s.season_id=_season AND s.division_id=_division)
  ON CONFLICT DO NOTHING;

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