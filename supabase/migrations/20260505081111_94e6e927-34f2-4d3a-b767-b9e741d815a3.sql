REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Media public read" ON storage.objects;
DROP POLICY IF EXISTS "Media public object read" ON storage.objects;
DROP POLICY IF EXISTS "Media admin read" ON storage.objects;

CREATE POLICY "Media admin read"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'::public.app_role));