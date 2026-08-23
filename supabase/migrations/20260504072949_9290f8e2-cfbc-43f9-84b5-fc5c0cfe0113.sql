
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS live_viewers_u16 integer,
  ADD COLUMN IF NOT EXISTS live_viewers_main integer,
  ADD COLUMN IF NOT EXISTS live_viewers_total integer,
  ADD COLUMN IF NOT EXISTS tickets_sold integer,
  ADD COLUMN IF NOT EXISTS ticket_revenue numeric,
  ADD COLUMN IF NOT EXISTS season_tickets_sold integer,
  ADD COLUMN IF NOT EXISTS season_tickets_revenue numeric,
  ADD COLUMN IF NOT EXISTS merch_revenue numeric,
  ADD COLUMN IF NOT EXISTS sponsor_revenue numeric,
  ADD COLUMN IF NOT EXISTS total_revenue numeric,
  ADD COLUMN IF NOT EXISTS notes text;
