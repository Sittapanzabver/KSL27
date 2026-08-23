# KSL Hub (Meinhard Sports Korat Super League) — อยู่ใน mirofish-core

> **ที่มา (provenance):** ย้ายจาก repo `git@github.com:Sittapanzabver/korat-league-hub.git`
> **Commit ต้นทาง:** `869d4ac` (09/06/2026 · "Fixed matches routing layout" · 1 commit squashed)
> **ย้ายเข้าเมื่อ:** 12/08/2026 (P2 — ย้าย/พัฒนาบน Freebuff) · ย้ายแบบ copy ตรง ๆ **ไม่ refactor**
> **เอกสาร SSOT ระดับโปรเจกต์:** `SKILL.md` (สถาปัตยกรรม/สคีมา/กฎ) + `CONTEXT.md` — มาจาก repo เดิม

## โครงสร้าง

| Path | คืออะไร |
|:--|:--|
| `src/routes/` | 17 routes (TanStack Router file-based) |
| `src/lib/` | queries, calculateStandings, seasonArchive, i18n, syncNews/sheetScorers (Google Sheets) |
| `src/components/` | home/ · site/ · sponsors/ · ui/ (shadcn) |
| `src/integrations/supabase/` | client (anon) · client.server (service role — env เท่านั้น) · auth |
| `supabase/migrations/` | 29 migrations — schema reference (ห้ามรันกับ Lovable Cloud ตรง ๆ) |
| `.lovable/`, `SKILL.md`, `CONTEXT.md` | artifacts เดิมของ Lovable — เก็บไว้ |

## วิธีรันบน Freebuff (local dev)

```bash
# ครั้งแรก
npm install

# dev server
npm run dev        # แล้วเปิด http://localhost:3000 (port ตาม @lovable plugin)

# build ทดสอบ
npm run build
```

**Env:** คัดลอก `.env.example` → `.env` แล้วเติมค่า (ในเครื่องนี้มี `.env` พร้อมแล้ว — ค่า anon/publishable เท่านั้น ไม่มี secret)

**ตัวแปรที่ต้องการ:**
| ตัวแปร | จำเป็น? | หมายเหตุ |
|:--|:--:|:--|
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (+ `VITE_*`) | ✅ | anon key — สาธารณะโดย design (อยู่แล้วใน .env) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ (เฉพาะ /admin) | อยู่ใน deployment env ของ Lovable เท่านั้น — ยังไม่มีในเครื่อง |
| `LOVABLE_API_KEY` + `GOOGLE_SHEETS_API_KEY` | ❌ (เฉพาะ /admin sync) | อยู่ env Lovable Cloud — ถ้าย้าย hosting ต้องตั้งใหม่ |

## งาน P3 — Social-ready (12/08/2026)

| ไฟล์ | ทำอะไร | วิธีใช้ |
|:--|:--|:--|
| `scripts/social.mjs` | **Content/Output workflow** — ดึงข้อมูลจาก Supabase → โพสต์พร้อมเผยแพร่ (ผลแข่ง/ตาราง/ดาวซัลโว/ข่าว + hashtags) | `npm run social` → คัดลอกจาก `output/social-YYYYMMDD.md` |
| `scripts/generate-og-image.mjs` | สร้าง `public/og-image.png` (1200×630) — รูป share แบบ stable | `node scripts/generate-og-image.mjs` |
| Dynamic OG meta | หน้า `/news/$slug` มี title/description/รูปปก/URL เฉพาะบทความ (SSR) · หน้ากลุ่มมี og:title/description เฉพาะหน้า | แชร์ลิงก์บน Facebook/LINE ขึ้น preview ถูกต้อง |
| `src/lib/site.ts` | `SITE_URL` / `SITE_NAME` — จุดเดียวที่แก้เมื่อย้าย domain | — |

## สถานะข้อมูล (ข้อมูลไม่สูญหาย)

- **DB หลัก (production):** Lovable Cloud Supabase `qzksqhlrkpqnbavjpieq` — อยู่ที่เดิม ไม่ย้าย
- **Media:** Supabase Storage (`hjljnwpfjbvrlvjpjhfv`) + R2 — คง URL เดิม ไม่ย้าย
- **ข่าว/ดาวซัลโว:** Google Sheets → Lovable connector — ต้นทางเดิม
- หน้าเว็บสาธารณะอ่านข้อมูลผ่าน anon key + RLS — รันจากเครื่องไหนก็เห็นข้อมูล live เดียวกัน
