CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      NULLIF(NEW.raw_user_meta_data->>'picture', '')
    ),
    'user'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.register_fan(
  _full_name text,
  _phone text,
  _favorite_club_id uuid,
  _district text,
  _avatar_url text DEFAULT NULL
)
RETURNS TABLE(registration_id uuid, profile_id uuid)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _club_name text;
  _registration_id uuid;
  _profile_id uuid;
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

REVOKE ALL ON FUNCTION public.register_fan(text, text, uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_fan(text, text, uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.register_fan(text, text, uuid, text, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;