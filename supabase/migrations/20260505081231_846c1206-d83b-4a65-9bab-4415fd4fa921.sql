DROP POLICY IF EXISTS "Media public file read" ON storage.objects;
DROP POLICY IF EXISTS "Media public read" ON storage.objects;
DROP POLICY IF EXISTS "Media public object read" ON storage.objects;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;