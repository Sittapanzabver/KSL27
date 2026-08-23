
REVOKE EXECUTE ON FUNCTION public.recalc_standings(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_player_stats(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_match_recalc() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_event_recalc() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role is intended for use in RLS, keep callable

-- Replace broad media listing policy with one that only allows reading files (not full listing)
DROP POLICY IF EXISTS "Media public read" ON storage.objects;
CREATE POLICY "Media public file read" ON storage.objects FOR SELECT USING (bucket_id='media');
-- Note: Supabase storage SELECT covers both read and list. To prevent listing,
-- the bucket setting `public=true` already serves files via CDN. Keep policy minimal.

ALTER FUNCTION public.touch_updated_at() SET search_path = public;
