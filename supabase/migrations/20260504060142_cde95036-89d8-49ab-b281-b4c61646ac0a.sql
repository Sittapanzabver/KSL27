
-- 1. Club status enum + column
DO $$ BEGIN
  CREATE TYPE public.club_status AS ENUM ('active','inactive','dissolved','rebranding');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS status public.club_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS dissolved_year integer;

-- 2. Season participation table - preserves season-specific identity
CREATE TABLE IF NOT EXISTS public.club_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL,
  club_id uuid,
  season_name text NOT NULL,
  season_short_name text NOT NULL,
  season_logo_url text,
  season_primary_color text DEFAULT '#E10600',
  season_status text DEFAULT 'participating',
  season_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (season_id, club_id, season_short_name)
);

CREATE INDEX IF NOT EXISTS idx_club_seasons_season ON public.club_seasons(season_id);
CREATE INDEX IF NOT EXISTS idx_club_seasons_club ON public.club_seasons(club_id);

ALTER TABLE public.club_seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_seasons" ON public.club_seasons FOR SELECT USING (true);
CREATE POLICY "Admins manage club_seasons" ON public.club_seasons FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_club_seasons_touch BEFORE UPDATE ON public.club_seasons
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Club history / Hall of Memory
CREATE TABLE IF NOT EXISTS public.club_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid,
  display_name text NOT NULL,
  short_name text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#E10600',
  founded_year integer,
  dissolved_year integer,
  years_active text,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  farewell_message text,
  history_text text,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status public.club_status NOT NULL DEFAULT 'inactive',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.club_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_history" ON public.club_history FOR SELECT USING (true);
CREATE POLICY "Admins manage club_history" ON public.club_history FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_club_history_touch BEFORE UPDATE ON public.club_history
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. Seed past seasons
INSERT INTO public.seasons (year, name, is_active)
SELECT 2025, '2025 Super League', false
WHERE NOT EXISTS (SELECT 1 FROM public.seasons WHERE year=2025);

INSERT INTO public.seasons (year, name, is_active)
SELECT 2024, '2024 Super League', false
WHERE NOT EXISTS (SELECT 1 FROM public.seasons WHERE year=2024);
