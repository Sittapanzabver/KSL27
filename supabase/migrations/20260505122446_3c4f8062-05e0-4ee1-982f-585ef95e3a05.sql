CREATE OR REPLACE FUNCTION public.sync_auth_user_membership(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _email text;
  _username text;
  _display_name text;
  _avatar_url text;
  _profile_role text;
  _favorite_club_id uuid;
BEGIN
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

  IF _email IS NULL THEN
    RETURN false;
  END IF;

  _username := split_part(_email, '@', 1);
  _display_name := COALESCE(NULLIF(TRIM(_display_name), ''), _username, 'Fan');

  SELECT role, favorite_club_id
  INTO _profile_role, _favorite_club_id
  FROM public.profiles
  WHERE user_id = _user_id;

  INSERT INTO public.profiles (user_id, display_name, avatar_url, role)
  VALUES (_user_id, _display_name, _avatar_url, COALESCE(_profile_role, 'user'))
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = COALESCE(NULLIF(TRIM(public.profiles.display_name), ''), EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    role = COALESCE(public.profiles.role, 'user'),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'user'::app_role)
  ON CONFLICT DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM public.fan_registrations fr
    WHERE lower(trim(fr.full_name)) IN (lower(trim(_display_name)), lower(trim(_username)))
  ) THEN
    INSERT INTO public.fan_registrations (
      full_name,
      phone,
      favorite_club_id,
      favorite_club_name,
      district
    ) VALUES (
      _display_name,
      'pending',
      _favorite_club_id,
      NULL,
      'pending'
    );
  END IF;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.sync_auth_user_membership(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.sync_current_user_membership()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN public.sync_auth_user_membership(_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.bootstrap_admin_if_empty()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid := auth.uid();
BEGIN
  IF _user_id IS NULL THEN
    RETURN false;
  END IF;

  PERFORM public.sync_auth_user_membership(_user_id);

  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin'::app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN public.has_role(_user_id, 'admin'::app_role);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_sync_missing_fans()
RETURNS TABLE(fixed_users integer, missing_profiles_before integer, missing_fan_registrations_before integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user record;
  _fixed integer := 0;
  _missing_profiles integer := 0;
  _missing_fans integer := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  SELECT COUNT(*)::integer
  INTO _missing_profiles
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE p.user_id IS NULL;

  SELECT COUNT(*)::integer
  INTO _missing_fans
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.fan_registrations fr
    WHERE lower(trim(fr.full_name)) IN (
      lower(trim(COALESCE(NULLIF(p.display_name, ''), split_part(u.email::text, '@', 1)))),
      lower(trim(split_part(u.email::text, '@', 1)))
    )
  );

  FOR _user IN SELECT id FROM auth.users LOOP
    IF public.sync_auth_user_membership(_user.id) THEN
      _fixed := _fixed + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT _fixed, _missing_profiles, _missing_fans;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_fans()
RETURNS TABLE(user_id uuid, email text, display_name text, avatar_url text, role text, signup_at timestamp with time zone, favorite_club_id uuid, favorite_club_name text, phone text, district text, registered boolean)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::text AS email,
    p.display_name,
    p.avatar_url,
    COALESCE(p.role, 'user') AS role,
    u.created_at AS signup_at,
    p.favorite_club_id,
    c.name AS favorite_club_name,
    fr.phone,
    fr.district,
    (p.role = 'fan' AND p.favorite_club_id IS NOT NULL AND COALESCE(fr.phone, '') <> 'pending') AS registered
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.clubs c ON c.id = p.favorite_club_id
  LEFT JOIN LATERAL (
    SELECT phone, district
    FROM public.fan_registrations f
    WHERE lower(trim(f.full_name)) IN (
      lower(trim(COALESCE(NULLIF(p.display_name, ''), split_part(u.email::text, '@', 1)))),
      lower(trim(split_part(u.email::text, '@', 1)))
    )
    ORDER BY f.created_at DESC
    LIMIT 1
  ) fr ON true
  ORDER BY u.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_fan(_full_name text, _phone text, _favorite_club_id uuid, _district text, _avatar_url text DEFAULT NULL::text)
RETURNS TABLE(registration_id uuid, profile_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _club_name text;
  _registration_id uuid;
  _profile_id uuid;
  _old_display_name text;
  _username text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  _full_name := TRIM(COALESCE(_full_name, ''));
  _phone := TRIM(COALESCE(_phone, ''));
  _district := TRIM(COALESCE(_district, ''));
  _avatar_url := NULLIF(TRIM(COALESCE(_avatar_url, '')), '');

  IF length(_full_name) < 1 OR length(_full_name) > 100 THEN
    RAISE EXCEPTION 'Invalid full name';
  END IF;

  IF length(_phone) < 6 OR length(_phone) > 20 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;

  IF length(_district) < 1 OR length(_district) > 100 THEN
    RAISE EXCEPTION 'Invalid district';
  END IF;

  SELECT name INTO _club_name
  FROM public.clubs
  WHERE id = _favorite_club_id;

  IF _club_name IS NULL THEN
    RAISE EXCEPTION 'Invalid favorite club';
  END IF;

  SELECT p.display_name, split_part(u.email::text, '@', 1)
  INTO _old_display_name, _username
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = _user_id;

  SELECT id INTO _registration_id
  FROM public.fan_registrations
  WHERE lower(trim(full_name)) IN (
    lower(trim(COALESCE(_old_display_name, ''))),
    lower(trim(COALESCE(_username, '')))
  )
  ORDER BY created_at DESC
  LIMIT 1;

  IF _registration_id IS NULL THEN
    INSERT INTO public.fan_registrations (
      full_name,
      phone,
      favorite_club_id,
      favorite_club_name,
      district
    ) VALUES (
      _full_name,
      _phone,
      _favorite_club_id,
      _club_name,
      _district
    )
    RETURNING id INTO _registration_id;
  ELSE
    UPDATE public.fan_registrations
    SET full_name = _full_name,
        phone = _phone,
        favorite_club_id = _favorite_club_id,
        favorite_club_name = _club_name,
        district = _district
    WHERE id = _registration_id;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    display_name,
    avatar_url,
    favorite_club_id,
    role
  ) VALUES (
    _user_id,
    _full_name,
    _avatar_url,
    _favorite_club_id,
    'fan'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    favorite_club_id = EXCLUDED.favorite_club_id,
    role = 'fan',
    updated_at = now()
  RETURNING id INTO _profile_id;

  RETURN QUERY SELECT _registration_id, _profile_id;
END;
$$;

DO $$
DECLARE
  _user record;
BEGIN
  FOR _user IN SELECT id FROM auth.users LOOP
    PERFORM public.sync_auth_user_membership(_user.id);
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_auth_user_membership(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_current_user_membership() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.bootstrap_admin_if_empty() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_sync_missing_fans() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_fans() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.register_fan(text, text, uuid, text, text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.sync_current_user_membership() TO authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_admin_if_empty() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_sync_missing_fans() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_fans() TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_fan(text, text, uuid, text, text) TO authenticated;