
ALTER TABLE public.fan_registrations
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS province text,
  ADD COLUMN IF NOT EXISTS sub_district text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS favorite_player text,
  ADD COLUMN IF NOT EXISTS watch_frequency text,
  ADD COLUMN IF NOT EXISTS buys_tickets boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS buys_merch boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS line_id text,
  ADD COLUMN IF NOT EXISTS facebook text,
  ADD COLUMN IF NOT EXISTS pdpa_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pdpa_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent_at timestamptz;

-- Update insert RLS policy to require PDPA consent
DROP POLICY IF EXISTS "Anyone can register as fan" ON public.fan_registrations;
CREATE POLICY "Anyone can register as fan"
ON public.fan_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(full_name)) BETWEEN 1 AND 100
  AND length(trim(phone)) BETWEEN 6 AND 20
  AND length(trim(district)) BETWEEN 1 AND 100
  AND (pdpa_consent = true OR phone = 'pending')
);
