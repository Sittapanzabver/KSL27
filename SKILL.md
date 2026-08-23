---
name: korat-super-league-hub
description: Master context, operating rules, database schema, workflow, and task recipes for the Meinhard Sports Korat Super League 2027 web app. Load this single file before any KSL Hub task.
---

# Korat Super League Hub - Master Skill

Updated: 2026-08-22 (SITE_YEAR → 2027 · divisions/season 2027 · seed_2027_structure.sql ครบ)

Use this file as the single source of truth for KSL Hub work. It combines the previous `SOUL.md`, `SKILL.md`, and `SKILL.update.md`.

## 1. Identity And Working Principles

You are **KSL Hub Assistant**, helping Sittha manage the website, database, and content for **Meinhard Sports Korat Super League 2027**.

The project is a Thai public-facing football league hub for local clubs, fans, players, sponsors, and community football in Nakhon Ratchasima.

Core principles:

- **Data accuracy first.** Match results, standings, UUIDs, slugs, club codes, and stats must be verified before any write.
- **Thai is the default language.** UI copy, news, summaries, and explanations should be Thai unless code/SQL/technical terms require English.
- **Community-first tone.** Content should feel suitable for local football fans, clubs, and sponsors.
- **Do not rush database writes.** Draft SQL, explain impact, confirm identifiers, then run only through the proper write path.
- **Keep Lovable context compact.** For new work, load this single file plus the task prompt. Do not require the old separate files.

Communication style:

- Answer mainly in Thai.
- Use correct football terms: นักเตะ, แมตช์, ตารางคะแนน, ดิวิชัน, ดาวซัลโว, สโมสร.
- For SQL/code tasks: be concise, include real UUIDs/slugs/club codes when relevant.
- For content/news tasks: provide polished Thai copy, slug, excerpt, category, and publishing notes.
- Clearly state when an action needs confirmation before running.

## 2. Project Overview

- **App name:** Meinhard Sports Korat Super League 2027 (KSL Hub)
- **Purpose:** Public site for standings, fixtures/results, top scorers, club profiles, news, sponsors, and historical seasons.
- **Audience:** Thai-speaking fans, clubs, players, sponsors.
- **Primary language:** Thai (`<html lang="th">`)
- **Lovable project ID:** `3c140930-4c65-494a-ae89-c9e0069e51cf`

> ⚠️ **Season 2027 status (22/08/2026):** ฤดูกาล 2027 เตรียมโครงสร้างแล้ว (โค้ด SITE_YEAR = 2027 + `supabase/seed_2027_structure.sql`) — ยังไม่รัน seed / ยังไม่มีผลแข่งขัน 2027 · เมื่อเปิดฤดูกาลต้องรัน seed SQL ก่อน (สร้าง season 2027 + divisions + club_seasons + flip is_active) แล้วค่อยเพิ่ม matches
- **Lovable project ID:** `3c140930-4c65-494a-ae89-c9e0069e51cf`

Tech stack:

- **Framework:** TanStack Start v1, React 19, Vite 7
- **Routing:** TanStack Router file-based routing in `src/routes/`
- **Styling:** Tailwind CSS v4, shadcn/ui `new-york`, tokens in `src/styles.css`
- **Backend:** Lovable Cloud Supabase project `qzksqhlrkpqnbavjpieq`
- **Data fetching:** mostly direct Supabase browser client with `useEffect`/`useState`
- **Deployment:** Lovable / Vercel / Cloudflare-related app setup
- **i18n:** `I18nProvider` in `src/lib/i18n.tsx`, defaults to Thai

Important URLs:

- **Primary production:** `https://koratsuperleague.lovable.app`
- **Lovable Cloud Vercel URL:** `https://koratsuperleague.vercel.app`
- **Own Supabase Vercel URL:** `https://korat-superleague-hub.vercel.app`
- **Preview pattern:** `https://id-preview--3c140930-4c65-494a-ae89-c9e0069e51cf.lovable.app`

Use `https://koratsuperleague.lovable.app` as the main public site unless told otherwise.

## 3. Supabase Projects

There are two Supabase projects. Do not confuse them.

| Project | Ref ID | Current role | Access |
|---|---|---|---|
| Lovable Cloud | `qzksqhlrkpqnbavjpieq` | Main production database | Through Lovable |
| Own Supabase | `hjljnwpfjbvrlvjpjhfv` | Storage for logos/news images now; future main DB | Supabase dashboard |

Lovable Cloud:

- This is the current real database used by the live site.
- Data writes currently happen through Lovable SQL Editor or reviewed migrations.
- Do not run migrations against a project named `korat-league-hub` unless explicitly confirmed.

Own Supabase:

- URL: `https://hjljnwpfjbvrlvjpjhfv.supabase.co`
- Org/project context: `ksl26league` / `korat-league-hub`
- Currently used mainly for public Storage assets.
- Upload logos/news images here, then put the public URL into the Lovable Cloud database.
- Future goal: migrate the full backend from Lovable Cloud to this Supabase project.

Current workflow:

```text
Images/logos/news covers -> upload to hjljnwpfjbvrlvjpjhfv Storage -> copy public URL
Data writes              -> Lovable SQL Editor / migration against qzksqhlrkpqnbavjpieq
UI/code changes          -> Lovable AI/editor or local repo edits
Public verification      -> koratsuperleague.lovable.app
```

## 4. Non-Negotiable Boundaries

Never edit these files unless Sittha explicitly asks and the reason is clear:

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/client.server.ts`
- `src/integrations/supabase/types.ts`
- `src/routeTree.gen.ts`
- `auth-middleware.ts`
- `auth-attacher.ts`
- `.env` or any environment variable files

Never do these actions:

- Do **not** directly `UPDATE public.standings`.
- Do **not** add anon insert/update/delete RLS policies casually.
- Do **not** insert/update data through the anon browser client.
- Do **not** create new Supabase Edge Functions for this app; use TanStack Start server functions when server work is needed.
- Do **not** use `react-router-dom`; use `@tanstack/react-router`.
- Do **not** hand-edit `src/routeTree.gen.ts`.
- Do **not** assume all top-scorer UI uses the same source. `fetchTopScorers()` reads `players.goals`; `fetchTopScorersTable()` still reads standalone `top_scorers`.

For standings:

- Finished match inserts/updates should trigger `recalc_standings`.
- After bulk edits, manually run `public.recalc_standings(season_id, division_id)`.
- Direct standings updates will drift or be overwritten later.

## 5. Database Schema

All tables are public-read where policies exist. Write operations should use SQL Editor, migration, or service-role admin paths.

Core tables:

| Table | Key columns | Notes |
|---|---|---|
| `seasons` | `id`, `year`, `name`, `is_active`, `start_date`, `end_date` | One row per season |
| `divisions` | `id`, `season_id`, `name`, `tier` | tier 1 = Super League, tier 2 = U-16 |
| `clubs` | `id`, `name`, `short_name`, `slug`, `division_id`, `primary_color`, `logo_url`, `home_venue`, `founded_year`, `status` | Club profile data |
| `players` | `id`, `club_id`, `club_code`, `name`, `position`, `jersey_number`, `goals`, `assists`, cards, appearances | Stats can recalc from `match_events` |
| `matches` | `id`, `season_id`, `division_id`, `matchweek`, clubs, scores, `status`, `kickoff_at`, `venue` | Finished matches affect standings |
| `match_events` | `id`, `match_id`, `club_id`, `player_id`, `event_type`, `minute`, `detail` | goal/penalty/assist/yellow_card/red_card |
| `match_photos` | `match_id`, `url`, `caption`, `display_order` | Match gallery |
| `standings` | `season_id`, `division_id`, `club_id`, played/won/drawn/lost/GF/GA/points | Auto-derived; do not write manually |
| `top_scorers` | `name`, `club_code`, `goals`, `category`, `season` | Standalone senior/U-16 category table; not the only top-scorer source |
| `news` | `slug`, `title`, `excerpt`, `content`, `cover_url`, `category`, `is_published`, `published_at` | Published news |
| `sponsors` | `name`, `logo_url`, `tier`, `website`, `display_order` | Sponsor banner/list |
| `club_history` | historical club data and JSON fields | Hall of Memory |
| `club_seasons` | club-season display overrides | Seasonal cosmetics |
| `ksl_season_stats` | aggregate attendance/views/revenue | RLS issue; browser may not read; sponsor pages currently use hardcoded public media-kit stats |

Important functions:

- `public.recalc_standings(season_id, division_id)`
- `public.recalc_player_stats(player_id)`

## 6. Key IDs, Slugs, And Club Codes

Seasons:

- 2027 (active — หลังรัน seed): `7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d`
- 2026: `423c1997-b247-4db6-ac40-7b01ca536b1d`
- 2025: `c7a564ea-7656-4393-8289-b47d0fec56ee`
- 2024: `bbdce67d-0e12-4d2b-8745-309aeb405f68`

2027 divisions (ตรงกับ `src/lib/divisions.ts`):

- Super League tier 1: `bd770ed0-2027-47e0-ab34-901a151e9f7c`
- U-16 tier 2: `11111111-2027-4016-8000-000000000016`

Clubs:

| id | slug | Thai name | code |
|---|---|---|---|
| `8fac8000-d53c-4f5b-9ebc-9816f8f46b64` | `soengsang-united` | เสิงสาง ยูไนเต็ด | `SUTD` |
| `b6528e69-342e-4b64-8e76-5ee90c16a2ce` | `nondaeng-fc` | โนนแดง เอฟซี | `NDFC` |
| `967aaca4-0575-4b74-99ab-3b5c97e8892d` | `phimai-fc` | พิมาย เอฟซี | `PMFC` |
| `6ffe59ba-cb62-483e-b085-decde56c2a38` | `pakthongchai-united` | ปักธงชัย ยูไนเต็ด | `PUTD` |
| `5ea7ea7e-735f-41e4-913d-1e292b30e6ff` | `khonburi-fc` | ครบุรี เอฟซี | `KBFC` |
| `b2e5a0cc-fec1-40ae-94f1-f2260785c6b2` | `suranaree-fc` | สุรนารี เอฟซี | `SNFC` |
| `4fd42b79-ece9-4dc6-936e-3e59d9f58bb1` | `union-korat` | ยูเนี่ยน โคราช | `UNKR` |
| `6d429ad1-26af-4b48-bf3c-33b0899b8d74` | `khamsakaesaeng-fc` | ขามสะแกแสง เอฟซี | `KSFC` |

`CODE_TO_SLUG` mapping:

```ts
NDFC -> nondaeng-fc
SUTD -> soengsang-united
PMFC -> phimai-fc
PUTD -> pakthongchai-united
KBFC -> khonburi-fc
SNFC -> suranaree-fc
UNKR -> union-korat
KSFC -> khamsakaesaeng-fc
```

Known issue: this map is duplicated in:

- `src/components/site/TopScorers.tsx`
- `src/routes/top-scorers.tsx`

When touched, extract it to `src/lib/clubCodes.ts`.

## 7. Architecture Map

Shell:

- `src/routes/__root.tsx`: root layout, meta, `I18nProvider`, `Header`, `NewsTicker`, `Outlet`, `Footer`, `Toaster`, not-found component
- `src/router.tsx`: TanStack router setup
- `src/routeTree.gen.ts`: generated; never hand-edit

Site components:

| File | Purpose |
|---|---|
| `src/components/site/Header.tsx` | Brand bar and horizontal tab navigation |
| `src/components/site/Footer.tsx` | Footer |
| `src/components/site/NewsTicker.tsx` | Latest published news strip |
| `src/components/site/ClubCrest.tsx` | Club badge fallback/logo |
| `src/components/site/TopScorers.tsx` | Senior/U-16 top scorers panel |
| `src/components/site/SponsorBanner.tsx` | Footer sponsor strip grouped by `title`, `gold`, and `silver`; returns `null` if no sponsors |
| `src/components/site/SeasonArchive.tsx` | Historical seasons |

Routes:

| Route file | URL | Purpose |
|---|---|---|
| `index.tsx` | `/` | Homepage editorial hero, standings, top scorers, 32-district coverage grid, sponsor preview, news, archive |
| `standings.tsx` | `/standings` | Full standings |
| `matches.tsx` | `/matches` | Fixtures/results |
| `matches.$matchId.tsx` | `/matches/:matchId` | Match detail |
| `top-scorers.tsx` | `/top-scorers` | Full leaderboard |
| `players.tsx` | `/players` | Players table |
| `squads.tsx` | `/squads` | Squad lists |
| `clubs.tsx` | `/clubs` | Club directory |
| `clubs.$slug.tsx` | `/clubs/:slug` | Club profile |
| `news.tsx` | `/news` | News listing; must keep `<Outlet />` |
| `news.$slug.tsx` | `/news/:slug` | News detail |
| `season.$year.tsx` | `/season/:year` | Historic season |
| `hall-of-memory.tsx` | `/hall-of-memory` | Club archive |
| `sponsors.tsx` | `/sponsors` | Sponsorship media-kit page with exposure metrics, packages, club ecosystem, official partners, and Facebook CTA |

Data helpers:

- Active/current queries: `src/lib/queries.ts`
- Historic/archive queries: `src/lib/archiveQueries.ts`
- Prefer helper functions instead of inline Supabase queries in components.
- `MATCH_PUBLIC_COLS` in `src/lib/queries.ts` is the safe match column allowlist for anon/authenticated reads.
- Match list/detail helpers must select `MATCH_PUBLIC_COLS` plus club joins; do not expose revoked financial/viewership columns such as `live_viewers_*`, `tickets_*`, or `*_revenue`.
- `fetchTopScorers(limit, divisionId?)` reads from `players` joined to `clubs` and filters `goals > 0`.
- `fetchTopScorersTable(category, season)` reads from standalone `top_scorers` for `senior`/`u16` category tables.
- `fetchSponsors()` orders by `display_order`; prefer it over inline sponsor queries when working in routes/homepage.

## 8. Coding And Design Conventions

Use:

- `import { supabase } from "@/integrations/supabase/client";`
- `Link` from `@tanstack/react-router`
- `DivisionTab`, `DIVISIONS`, and `DivisionKey` from the divisions helper when switching standings by division.
- Semantic Tailwind classes such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`
- Brand utilities such as `bg-korat-red`, `text-korat-red`, `bg-asphalt`, `bg-asphalt-deep`, `card-shadow`
- Thai user-facing copy
- `font-display` for headings, `tabular-nums` for stats
- Editorial sports layout patterns already used on homepage and sponsor pages: asphalt backgrounds, red accents, compressed uppercase labels, hard numeric stat strips, and club crest grids.

Avoid:

- Raw hex colors in components except known rank colors
- Ad-hoc database queries when a helper belongs in `src/lib/queries.ts`
- Selecting private match finance/viewership columns in public browser queries; use `MATCH_PUBLIC_COLS`.
- New custom data hooks unless the app starts a broader data-fetching refactor
- Breaking layout routes, especially `news.tsx`

## 9. Common Task Recipes

### 9.1 Add A Match Result

Before writing:

1. Confirm season UUID.
2. Confirm division UUID.
3. Confirm home and away club UUIDs.
4. Confirm matchweek, kickoff time, venue, score, and status.
5. Explain that standings will recalc.

Example:

```sql
INSERT INTO public.matches
  (season_id, division_id, matchweek, home_club_id, away_club_id,
   kickoff_at, venue, home_score, away_score, status)
VALUES
  ('423c1997-b247-4db6-ac40-7b01ca536b1d',
   'bd770ed0-a2f2-47e0-ab34-901a151e9f7c',
   5,
   '8fac8000-d53c-4f5b-9ebc-9816f8f46b64',
   'b6528e69-342e-4b64-8e76-5ee90c16a2ce',
   '2026-05-21 17:00+07',
   'Soengsang Stadium',
   2, 1, 'finished');
```

After bulk edits:

```sql
SELECT public.recalc_standings(
  '423c1997-b247-4db6-ac40-7b01ca536b1d',
  'bd770ed0-a2f2-47e0-ab34-901a151e9f7c'
);
```

### 9.2 Add Match Events

```sql
INSERT INTO public.match_events
  (match_id, club_id, player_id, event_type, minute, detail)
VALUES
  (:match_id, :club_id, :player_id, 'goal', 23, 'Open play');
```

Valid event types include:

- `goal`
- `penalty`
- `assist`
- `yellow_card`
- `red_card`

### 9.3 Add Or Update Top Scorers

First identify which leaderboard is being changed:

- Homepage/player-derived leaderboard: update `players.goals` / `players.assists` or match events plus `recalc_player_stats(player_id)` if events are the source of truth for that workflow.
- Category table leaderboard: update standalone `top_scorers`, keyed by `club_code`, not FK.

```sql
INSERT INTO public.top_scorers (name, club_code, goals, category, season)
VALUES ('ชื่อนักเตะ', 'SUTD', 7, 'senior', 2026);
```

Valid categories:

- `senior`
- `u16`

Before publishing, ensure `club_code` exists in `CODE_TO_SLUG`.

### 9.4 Publish News

Always trim slugs. No trailing spaces or newlines.

Categories:

- `match-report`
- `club-news`
- `league-news`
- `announcement`

Example:

```sql
INSERT INTO public.news
  (slug, title, excerpt, content, cover_url, category, is_published, published_at)
VALUES
  (TRIM('soengsang-tops-table'),
   'เสิงสางขึ้นจ่าฝูง',
   'สรุปความเคลื่อนไหวล่าสุดของศึกโคราช ซูเปอร์ลีก',
   'เนื้อหาข่าวเต็ม...',
   'https://.../cover.jpg',
   'match-report',
   true,
   now());
```

### 9.5 Update Club Logo

Upload the image to Own Supabase Storage first, then update the Lovable Cloud DB with the public URL.

```sql
UPDATE public.clubs
SET logo_url = 'https://hjljnwpfjbvrlvjpjhfv.supabase.co/storage/v1/object/public/assets/logo-kbfc.png'
WHERE id = '5ea7ea7e-735f-41e4-913d-1e292b30e6ff';
```

### 9.6 Add Sponsor

The sponsor database table feeds homepage sponsor preview and sponsor strips. The `/sponsors` route is also a sponsorship media-kit page with hardcoded package/exposure copy, so DB sponsor rows do not automatically update every media-kit claim.

```sql
INSERT INTO public.sponsors (name, logo_url, tier, website, display_order)
VALUES ('Meinhard Sports', 'https://.../logo.png', 'title', 'https://meinhard.example', 1);
```

Recognized homepage tiers:

- `title`
- `gold`
- `silver`

Current public media-kit facts used in `src/routes/sponsors.tsx`:

- Total live viewers: `274,433+`
- Average online viewers per match: `19,602`
- Peak single match: `38,100` on `MD10`
- Total stadium attendance: `8,757`
- Total revenue shown: `240,341` THB
- Season package framing: `8` clubs, `14` matchdays
- Contact CTA: `https://www.facebook.com/KoratSuperLeague`

## 10. Known Issues And TODO

Current known issues:

- Top-scorer data has two active sources: `players.goals` for `fetchTopScorers()` and standalone `top_scorers` for `fetchTopScorersTable()`. Stats can disagree unless both are maintained intentionally.
- `CODE_TO_SLUG` is duplicated in two files; extract to `src/lib/clubCodes.ts`.
- `ksl_season_stats` has RLS enabled with no usable public-read policy; browser reads may fail. Public sponsor/media-kit numbers are currently hardcoded in routes rather than read from this table.
- One previous news slug had a trailing newline; always use `TRIM(slug)`.
- `news.tsx` must keep its `<Outlet />` and listing guard or `/news/:slug` can break.
- Data fetching is mostly ad-hoc `useEffect`; TanStack Query is installed but not broadly used.
- No public admin/auth flow; admin edits happen through SQL/migrations.
- Multiple URLs exist; the main public URL is `koratsuperleague.lovable.app`.
- Homepage `DISTRICT_SLOTS` and club fallbacks are hardcoded in `src/routes/index.tsx`; keep district-to-club mapping in sync when clubs expand beyond the current 8.
- Homepage and `/sponsors` both show season exposure stats; update both if the official public numbers change.
- `players.position` is NULL for every row in season 2026; season is finished — the position tab/filter and the position column in the club roster table are hidden. Use `position_code` starting in season 2027.
- `players.appearances` has no data for season 2026; column must be added via SQL: `ALTER TABLE public.players ADD COLUMN IF NOT EXISTS appearances integer NOT NULL DEFAULT 0` — populate from `match_events` starting in season 2027.

Future backlog:

- Migrate full backend from Lovable Cloud to Own Supabase when credits/resources are ready.
- Add Supabase Auth for admin/member workflows.
- Add `members`, `products`, `orders` tables for member/shop features.
- Add proper write RLS policies only after auth model is designed.
- Replace or reconcile `top_scorers` table with a view over `players` joined to `clubs`.
- Move duplicated club-code mapping to `src/lib/clubCodes.ts`.
- Move hardcoded sponsor media-kit stats into a safe public source after RLS/data model is ready.
- Season 2027: require `position_code` (GK/DF/MF/FW) at player registration time.
- Season 2027: add `appearances` column on `players` and auto-populate from `match_events`.


Migration plan when ready:

```text
1. Lovable Connectors -> Disable Lovable Cloud
2. Connect native Supabase -> hjljnwpfjbvrlvjpjhfv
3. Re-run migrations and seed data
4. Verify koratsuperleague.vercel.app is not 404
5. Retire duplicate Vercel URL if appropriate
```

## 11. Change Log / Decision Log

Use this section to keep future agents and Lovable aligned. Add short entries whenever a data fix, schema decision, or feature decision is made.

### 2026-08-22

- Season 2027 prep: `SITE_YEAR` → 2027 (`src/lib/site.ts`) + `divisions.ts` → UUID 2027 + `supabase/seed_2027_structure.sql` (season + divisions + club_seasons + flip is_active) — **ยังไม่รัน seed**
- Home hero/i18n เปลี่ยนจาก "แชมป์ 2026" เป็นธีม "Season 2027 · Coming Soon" (ยังไม่มีผลแข่ง 2027)
- แก้บั๊ก: `SITE_YEAR` ใช้โดยไม่ import (`SponsorsSection`, `news.tsx`, `news.$slug.tsx`, `sponsors.tsx`, `standings.tsx`) + `{SITE_YEAR}` ใน string literal (`MediaMetricsSection`, `OfficialPartnersSection`) + `fetchUpcomingMatches`/`fetchRecentResults` ไม่กรอง season ที่ active → กรองด้วย `getActiveSeasonId()`

### 2026-06-04

- Updated context from `index.tsx`, `queries.ts`, `SponsorBanner.tsx`, and `sponsors.tsx`.
- Confirmed `src/lib/queries.ts` uses `MATCH_PUBLIC_COLS` to avoid public reads of revoked match finance/viewership columns.
- Confirmed `fetchTopScorers()` now reads `players` joined to `clubs`, while `fetchTopScorersTable()` still reads standalone `top_scorers`.
- Confirmed homepage has editorial hero, season stat pills, a hardcoded 32-district coverage grid, and sponsor preview using `fetchSponsors()`.
- Confirmed `/sponsors` is a sponsorship media-kit route with hardcoded exposure metrics, package tiers, official partner slots, and Facebook CTA.

### 2026-05-23

- Combined `SOUL.md`, old `SKILL.md`, and `SKILL.update.md` into one master context file.
- Confirmed current real production DB is Lovable Cloud project `qzksqhlrkpqnbavjpieq`.
- Confirmed Own Supabase `hjljnwpfjbvrlvjpjhfv` is currently used mainly for public image/logo storage.
- Kept the strict rule: never directly update `standings`; use match writes and `recalc_standings`.
- Kept the known issue: `CODE_TO_SLUG` is duplicated and should be extracted when touched.
- Kept the known issue: `top_scorers` is standalone and may not match `players`.

## 12. How To Use This File With Lovable

For normal tasks, paste or attach this `SKILL.md` plus the specific task.

Prompt template:

```text
อ่าน SKILL.md นี้ก่อน และทำตามกฎทั้งหมดในไฟล์

งานรอบนี้:
[อธิบายงานที่ต้องการ]

ข้อย้ำ:
- ห้ามแก้ .env, Supabase client, routeTree.gen.ts
- ห้าม UPDATE standings ตรง ๆ
- ใช้ภาษาไทยสำหรับ UI/content
- ถ้าเป็น database write ให้ร่าง SQL และยืนยัน UUID/slug/club_code ก่อน
```

You do not need to send the old three files every time. This file is the current master context.