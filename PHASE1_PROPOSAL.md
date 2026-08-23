# KSL FOOTBALL PLATFORM — PHASE 1 PROPOSAL: MATCH ENGINE

> **Status:** 🔵 PROPOSAL — ยังไม่ implementation (ตาม Master Brief §26/§33: เสนอแผนก่อน หลัง Audit)
> **Owner:** Sp1cyP (Platform Owner) · **Date:** 22/08/2026
> **อ่านคู่กับ:** `AUDIT_PHASE0.md` (ต้องแก้ R1–R3 ก่อน Phase 1) · `SKILL.md` (SSOT โค้ด) · Master Brief §8–§9 (Create Match / Match Page)
> **หลักยึด:** ห้าม hardcode KSL/8 clubs/2026 (multi-league ready) · data-first · entity-based · share-first · ทุก match ต้องมี URL `/match/{id}` เปิดแชร์ได้

---

## 0. ก่อนเริ่ม Phase 1 (Gate — ต้องผ่านก่อน)

> ⚠️ รายการจาก Audit ที่**บล็อก Phase 1** — ตาม Master Brief §33 ข้อ 16–17 (เริ่มจาก Phase 0 ก่อน)

| Gate | รายการ | สถานะ |
|---|---|---|
| G1 | ยืนยัน project หลัก + ย้าย media (R1/R2) — รูปที่หายต้องกู้/ย้ายก่อน | ⏳ ต้อง C1–C4 + backup |
| G2 | กำหนด single source (`.env`/client ชี้ project เดียว) | ⏳ รอ G1 |
| G3 | reconcile top-scorer source (R3) | ⏳ รอ (ไม่บล็อก Phase 1 match però แนะนำทำก่อนสร้าง match ที่อ้าง player stats) |
| G4 | Platform Owner อนุมัติ Phase 1 scope | ⏳ รอ |

> ถ้า G1/G2 ยังไม่สำเร็จ → Phase 1 ควรทำเฉพาะ **create match + match page (อ่านอย่างเดียว)** โดยยังไม่แตะ player stats/recalc ที่อ้างข้อมูลไม่ตรง

---

## 1. เป้าหมาย Phase 1 (ขอบเขต — ทำอะไร)

**เป้าเดียวตาม Master Brief §6/§8/§9:** ทุกคน (ผู้จัด/ทีม) **สร้าง Match ได้เอง** → ได้ **Match URL เฉพาะ** `/match/{id}` → **แชร์ได้ทันที** → Match Page แสดงข้อมูลครบ

**ขอบเขต Inside (Phase 1):**
- Create Match (Team A / Team B / date / time / venue / competition / match type / organizer / status)
- Match URL เฉพาะ + Share (social card เบื้องต้น)
- Match Page (view): teams · date/time · venue · score · status · goals/cards/substitutions (จาก match_events) · MVP · result · share
- Match status pipeline (`scheduled` → `live` → `completed`)

**นอกขอบเขต (เลื่อนไป Phase อื่น):**
- Lineup ระบบจริง (roster management) → Phase 2 (team/player entity แข็งแรงก่อน)
- Statistics deep (possession/xG) → Phase 4
- Follow/Notification → Phase 3
- Fantasy → Phase 5
- Venue entity (เลือก venue จาก DB) → Phase 2 (Phase 1 ใช้ `venue` string/`stadium_*` จาก clubs)
- monetization → Phase 6

---

## 2. สถาปัตยกรรม (entity-based — ไม่ hardcode KSL)

### 2.1 หลักการ
- `matches` + `match_events` + `clubs` + `seasons` + `divisions` **มีอยู่แล้ว** — **ไม่สร้างตารางใหม่** ถ้าใช้ของเดิมได้ (ต่อยอด ไม่รื้อ)
- ทุก Match ผูกกับ `season_id` + `division_id` + `home_club_id` + `away_club_id` → **multi-league ready** (ต่าง league = ต่าง season/division row)
- ห้าม hardcode: "KSL", "8 clubs", "2026", "Super League" ในโค้ด (อ่านจาก DB เสมอ)

### 2.2 Schema ที่ใช้ (ยืนยันของเดิม — ไม่ migration ใหญ่)
```
matches: id, season_id, division_id, matchweek, home_club_id, away_club_id,
         kickoff_at, venue, home_score, away_score, status, mvp_player_id,
         referee, highlights_url, notes, created_at
match_events: id, match_id, club_id, player_id, event_type, minute, detail
```

**ต้องเพิ่ม (migration เบา — รอ G4 approve):**
- `matches.match_type` (league/friendly/tournament/school/… — ตาม §7) — default 'league'
- `matches.organizer` (optional string) — ตาม §8
- `matches.competition_id` (ตั้งต้น: ใช้ season/division แทนได้ แต่เผื่อ league ต่าง)

> 🔴 Migration เหล่านี้เป็น **additive (เพิ่ม column default null)** — ไม่ทำลายข้อมูลเดิม · ต้อง backup + approval ก่อน (R-03)

### 2.3 Route (file-based — TanStack Router)
```
src/routes/match.create.tsx      # หน้า Create Match (admin/operator)
src/routes/match.$matchId.tsx    # Match Page (public view + share)
```
> ⚠️ สังเกต: ปัจจุบันมี `matches.$matchId.tsx` (URL `/matches/:matchId`) — Master Brief ระบุ `/match/{id}` — ต้อง**ตัดสินใจ**: ใช้ `/matches/{id}` เดิม (ไม่เสียลิงก์เก่า) หรือย้ายเป็น `/match/{id}` (ตาม brief) — **แนะนำคง `/matches/{id}` เดิมไว้ เพื่อไม่พัง SEO/ลิงก์เดิม + เพิ่ม alias `/match/{id}`** (ดู §5 Open Decisions)

---

## 3. Match Page — ข้อมูลที่แสดง (จาก §9)

| ส่วน | แหล่งข้อมูล | สถานะ |
|---|---|---|
| Team A / Team B (โลโก้/ชื่อ) | `clubs` (join via home/away) | มีแล้ว |
| Date / Time | `matches.kickoff_at` | มีแล้ว |
| Venue | `matches.venue` (+ `clubs.stadium_*` ถ้ามี) | มีแล้ว (string) |
| Map | `clubs.stadium_map_url` (ถ้ามี) | มีบางทีม |
| Score / Result | `home_score` / `away_score` (ถ้า completed) | มีแล้ว |
| Goals / Cards / Assists / Subs | `match_events` (event_type) | มีแล้ว |
| MVP | `matches.mvp_player_id` | มีแล้ว |
| Match status | `matches.status` (scheduled/live/completed) | มีแล้ว |
| Photos | `match_photos` | มีแล้ว |
| Highlights | `matches.highlights_url` | มีแล้ว (ถ้ามีค่า) |
| Share URL + social card | **ต้องสร้างใหม่** | 🆕 Phase 1 |
| Match Report (auto) | ต้องสร้าง (Data→Content) | → Phase 4 |

> Match Page ต้องเป็น **Source of Truth** (จาก DB ไม่ hardcode) — ตาม §9

---

## 4. Share / Social Card (Phase 1 จุดที่มีค่า)

- ทุก match มี canonical URL → `/matches/{id}` (หรือ alias `/match/{id}`)
- **Dynamic OG meta** (เหมือนที่ KSL มีอยู่แล้วสำหรับ news — syncNews/og) → ใช้กับ match: title "KBFC 3–1 ABC FC · Matchday 7" + image (คัดจาก photos/score card)
- ตอน share → ใช้ได้กับ Facebook/Messenger/LINE
- เป้า: ผู้ใช้กระจาย traffic แทน platform ซื้อเอง (ตาม §15)

---

## 5. OPEN DECISIONS (ต้องอนุมัติก่อน implementation)

| # | คำถาม | ข้อเสนอ default | ทำไม |
|---|---|---|---|
| D-P1 | URL match: `/matches/{id}` (เดิม) หรือ `/match/{id}` (ตาม brief)? | **คง `/matches/{id}` เดิม + เพิ่ม redirect `/match/{id}`** | ไม่พังลิงก์เก่า/SEO · รองรับ brief |
| D-P2 | `create match` ใครใช้? (operator/admin เท่านั้น หรือทุกคน?) | **เริ่ม operator/admin มี auth** — ยังไม่มี public auth flow (ดู Audit R6) | กันข้อมูลมั่ว · Phase 3 เติม public |
| D-P3 | `match_type`/`competition` ต้องการกี่ระดับตอนนี้? | เริ่ม `match_type` enum เบา (league/friendly/tournament) + `competition` = season+division | Multi-league พอสำหรับ Phase 1 |
| D-P4 | venue คงเป็น string หรือขึ้น venue entity เลย? | **คง `venue` string ใน Phase 1** — venue entity รอ Phase 2 (ตาม brief §12) | ลด scope · venue entity ต้องทำเป็นฐานข้อมูลสนาม |

---

## 6. แผนงาน Phase 1 (ลำดับ — เมื่อผ่าน Gate)

1. **G1–G4 ผ่าน** (ยืนยัน project + media + approve)
2. **Migration additive** (match_type/competition/organizer — backup + approve)
3. **Match Page** (`matches.$matchId.tsx` → เติม OG meta + share + map จุดที่ขาด)  ← อ่านอย่างเดียว ก่อน
4. **Create Match** (`match.create.tsx` — form + Supabase insert ผ่าน server function/service-role ตาม SKILL.md §4 — ไม่ผ่าน anon write)
5. **Status pipeline + recalc** — ยืนยัน match completed → `recalc_standings()` (ตาม SKILL.md §4) — เป็นไปผ่าน server path
6. **Test:** สร้าง match → เปิด `/matches/{id}` → share → verify OG

---

## 7. คำถามที่ต้องตอบก่อนเขียน (ตาม §33 ข้อ 17 — ทุก feature ต้องเพิ่มคุณค่า)

> **"Feature นี้เพิ่มคุณค่าของ Football Platform หรือแค่ทำให้หน้าเว็บดูดีขึ้น?"**
> → Create Match + Match URL = **เพิ่ม Users + Data + Network Effect** (ทีมแชร์ลิงก์ → นักเตะ/แฟนเข้ามา → Follow → Match ใหม่) — push ไปทาง User Acquisition (§24) ไม่ใช่แค่ความสวย — ✅ สร้าง

---

> ⚠️ **ยังไม่เขียนโค้ดจนกว่าจะผ่าน:** G1–G4 (Gate §0) + Open Decisions §5 + Platform Owner อนุมัติ (Master Brief §33 ข้อ 17)
> ไฟล์นี้เป็น PROPOSAL — ข้อมูลจริง/โค้ดอยู่ที่ `SKILL.md` · `AUDIT_PHASE0.md` · `src/`
