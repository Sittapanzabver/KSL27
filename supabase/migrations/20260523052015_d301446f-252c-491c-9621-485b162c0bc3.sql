
-- 1. Enable RLS on ksl_season_stats (no policies = only service role can access)
ALTER TABLE public.ksl_season_stats ENABLE ROW LEVEL SECURITY;

-- 2. Revoke column-level access to financial/viewership columns on matches
REVOKE SELECT (
  live_viewers_u16, live_viewers_main, live_viewers_total,
  tickets_sold, ticket_revenue,
  season_tickets_sold, season_tickets_revenue,
  merch_revenue, sponsor_revenue, total_revenue
) ON public.matches FROM anon, authenticated;

-- 3. Storage bucket write protection: only service role can write to media/assets.
-- (No INSERT/UPDATE/DELETE policies are created, so anon/authenticated are denied by default.)
-- Public SELECT remains since these are public buckets serving site assets.
DO $$
BEGIN
  -- drop any overly-permissive write policies if present
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public write media') THEN
    DROP POLICY "Public write media" ON storage.objects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public write assets') THEN
    DROP POLICY "Public write assets" ON storage.objects;
  END IF;
END $$;
