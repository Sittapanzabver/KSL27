CREATE OR REPLACE FUNCTION public.admin_list_fans()
RETURNS TABLE (
  user_id uuid,
  email text,
  display_name text,
  avatar_url text,
  role text,
  signup_at timestamptz,
  favorite_club_id uuid,
  favorite_club_name text,
  phone text,
  district text,
  registered boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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
    (p.role = 'fan' AND p.favorite_club_id IS NOT NULL) AS registered
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.clubs c ON c.id = p.favorite_club_id
  LEFT JOIN LATERAL (
    SELECT phone, district
    FROM public.fan_registrations f
    WHERE lower(trim(f.full_name)) = lower(trim(COALESCE(p.display_name, '')))
      AND f.favorite_club_id = p.favorite_club_id
    ORDER BY f.created_at DESC
    LIMIT 1
  ) fr ON true
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_fans() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_fans() TO authenticated;