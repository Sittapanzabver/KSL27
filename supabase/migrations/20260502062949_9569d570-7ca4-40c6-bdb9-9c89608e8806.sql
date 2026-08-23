ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_news_touch ON public.news;
CREATE TRIGGER trg_news_touch
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();