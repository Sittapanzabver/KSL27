-- Clubs
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  slug text unique not null,
  logo_url text,
  founded_year int,
  home_venue text,
  description text,
  primary_color text default '#E10600',
  created_at timestamptz not null default now()
);

-- Players
create table public.players (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  name text not null,
  position text,
  jersey_number int,
  photo_url text,
  nationality text default 'TH',
  date_of_birth date,
  goals int not null default 0,
  assists int not null default 0,
  appearances int not null default 0,
  created_at timestamptz not null default now()
);

-- Matches
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  matchweek int not null,
  home_club_id uuid references public.clubs(id) on delete cascade not null,
  away_club_id uuid references public.clubs(id) on delete cascade not null,
  kickoff_at timestamptz not null,
  venue text,
  home_score int,
  away_score int,
  status text not null default 'scheduled', -- scheduled | live | finished
  mvp_player_id uuid references public.players(id) on delete set null,
  highlights_url text,
  created_at timestamptz not null default now()
);

-- Standings
create table public.standings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade unique not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  points int not null default 0,
  updated_at timestamptz not null default now()
);

-- News
create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  category text default 'general', -- general | match-report | interview | transfer | gallery
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Sponsors
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  tier text not null default 'partner', -- title | platinum | gold | partner
  website text,
  description text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.clubs enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.standings enable row level security;
alter table public.news enable row level security;
alter table public.sponsors enable row level security;

-- Public read policies (league site is public)
create policy "Public read clubs" on public.clubs for select using (true);
create policy "Public read players" on public.players for select using (true);
create policy "Public read matches" on public.matches for select using (true);
create policy "Public read standings" on public.standings for select using (true);
create policy "Public read news" on public.news for select using (true);
create policy "Public read sponsors" on public.sponsors for select using (true);

-- Indexes
create index idx_players_club on public.players(club_id);
create index idx_matches_kickoff on public.matches(kickoff_at);
create index idx_matches_status on public.matches(status);
create index idx_news_published on public.news(published_at desc);
create index idx_standings_points on public.standings(points desc);