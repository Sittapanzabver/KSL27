CREATE TABLE IF NOT EXISTS public.top_scorers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  club_code TEXT NOT NULL,
  goals INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('senior','u16')),
  season INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_top_scorers_cat_season ON public.top_scorers(category, season, goals DESC);

ALTER TABLE public.top_scorers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read top_scorers"
ON public.top_scorers FOR SELECT
USING (true);

CREATE POLICY "Admins manage top_scorers"
ON public.top_scorers FOR ALL
TO authenticated
USING (has_role(auth.uid(),'admin'))
WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_top_scorers_updated
BEFORE UPDATE ON public.top_scorers
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();