
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEASONS & DIVISIONS ============
CREATE TABLE public.seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seasons public read" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Admins manage seasons" ON public.seasons FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  name text NOT NULL,
  tier integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Divisions public read" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Admins manage divisions" ON public.divisions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Seed 2026 season
INSERT INTO public.seasons (name, year, is_active, start_date, end_date) VALUES ('2026 Super League', 2026, true, '2026-01-15', '2026-12-15');

INSERT INTO public.divisions (season_id, name, tier)
SELECT id, 'Super League', 1 FROM public.seasons WHERE year = 2026;

-- ============ EXTEND CLUBS ============
ALTER TABLE public.clubs ADD COLUMN division_id uuid REFERENCES public.divisions(id);
UPDATE public.clubs SET division_id = (SELECT id FROM public.divisions WHERE name='Super League' LIMIT 1);

-- ============ EXTEND MATCHES ============
ALTER TABLE public.matches ADD COLUMN season_id uuid REFERENCES public.seasons(id);
ALTER TABLE public.matches ADD COLUMN division_id uuid REFERENCES public.divisions(id);
ALTER TABLE public.matches ADD COLUMN attendance integer;
ALTER TABLE public.matches ADD COLUMN referee text;
ALTER TABLE public.matches ADD COLUMN sponsor_banner_url text;
UPDATE public.matches SET season_id = (SELECT id FROM public.seasons WHERE year=2026 LIMIT 1),
                          division_id = (SELECT id FROM public.divisions WHERE name='Super League' LIMIT 1);

-- ============ EXTEND STANDINGS ============
ALTER TABLE public.standings ADD COLUMN season_id uuid REFERENCES public.seasons(id);
ALTER TABLE public.standings ADD COLUMN division_id uuid REFERENCES public.divisions(id);
ALTER TABLE public.standings ADD COLUMN goal_difference integer GENERATED ALWAYS AS (goals_for - goals_against) STORED;
UPDATE public.standings SET season_id = (SELECT id FROM public.seasons WHERE year=2026 LIMIT 1),
                            division_id = (SELECT id FROM public.divisions WHERE name='Super League' LIMIT 1);

-- ============ EXTEND PLAYERS ============
ALTER TABLE public.players ADD COLUMN yellow_cards integer NOT NULL DEFAULT 0;
ALTER TABLE public.players ADD COLUMN red_cards integer NOT NULL DEFAULT 0;
ALTER TABLE public.players ADD COLUMN clean_sheets integer NOT NULL DEFAULT 0;
ALTER TABLE public.players ADD COLUMN minutes_played integer NOT NULL DEFAULT 0;

-- ============ MATCH EVENTS ============
CREATE TYPE public.event_type AS ENUM ('goal','assist','yellow_card','red_card','substitution','own_goal','penalty');

CREATE TABLE public.match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  club_id uuid REFERENCES public.clubs(id) ON DELETE SET NULL,
  event_type public.event_type NOT NULL,
  minute integer,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match events public read" ON public.match_events FOR SELECT USING (true);
CREATE POLICY "Admins manage match events" ON public.match_events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ MATCH PHOTOS ============
CREATE TABLE public.match_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.match_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Match photos public read" ON public.match_photos FOR SELECT USING (true);
CREATE POLICY "Admins manage match photos" ON public.match_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ ADMIN POLICIES on existing tables ============
CREATE POLICY "Admins manage clubs" ON public.clubs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage matches" ON public.matches FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage players" ON public.players FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage standings" ON public.standings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage sponsors" ON public.sponsors FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ AUTOMATIC STANDINGS RECALC ============
CREATE OR REPLACE FUNCTION public.recalc_standings(_season uuid, _division uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Reset standings for this season/division
  UPDATE public.standings
     SET played=0, won=0, drawn=0, lost=0, goals_for=0, goals_against=0, points=0, updated_at=now()
   WHERE season_id = _season AND division_id = _division;

  -- Ensure every club in that division has a row
  INSERT INTO public.standings (club_id, season_id, division_id)
  SELECT c.id, _season, _division FROM public.clubs c
  WHERE c.division_id = _division
    AND NOT EXISTS (SELECT 1 FROM public.standings s WHERE s.club_id=c.id AND s.season_id=_season AND s.division_id=_division);

  -- Aggregate from finished matches
  WITH agg AS (
    SELECT club_id,
           COUNT(*) AS played,
           SUM(CASE WHEN gf>ga THEN 1 ELSE 0 END) AS won,
           SUM(CASE WHEN gf=ga THEN 1 ELSE 0 END) AS drawn,
           SUM(CASE WHEN gf<ga THEN 1 ELSE 0 END) AS lost,
           SUM(gf) AS gf_total,
           SUM(ga) AS ga_total
    FROM (
      SELECT home_club_id AS club_id, home_score AS gf, away_score AS ga
        FROM public.matches
       WHERE status='finished' AND season_id=_season AND division_id=_division
         AND home_score IS NOT NULL AND away_score IS NOT NULL
      UNION ALL
      SELECT away_club_id, away_score, home_score
        FROM public.matches
       WHERE status='finished' AND season_id=_season AND division_id=_division
         AND home_score IS NOT NULL AND away_score IS NOT NULL
    ) t
    GROUP BY club_id
  )
  UPDATE public.standings s SET
    played = a.played,
    won = a.won,
    drawn = a.drawn,
    lost = a.lost,
    goals_for = a.gf_total,
    goals_against = a.ga_total,
    points = a.won*3 + a.drawn,
    updated_at = now()
  FROM agg a
  WHERE s.club_id=a.club_id AND s.season_id=_season AND s.division_id=_division;
END; $$;

CREATE OR REPLACE FUNCTION public.trg_match_recalc()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _s uuid; _d uuid;
BEGIN
  _s := COALESCE(NEW.season_id, OLD.season_id);
  _d := COALESCE(NEW.division_id, OLD.division_id);
  IF _s IS NOT NULL AND _d IS NOT NULL THEN
    PERFORM public.recalc_standings(_s, _d);
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER matches_recalc_standings
AFTER INSERT OR UPDATE OR DELETE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.trg_match_recalc();

-- ============ AUTO PLAYER STAT UPDATES ============
CREATE OR REPLACE FUNCTION public.recalc_player_stats(_player uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _player IS NULL THEN RETURN; END IF;
  UPDATE public.players p SET
    goals = COALESCE((SELECT COUNT(*) FROM public.match_events WHERE player_id=_player AND event_type IN ('goal','penalty')),0),
    assists = COALESCE((SELECT COUNT(*) FROM public.match_events WHERE player_id=_player AND event_type='assist'),0),
    yellow_cards = COALESCE((SELECT COUNT(*) FROM public.match_events WHERE player_id=_player AND event_type='yellow_card'),0),
    red_cards = COALESCE((SELECT COUNT(*) FROM public.match_events WHERE player_id=_player AND event_type='red_card'),0)
  WHERE p.id=_player;
END; $$;

CREATE OR REPLACE FUNCTION public.trg_event_recalc()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recalc_player_stats(COALESCE(NEW.player_id, OLD.player_id));
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER match_events_player_stats
AFTER INSERT OR UPDATE OR DELETE ON public.match_events
FOR EACH ROW EXECUTE FUNCTION public.trg_event_recalc();

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media public read" ON storage.objects FOR SELECT USING (bucket_id='media');
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='media' AND public.has_role(auth.uid(),'admin'));

-- Initial standings recalc
DO $$
DECLARE s uuid; d uuid;
BEGIN
  SELECT id INTO s FROM public.seasons WHERE year=2026 LIMIT 1;
  SELECT id INTO d FROM public.divisions WHERE name='Super League' LIMIT 1;
  PERFORM public.recalc_standings(s, d);
END $$;
