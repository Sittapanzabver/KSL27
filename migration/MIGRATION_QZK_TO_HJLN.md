# MIGRATION PLAN — ย้าย KSL DB จาก Lovable Cloud (`qzk`) → Own Supabase (`hjljn`)

> **Purpose:** ย้ายข้อมูล KSL จาก Lovable Cloud (`qzksqhlrkpqnbavjpieq` — ผูก Lovable/third-party) มา Own Supabase (`hjljnwpfjbvrlvjpjhfv` — ใต้ Platform Owner) ตาม Master Brief §4 (infra อยู่ใต้ Platform Owner) + ลดความสับสน 2 projects
> **Owner:** Sp1cyP · **Date:** 22/08/2026 · **Status:** 📋 PLAN — **ยังไม่ run** (ตาม §30 ห้าม destructive ก่อน backup + approval · §5.2 ต้อง backup ก่อน)
> **อ่านคู่กับ:** `AUDIT_PHASE0.md` · `SKILL.md` · `KSL_HUB_MIGRATION_PLAN.md` · Master Brief §4/§5/§30
> **หลักยึด:** ห้ามทำลายข้อมูลเดิม · ห้าม destructive migration ก่อน backup + approval · ห้ามแตะ secret (service_role) ด้วยตัวเอง

---

## 0. สถานะปัจจุบัน (ตรวจแล้ว 22/08)

| เรื่อง | qzk (Lovable Cloud) | hjljn (Own Supabase) |
|---|---|---|
| URL | `qzksqhlrkpqnbavjpieq.supabase.co` | `hjljnwpfjbvrlvjpjhfv.supabase.co` |
| บทบาท | **Main DB (live site ใช้)** | **Storage รูป (เพิ่ง un-pause)** · config.toml ชี้ project นี้ |
| ข้อมูล | seasons 3 · divisions 2 · clubs 8 · players 151 · match_events 24 · standings 8 · top_scorers 151 · news 11 · sponsors 2 · club_history 3 · club_seasons 22 | (ยังเป็น storage — ฟรี) |
| Storage | ksl-logo (assets) | hero/u16hero/club logos/news covers |

**ปัญหาหลัก:** DB อยู่ใน Lovable Cloud (`qzk`) แต่ storage รูปอยู่ใน Own (`hjljn`) + config.toml ใช้ `hjljn` → กระจัดกระจาย/สับสน

---

## 1. เป้าหมาย (หลังย้ายเสร็จ)

| เรื่อง | หลังย้าย |
|---|---|
| **DB หลัก** | `hjljnwpfjbvrlvjpjhfv` (Own Supabase — ใต้ Platform Owner) |
| **Storage รูปทั้งหมด** | `hjljnwpfjbvrlvjpjhfv` (รวม ksl-logo/asset เดิมจาก qzk) |
| **config.toml / .env / client** | ชี้ `hjljn` อย่างเดียว |
| **Lovable Cloud `qzk`** | สำรองไว้ → ลดเหลือ backup (ไม่ใช้เป็น DB หลัก) |
| **Result** | 1 project เดียว = ไม่สับสน (ตรง Master Brief §4) |

---

## 2. ขั้นตอน (ลำดับ — แต่ละจุดต้อง backup + approval)

> ⚠️ **ทุกขั้นตอนใน §2–§5 ต้องมี approval จาก Platform Owner ก่อน run** — ผมทำได้ถึงขั้น**เตรียม script/plan** ไม่ run destructive เอง (§30)

### STEP 1 — Backup (ทำก่อนทุกอย่าง)
- [ ] Backup DB `qzk` (pg_dump / Supabase dashboard backup ละเอียด) — **ต้องมีก่อนย้าย**
- [ ] Backup storage `qzk` (object ทั้งหมด — ksl-logo/assets) + `hjljn` (media)
- ✅ **สำรองข้อมูลหลักแล้ว (22/08):** `migration/qzk_export/` — 12 tables / ~385 rows (read-only export) — แต่**ยังไม่ครบ** (matches ถูก RLS บล็อก + auth tables) → ต้อง dump ครบด้วย service-role

### STEP 2 — สร้าง schema ใน hjljn
- [ ] Run migrations 30 ไฟล์ (`supabase/migrations/`) กับ `hjljn` (ใช้กับ project ใหม่) — สร้าง tables/enums/RLS/storage bucket `media`
- [ ] ⚠️ ตรวจ `matches` RLS/columns — ต้องย้ายทั้ง schema ให้ครบ (MATCH_PUBLIC_COLS ไม่รวม private columns — ตรวจ revoke)

### STEP 3 — ย้ายข้อมูล (seed)
- [ ] Import 12 tables จาก `migration/qzk_export/*.json` → `hjljn`
- [ ] **`matches`** — ต้องย้ายด้วย (ถูก RLS บล็อก anon → ต้องใช้ service-role/pg_dump ล้วน) · ประมาณ 56 matches / 24 events
- [ ] ราคา/ข้อมูลอื่นครบ (จาก export + dump เต็ม)

### STEP 4 — ย้าย storage
- [ ] ลากวัตถุทั้งหมดจาก `qzk` storage (assets/ksl-logo ฯลฯ) → `hjljn` storage bucket `media`
- [ ] อัปเดต URL ใน DB ที่อ้าง `qzksqhlrkpqnbavjpieq.supabase.co/...` → `hjljnwpfjbvrlvjpjhfv.supabase.co/...` (logo_url/cover_url/รูปในโค้ด hero)

### STEP 5 — Re-point (ชี้ project เดียว)
- [ ] `.env` / `config.toml` / `client.ts` → `hjljn` หมด
- [ ] ตรวจว่า `koratsuperleague.vercel.app` (ใช้ hjljn) ไม่ 404
- [ ] ยืนยัน live site อ่าน DB ได้จาก hjljn

### STEP 6 — Verify + ปิด
- [ ] verify ข้อมูลครบ (เทียบ qzk export vs hjljn)
- [ ] รูปทั้งหมดโหลด (render)
- [ ] `qzk` ลดเป็น backup (ไม่ลบ — เผื่อ rollback)

---

## 3. สิ่งที่ต้องคุณ (ผมทำไม่ได้ — secret/สิทธิ์)

| # | ต้องจากคุณ | ทำไม |
|---|---|---|
| C1 | **service_role key ของ `qzk`** (หรือ connection string) | เพื่อ dump ครบ (matches/auth tables ที่ anon อ่านไม่ได้) |
| C2 | **service_role key ของ `hjljn`** | เพื่อสร้าง schema + seed + ย้ายข้อมูล |
| C3 | ยืนยัน run migration ตาม plan นี้ (approval) | §30 — destructive ต้อง approve |
| C4 | (ถ้ามี) สิทธิ์ storage 2 project | ย้าย object ครบ |

> 🔴 **ผมไม่ขอ/ไม่แตะ secret เอง** — คุณจะเป็นคนใส่ key ใน environment ที่ปลอดภัย (หรือรันเอง) ผมเตรียม script + plan ครบให้

---

## 4. ความเสี่ยง/ข้อควรระวัง

- ⚠️ **`matches` column จำกัด (RLS/revoke)** — ต้อง dump ด้วย service-role ไม่ใช่ anon ไม่งั้นขาดข้อมูล
- ⚠️ **รูป hardcode URL** ในโค้ด (`clubs.$slug.tsx:27`, HeroSection, U16Spotlight) — ต้องอัปเดตเป็น hjljn (หรือใช้ relative path กันพัง)
- ⚠️ **`top_scorers` 2 แหล่ง** — ย้ายครบแล้วค่อย reconcile (R3)
- ⚠️ **.env ยังชี้ qzk** — หลังย้ายต้องชี้ hjljn (ไม่งั้น web อ่าน DB เก่า)
- ⚠️ **Lovable Cloud อาจทำ deployment ใหม่ทับ** — หลังย้าย ควรตัด Lovable เป็น source จริง

---

## 5. สถานะ

| ขั้น | สถานะ |
|---|---|
| Backup export (read-only) | ✅ 12 tables (~385 rows) — `migration/qzk_export/` |
| Dump เต็ม (matches/auth) | ⏳ ต้อง service_role (C1) |
| Schema in hjljn | ⏳ รอ run |
| Seed data | ⏳ รอ |
| Storage ย้าย | ⏳ รอ |
| Re-point | ⏳ รอ |
| Verify | ⏳ รอ |
| Credit ASA (เว็บ) | ✅ ทำแล้ว (22/08) — Footer + `site.ts` PLATFORM_OWNER |
| Season 2027 prep (SSOT) | ✅ `site.ts` SITE_YEAR = จุดเดียวแก้ |

> 🔴 **ยังไม่ย้ายจริง** — รอ C1–C4 + approval จาก Platform Owner (ตาม §30) · ผมทำได้ถึงขั้นนี้ (plan + export + credit ASA + season SSOT)
