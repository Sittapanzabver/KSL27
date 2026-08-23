
CREATE TABLE public.fan_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  favorite_club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  favorite_club_name TEXT,
  district TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fan_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as fan"
ON public.fan_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) BETWEEN 1 AND 100
  AND length(trim(phone)) BETWEEN 6 AND 20
  AND length(trim(district)) BETWEEN 1 AND 100
);

CREATE POLICY "Admins view fan registrations"
ON public.fan_registrations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage fan registrations"
ON public.fan_registrations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
