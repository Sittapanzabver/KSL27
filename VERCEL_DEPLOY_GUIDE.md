# 🚀 Vercel Deploy — KSL Hub (คู่มือกดเอง ได้เลย)

> เตรียมพร้อมโดย Hermes · 22/08/2026 · nitro preset = `vercel` (ตั้งใน `vite.config.ts` แล้ว) · build ผ่าน `.vercel/output/` ✅
> แทน Lovable (เครดิตไม่พอ) · override R-01/R-03 ตามคำสั่งเจ้าของ

---

## ก่อนเริ่ม (มี 4 อย่างที่ต้องมี)

| # | ต้องมี | เอามาจากไหน |
|---|---|---|
| 1 | **GitHub repo** สำหรับโค้ด KSL | สร้าง repo ใหม่ (หรือใช้ repo เดิมที่ยังอยู่) แล้ว push โฟลเดอร์ `CSDP/ksl-hub/` ขึ้น |
| 2 | **Vercel account** ที่ login แล้ว | [vercel.com](https://vercel.com) |
| 3 | **Supabase key** (3 ตัว) | dashboard ของ `qzksqhlrkpqnbavjpieq` |
| 4 | ~~Lovable~~ (ข้าม — ใช้ Vercel แทน) | — |

---

## ขั้นตอน A — Push โค้ดขึ้น GitHub (ครั้งเดียว)

ในเครื่อง (ที่โฟลเดอร์ `CSDP/ksl-hub/`):

```bash
cd "$(pwd)/CSDP/ksl-hub"
git init                              # ถ้ายังไม่มี .git
git add -A
git commit -m "KSL 2027 — Vercel deploy (draw + landing 2027)"
git branch -M main
git remote add origin git@github.com:<your-user>/<ksl-repo>.git   # ใส่ repo จริง
git push -u origin main
```

> ✅ `.gitignore` ของ ksl-hub กัน `node_modules/`, `dist/`, `.env` แล้ว — ไม่มี secret หลุด
> ⚠️ อย่า push `.env` (มันถูก ignore แล้ว)

---

## ขั้นตอน B — สร้าง Vercel Project (import จาก GitHub)

1. เปิด [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → เลือก repo KSL ที่เพิ่ง push
3. Vercel จะตรวจ framework = **Vite** (จาก `vercel.json`), build command = `npm run build`, output = `.vercel/output`
4. คลิก **Deploy**

---

## ขั้นตอน C — ตั้ง Environment Variables (ก่อน/หลัง deploy ก็ได้ แต่ต้องตั้งก่อนใช้งานจริง)

Vercel Project → **Settings → Environment Variables** → เพิ่มตาม `.env.example`:

| Name | Value |
|---|---|
| `SUPABASE_URL` | `https://qzksqhlrkpqnbavjpieq.supabase.co` |
| `VITE_SUPABASE_URL` | เหมือนด้านบน |
| `SUPABASE_PROJECT_ID` | `qzksqhlrkpqnbavjpieq` |
| `VITE_SUPABASE_PROJECT_ID` | เหมือนด้านบน |
| `SUPABASE_PUBLISHABLE_KEY` | anon key (จาก `.env` เครื่อง / Supabase dashboard) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | เหมือนด้านบน |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret (จาก Supabase dashboard → Settings → API) |

เลือก **Production + Preview** → Save → **Redeploy** (ถ้าใส่หลัง deploy)

---

## ขั้นตอน D — รัน SQL (ก่อนหน้าเว็บใช้งาน 2027 เต็มรูปแบบ)

Supabase SQL Editor ของ **`qzksqhlrkpqnbavjpieq`** (DB หลัก) → วาง `supabase/seed_2027_structure.sql` → Run
→ ควรได้ `season 2027 (active)` + `divisions 2` + `club_seasons 8`

---

## ขั้นตอน E — ตรวจหลัง deploy

- [ ] หน้า `https://<project>.vercel.app` ขึ้น "Season 2027" (title/hero)
- [ ] `/tournament-draw` เปิดได้ — จับฉลาก/จับคู่ทำงาน
- [ ] `/standings` แสดง "ยังไม่มีข้อมูล" (ปกติ — ยังไม่มีผลแข่ง 2027)
- [ ] ลบ Vercel เก่า `koratsuperleague.vercel.app` (ถ้าทำตาม R-03): Vercel → โปรเจกต์เก่า → Settings → Danger Zone → **Delete Project** (หลัง deploy ใหม่ผ่าน)

---

## ⚠️ เคล็ดลับ/ข้อควรระวัง

- **อย่า** ตั้ง `SUPABASE_SERVICE_ROLE_KEY` ในฝั่ง client/`VITE_*` — เป็น server-only (จะรั่ว secret)
- ถ้าใช้ฟีเจอร์ `/admin` + sync ต้องมี `SUPABASE_SERVICE_ROLE_KEY` ครบ — ไม่งั้นหน้า admin sync ยัง error
- ค่า `SITE_YEAR = "2027"` อยู่ที่ `src/lib/site.ts` (SSOT) — หน้าเว็บใช้ค่าจากโค้ด ไม่ต้องตั้ง env
- Deploy ใหม่ทุกครั้งที่แก้โค้ด → `git push` → Vercel auto-deploy (ถ้าเชื่อม GitHub)

---

*งานนี้แทน Lovable (เครดิตไม่พอ) — ตามคำสั่งเจ้าของ override R-01/R-03 · เมื่อตั้งชื่อ custom domain อย่าลืมอัปเดต `DEPLOYMENT_DIRECTIVE.md`*
