CREATE OR REPLACE FUNCTION public.sync_current_user_membership()
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _email text;
  _username text;
  _display_name text;
  _avatar_url text;
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT
    u.email::text,
    COALESCE(
      NULLIF(TRIM(u.raw_user_meta_data->>'username'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
      split_part(u.email::text, '@', 1)
    ),
    COALESCE(
      NULLIF(u.raw_user_meta_data->>'avatar_url', ''),
      NULLIF(u.raw_user_meta_data->>'picture', '')
    )
  INTO _email, _display_name, _avatar_url
  FROM auth.users u
  WHERE u.id = _user_id;

  _username := split_part(_email, '@', 1);
  _display_name := COALESCE(NULLIF(TRIM(_display_name), ''), _username, 'Fan');

  INSERT INTO public.profiles (user_id, display_name, avatar_url, role)
  VALUES (_user_id, _display_name, _avatar_url, 'user')
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = COALESCE(NULLIF(TRIM(public.profiles.display_name), ''), EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  IF NOT EXISTS (
    SELECT 1
    FROM public.fan_registrations fr
    WHERE lower(trim(fr.full_name)) IN (lower(trim(_display_name)), lower(trim(_username)))
  ) THEN
    INSERT INTO public.fan_registrations (full_name, phone, district)
    VALUES (_display_name, 'pending', 'pending');
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_auth_user_membership(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bootstrap_admin_if_empty() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_sync_missing_fans() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_list_fans() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.sync_current_user_membership() TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_fan(text, text, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;