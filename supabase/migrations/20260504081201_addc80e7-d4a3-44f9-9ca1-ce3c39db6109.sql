ALTER TABLE public.standings DROP CONSTRAINT IF EXISTS standings_club_id_key;
ALTER TABLE public.standings ADD CONSTRAINT standings_club_season_division_key UNIQUE (club_id, season_id, division_id);