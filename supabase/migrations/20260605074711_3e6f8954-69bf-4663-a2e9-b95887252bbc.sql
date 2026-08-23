DROP POLICY IF EXISTS "Allow public read access for ksl_season_stats" ON public.ksl_season_stats;
REVOKE SELECT ON public.ksl_season_stats FROM anon, authenticated;