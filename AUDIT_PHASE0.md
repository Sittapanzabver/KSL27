# KSL FOOTBALL PLATFORM — PHASE 0 AUDIT

> **Purpose:** Audit โค้ด Supabase/Storage/Data/ภาพ ตาม Master Brief §33 ข้อ 9–12 + §5.2 (image problem) — ก่อนพัฒนา Phase 1 (ห้ามเขียนโค้ดก่อน audit ครบ + approval)
> **Owner:** Sp1cyP (Platform Owner) · **Date:** 22/08/2026 · **Status:** 🔍 AUDIT DONE (ระดับ repo) — ⚡ **อัปเดต (22/08): R1 ปลดล็อกแล้ว** — project `hjljnwpfjbvrlvjpjhfv` ถูก un-pause → รูปกลับมาแสดง 200 แล้ว (เดิม DNS Non-existent) · เหลือยืนยัน R2/C3 (กำหนด source เดียว) + ย้ายเป็นทางการ
> **อ่านคู่กับ:** `SKILL.md` (SSOT ระดับโปรเจกต์) · `CONTEXT.md` · `KSL_HUB_MIGRATION_PLAN.md` · `DEPLOYMENT_DIRECTIVE.md` (R-03)
> **หลักยึด:** ห้ามรื้อ/สร้างใหม่ทันที (Master Brief §5) · ห้ามทำลายข้อมูลเดิม · ห้าม destructive migration ก่อน backup + approval (§30)

---

## 1. ARCHITECTURE MAP (จาก repo — OBSERVED)

| ชั้น | เทคโนโลยี | ที่อยู่ |
|---|---|---|
| Framework | TanStack Start v1 (SSR) + React 19 + Vite 7 | `package.json` · `vite.config.ts` |
| Routing | TanStack Router **file-based** | `src/routes/` (17 ไฟล์) · `src/router.tsx` · `src/routeTree.gen.ts` (generated — ห้ามมือแก้) |
| Styling | Tailwind v4 + shadcn/ui `new-york` | `src/styles.css` · `src/components/ui/` (~40) |
| Shell | `__root.tsx` (I18nProvider/Header/NewsTicker/Outlet/Footer/Toaster/404) | `src/routes/__root.tsx` |
| Backend/Data | **Supabase ×2** (ขัดแย้ง — ดู §2) | `src/integrations/supabase/` |
| Auth | Lovable cloud auth + `has_role()` | `auth-middleware.ts` · `auth-attacher.ts` · migrations `user_roles`/`profiles` |
| Media | Storage bucket `media` (public) + R2 + `src/assets/` | migrations · `public/` |

**Routes (17):** index · standings · matches · matches.$matchId · matches.index · top-scorers · players · squads · clubs · clubs.$slug · news · news.$slug · season.$year · hall-of-memory · sponsors · admin · (U-16 อยู่ที่ standings)

**Lib/helpers (11):** queries · archiveQueries · calculateStandings · clubCodes (ทำ plan ไว้แต่โค้ดยัง duplicate) · divisions · i18n · seasonArchive · sheetScorers · site · syncNews · utils

---

## 2. ⚠️ CRITICAL FINDING — SUPABASE PROJECT หลักตายแล้ว (image root cause §5.2)

**นี่คือข้อค้นพบที่สำคัญที่สุดของ audit ทั้งหมด:**

| Project | Ref ID | กฎ/บทบาท (SKILL.md §3) | สถานะจริง (ตรวจ 22/08) |
|---|---|---|---|
| **Own Supabase** | **`hjljnwpfjbvrlvjpjhfv`** | Storage โลโก้/รูปข่าวตอนนี้ · เป้าหมายย้าย main DB ในอนาคต | 🟢 **กลับมาแล้ว (un-pause)** — เดิม DNS Non-existent → ตอนนี้ resolve + รูปทั้งหมด HTTP 200 (hero/u16hero/club logos คืนแล้ว) · `config.toml` ชี้ project นี้ |
| Lovable Cloud | `qzksqhlrkpqnbavjpieq` | Main production DB (live site ใช้) | 🟢 **ทำงาน** (HTTP 200 — ksl-logo โหลด) |

**ผลกระทบทันที:**
- **รูปที่ผูกกับ `hjljnwpfjbvrlvjpjhfv.supabase.co/storage/v1/object/public/...` = หายทั้งหมด** — hero (`688558213_...jpg`), `u-16hero.jpg`, club logos (`Mayor Ka Care.png`), news covers ที่เก็บใน bucket นี้ — **ไม่แสดง** (มีหลักฐาน: ทุก URL เหล่านี้ HTTP 000)
- `supabase/config.toml` ชี้ `project_id = "hjljnwpfjbvrlvjpjhfv"` (project ที่ตาย) — เป็นอีกหลักฐานยืนยันว่าโค้ดตั้งใจใช้ project นี้
- **`.env` / build** ใช้ SUPABASE_URL ที่ชี้... (ต้องยืนยันจาก dashboard — ดู §6)

### สาเหตุที่เป็นไปได้ (ต้องยืนยันจาก dashboard — §6)
1. Project นี้ถูก **ลบ** ไปแล้ว หรือ
2. Project ถูก **pause** (Supabase ฟรี pausing) และไม่ถูกเปิดอีก หรือ
3. **โดเมน/URL เปลี่ยน** — แต่ ref ID บอกว่าเป็นค่าเดิมที่ตั้งใจ

### สิ่งที่**ต้องไม่ทำ**ตอนนี้ (§30)
- ❌ ห้ามสุ่มเปลี่ยน image URL ไปที่อื่น
- ❌ ห้ามสร้าง storage bucket ใหม่แล้วคัดลอกรูปโดยยังไม่ยืนยัน/backup
- ❌ ห้าม migration ลบ/แก้ column ที่อ้าง URL เดิม

---

## 3. DATA MODEL MAP (จาก types.ts + migrations — จริง)

### 3.1 Entities ที่มีอยู่ (16 ~ 20 tables)
`seasons` · `divisions` · `clubs` · `players` · `matches` · `match_events` · `match_photos` · `standings` · `top_scorers` · `news` · `sponsors` · `club_history` (Hall of Memory) · `club_seasons` · `ksl_season_stats` (RLS issue) · `profiles` (auth) · `user_roles` (auth) + bucket `media` (storage)

### 3.2 ตารางหลัก — คีย์สำคัญ (จริง)
- **Seasons:** 2026 active `423c1997-...` · 2025 `c7a564ea-...` · 2024 `bbdce67d-...`
- **Divisions:** Super League t1 `bd770ed0-...` · U-16 t2 `11111111-2026-4016-8000-000000000016`
- **Clubs (8):** SUTD/NDFC/PMFC/PUTD/KBFC/SNFC/UNKR/KSFC (UUID รายตัวใน SKILL.md §6)

### 3.3 ความสัมพันธ์ (relational)
- `seasons` 1→N `divisions` → N `clubs` (division_id)
- `seasons`/`divisions` → N `matches` (FK) → N `match_events` (FK match/club/player)
- `clubs` 1→N `players` (club_id) → 1→N `match_events`
- `standings` (season+division+club) — **generated/derived (ห้าม UPDATE ตรง — ใช้ `recalc_standings()`)**
- `top_scorers` — **keyed by `club_code` (string) ไม่ใช่ `club_id` (UUID)** — เป็น standalone table ขัดกับ `players.goals`

### 3.4 ⚠️ Data ข้อขัดแย้งหลัก (Known Issues — SKILL.md §10)
1. **Top-scorer 2 แหล่ง:** `fetchTopScorers()` อ่าน `players.goals` กับ `fetchTopScorersTable()` อ่าน `top_scorers` — **ตัวเลขอาจไม่ตรงกัน**
2. **`CODE_TO_SLUG` duplicated** ใน `TopScorers.tsx` + `top-scorers.tsx` (ควร extracted → `clubCodes.ts`)
3. **`players.position` = NULL ทั้ง season 2026** — ต้องใช้ `position_code` (GK/DF/MF/FW) ตั้งแต่ 2027
4. **`players.appearances` ไม่มีข้อมูล** — ต้อง ADD COLUMN + populate จาก match_events (2027)
5. **`ksl_season_stats` มี RLS แต่ไม่มี public-read policy** → browser อ่าน fail; public media-kit ตัวเลข hardcode ใน `/sponsors`
6. **`matches.status`** ใช้ `'completed'` (NOT `'finished'` — แก้แล้ว)
7. **`goal_difference` = generated column** — ห้ามใส่ใน UPDATE SET

---

## 4. SUPABASE INTEGRATION / AUTH / RLS / STORAGE

| เรื่อง | สถานะ (จาก migrations + SKILL.md) |
|---|---|
| **Auth model** | Lovable cloud auth + `profiles`/`user_roles` + `has_role()` helper — ยังไม่มี public auth flow สำหรับ member (Phase 3 ตาม brief) |
| **RLS (tables)** | เปิด RLS หลายตาราง (30 migrations) — ส่วนใหญ่ **public-read** ผ่าน policy; **เขียน** ผ่าน SQL Editor/service-role/admin |
| **RLS (storage)** | Bucket `media` = **public=true** + policy "Media public read" (SELECT) + "Admins upload/update/delete" (authenticated + has_role admin) |
| **Storage buckets** | มี `media` (public) — แต่**รูปที่ฝากจริงบน project `hjljnwpfjbvrlvjpjhfv` ที่ตาย** → รูปใช้งานไม่ได้จริง |
| **Security** | `.env` มี `SUPABASE_PUBLISHABLE_KEY` (anon — เปิดได้ตาม design) · ประกาศไม่พบ service_role ใน repo (อยู่ใน .env/.gitignore) |
| **API/client** | `client.ts` (anon browser) + `client.server.ts` (service role — env) + `MATCH_PUBLIC_COLS` กันเลือก private finance/viewership columns |

---

## 5. RISK LIST (เรียงตามผลกระทบ)

| # | ความเสี่ยง | ระดับ | คำอธิบาย + ต้องทำ |
|---|---|---|---|
| R1 | ~~Supabase project หลักสำหรับรูปตายแล้ว~~ → **ปลดล็อกแล้ว (22/08)** | 🟢 แก้แล้ว | project `hjljnwpfjbvrlvjpjhfv` ถูก un-pause → รูปกลับมา 200 (เดิม DNS Non-existent) · ยังต้องยืนยันย้ายเป็นทางการ (R2) |
| R2 | **2 projects ขัดแย้งใน config** (`config.toml`/`.env` ชี้ hjl... ที่ตาย, live URL ชี้ qzk...) | 🔴 สูง | ต้อง**กำหนด project หลักเดียว** (แนะนำ Lovable Cloud `qzk` จนกว่าจะย้ายเป็นทางการ) — ลด confusion |
| R3 | **Top-scorer ข้อมูล 2 แหล่ง ไม่ตรง** | 🟠 กลาง | เลือก 1 source (แนะนำ `players.goals` + `recalc_player_stats()`) → สร้าง view แทน standalone `top_scorers` |
| R4 | **Domain/URL กระจัดกระจาย** (koratsuperleague.lovable.app public · vercel 404 · preview) | 🟠 กลาง | กำหนด canonical URL เดียวตรง DEPLOYMENT_DIRECTIVE R-03 |
| R5 | **`ksl_season_stats` RLS ไม่ public** | 🟡 ต่ำ | Move public media-kit stats ไป source ที่อ่านได้ (หรือ policy ใหม่) — กัน hardcode หลุด |
| R6 | **Auth/member ยังไม่มี** — Fantasy/Follow (Phase 3+) ต้อง auth ก่อน | 🟡 ต่ำ | Phase 3 ต้องออกแบบ auth ก่อน implementation |
| R7 | **`position_code`/`appearances` ไม่มี (2026 = NULL)** | 🟡 ต่ำ | 2027 ต้อง ADD + populate; ปรับ UI ตาม (ตอนนี้ซ่อน position tab) |
| R8 | **ดูเหมือน "เว็บไซต์ลีก" ไม่ใช่ "Platform"** (hardcode 8 clubs/season 2026) | 🟠 กลาง | ต้อง entity-based + multi-league ตาม Master Brief §27 — ไม่ hardcode KSL/8 clubs/2026 |

---

## 6. สิ่งที่ต้องยืนยันจาก DASHBOARD / CREDENTIAL (ผมทำไม่ได้ — ต้องได้สิทธิ์)

| # | ต้องตรวจ | ทำไม |
|---|---|---|
| C1 | Supabase dashboard → ยืนยัน **`hjljnwpfjbvrlvjpjhfv` ยังมีอยู่จริงไหม** (ลบ? paused? ย้าย domain?) | ผมตรวจ DNS = Non-existent — ต้อง confirm จาก origin ว่าอยู่ในสถานะไหน |
| C2 | **มี backup ของ bucket `media`** หรือไม่ / กู้ได้ไหม | §5.2 ขั้น 11–12 — backup ก่อนแก้ |
| C3 | ดู `.env` SUPABASE_URL ให้ชัดว่าชี้ project ไหน (ผมไม่เปิด secret) | เพื่อกำหนด source เดียว |
| C4 | ยืนยันว่า live site (`koratsuperleague.lovable.app`) ยังใช้ DB `qzk` ที่ทำงานอยู่ | กันสับสน 2 projects |

---

## 7. EXISTING vs TO-BUILD (แยกแล้ว)

### ✅ มีอยู่แล้ว (ยังใช้ได้ — ห้ามทำลาย)
- หน้าเว็บครบ 17 routes · UI components ครบ (shadcn) · standings/calc · season archive 2024/2025/2026 · news · sponsors · admin (SQL-based) · schema 16+ tables · storage bucket `media` (public RLS)

### ⚠️ มีอยู่แต่พัง/ต้องแก้ (ก่อน Phase 1)
- **รูปผูก project ตาย** (R1) — ต้องย้าย media
- **2 projects ขัดแย้ง** (R2) — ต้องชี้ source เดียว
- **top-scorer 2 แหล่ง** (R3) — ต้อง reconcile

### 🆕 ต้องสร้าง (ตาม Master Brief — เรียง Phase)
- **Phase 1:** Match Engine (Create Match / Match status / ~venue / result/goals/cards/lineups / Match Page `/match/{id}` / Share) ← priority สูงสุด
- **Phase 2:** Team/Player/Venue Entity (multi-league)
- **Phase 3:** Follow/Personalization (auth + feed + notification)
- **Phase 4:** Data→Content (auto match report/social card)
- **Phase 5:** Fantasy (หลัง data แข็งแรง)
- **Phase 6:** Monetization (sponsor/premium/team-pro/tournament-SaaS/venue/B2B)

---

## 8. MIGRATION PLAN (กว้าง — ต้อง approval ก่อน run)

> ⚠️ ตาม R-03 (DEPLOYMENT_DIRECTIVE) + Master Brief §5/§30 — **ย้าย/ทำ destructive ต้องผ่าน checklist + backup + approval จาก Platform Owner**

1. **ยืนยัน/กู้ project หลัก** (ถ้า `hjljnwpfjbvrlvjpjhfv` มีอยู่ → un-pause; ถ้าลบไป → ต้องมี backup; ถ้าไม่มี → ตั้ง project ใหม่) — ต้อง C1/C2 ก่อน
2. **ย้าย media** จาก project เดิม → project ที่กำหนด + อัปเดต `logo_url`/`cover_url`/`match_photos.url` ใน DB (ไม่ทำลาย)
3. **กำหนด single source** — ชี้ `.env`/`config.toml`/client ไป project เดียว (แนะนำ qzk จนกว่าย้าย)
4. **reconcile top-scorer** → view แทน `top_scorers`
5. **Season 2027 prep** — `ADD COLUMN position_code`, `appearances` + populate
6. **แล้วค่อย Phase 1** — Match Engine

> 🔴 **ห้าม run migration ใด ๆ จนกว่า C1–C4 + backup เสร็จ + Platform Owner อนุมัติ**
