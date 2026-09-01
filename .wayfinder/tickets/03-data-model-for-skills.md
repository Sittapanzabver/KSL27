# Ticket: Data Model for Skills

**Type:** Research (AFK)
**Status:** ✅ Resolved
**Assignee:** opencode
**Blocking:** 01-skill-landing-page-scope
**Labels:** wayfinder:research

---

## Question

ข้อมูลไหนใน DB ปัจจุบันรองรับ skill展示 ได้แล้วบ้าง และต้องเพิ่มอะไร?

**สิ่งที่มีอยู่แล้ว:**
- `clubs` table: name, short_name, slug, primary_color, logo_url, home_venue, founded_year, description, history, district
- `players` table: name, position, jersey_number, goals, assists, category (senior/u16)
- `matches` table: home/away club, scores, status, matchweek
- `club_history` table: historical data, achievements (JSON)
- `club_seasons` table: seasonal display overrides

**สิ่งที่ต้อง investigate:**
1. `club_history` table มี field อะไรบ้าง? achievements JSON มีรูปแบบอะไร?
2. `players` table มี stats อะไรบ้างนอกจาก goals/assists?
3. มี table ไหนเกี่ยวกับ "skills" หรือ "highlights" อยู่แล้วไหม?
4. RLS policies บน tables เหล่านี้เป็นอย่างไร? browser client อ่านได้ไหม?

## Resolution

Research complete (อ่านจาก `src/integrations/supabase/types.ts` + `supabase/migrations/*` + ข้อมูลจริงใน `migration/qzk_export/club_history.json`):

**1. `club_history` — fields + achievements format:**
- Fields: `id, club_id, display_name, short_name, primary_color, logo_url, founded_year, dissolved_year, years_active (string), achievements (JSON), farewell_message, history_text, photos (JSON), status (club_status enum), display_order, created_at, updated_at`
- `achievements` JSON = **array of Thai strings** (จากข้อมูลจริง: `["เข้าร่วมฤดูกาลแรกของ Korat Super League"]`)
- `photos` JSON = array (ข้อมูลปัจจุบันว่างเปล่า)

**2. `players` — stats นอกเหนือ goals/assists:**
- มีครบ: `appearances, clean_sheets, minutes_played, red_cards, yellow_cards` + `position, position_code, jersey_number, photo_url, nationality, date_of_birth, category, club_code, club_id`

**3. Skills/highlights table:**
- **ไม่มี table เกี่ยวกับ skills/skills/highlights เลย** — มีแค่ column `highlights_url` บน `matches` (ลิงก์วิดีโอไฮไลต์) กับ `club_history.achievements`/`photos`
- มี `ksl_season_stats` (RLS ปิด — service-role เท่านั้น)

**4. RLS — browser (anon) อ่านได้:**
- `club_history`, `club_seasons`, `top_scorers`, `seasons`, `divisions`, `match_events`, `match_photos`: มี policy "Public read ... FOR SELECT USING (true)" → anon อ่านได้ ✅
- `clubs`, `players`, `standings`, `news`, `sponsors`: **ไม่มี RLS** → anon อ่านได้ตาม default ✅
- `matches`: column-level revoke — anon/authenticated อ่านได้เฉพาะ public columns (`MATCH_PUBLIC_COLS`); financial/viewership columns ถูก revoke
- `ksl_season_stats`: RLS เปิด ไม่มี policy → **service-role เท่านั้น** (browser อ่านไม่ได้)
- Storage bucket `media`: public SELECT สำหรับ anon; write = service-role เท่านั้น (browser upload ตรงไม่ได้)

**Decision impact:**
- DB ไม่มีโครงสร้างสำหรับ "skills" → การ hardcode skill data ใน frontend (`clubSkills.ts`) ตาม ticket 01 เป็นทางที่ถูกต้อง (ตรงกับ map Out of scope: ห้ามแก้ DB)
- `club_history.achievements` เป็นแหล่ง "achievement" แบบ DB-backed เพียงแหล่งเดียวที่ public อ่านได้ — ใช้เติมส่วน Achievements ได้แล้ววันนี้
- อนาคตถ้า owner อยากให้ skills อยู่ DB ต้องสร้าง table ใหม่ (เช่น `club_skills`) — อยู่นอก destination นี้
