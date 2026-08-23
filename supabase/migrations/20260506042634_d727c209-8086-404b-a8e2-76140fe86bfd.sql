
-- 1. Restrict sensitive financial/viewership columns on matches via column-level privileges
REVOKE SELECT ON public.matches FROM anon, authenticated;
GRANT SELECT (
  id, matchweek, home_club_id, away_club_id, kickoff_at, venue, home_score, away_score,
  status, mvp_player_id, highlights_url, created_at, season_id, division_id,
  attendance, referee, sponsor_banner_url, notes
) ON public.matches TO anon, authenticated;

-- 2. Restrict profiles public read: drop overly broad policy, allow own-row reads + admin reads
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;

CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Media bucket: align by allowing public read on storage objects (bucket is public)
CREATE POLICY "Public read media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

-- 4. Revoke EXECUTE on admin-only SECURITY DEFINER functions from regular users
REVOKE EXECUTE ON FUNCTION public.admin_list_fans() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_sync_missing_fans() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_auth_user_membership(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_player_stats(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_standings(uuid, uuid) FROM PUBLIC, anon, authenticated;
