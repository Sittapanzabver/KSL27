# Wayfinder Map: KSL Hub Skill Landing Page + Wayfinder

**Created:** 2026-08-31
**Status:** ✅ Complete — destination reached, 5/5 tickets resolved, ready for hand-off

---

## Destination

สร้างหน้า **Skill Landing Page** (club profile/achievements สำหรับ展示 ทักษะ/นักเตะ/ผลงานของแต่ละสโมสร) และระบบ **Wayfinder** (guided search/navigator ช่วยแฟนบอลค้นหาสโมสร/อำเภอ/นักเตะ/ข่าว) ให้ KSL Hub ทำงานได้สมบูรณ์

## Notes

- **Tech stack:** TanStack Start v1, React 19, Vite 7, Tailwind CSS v4, Supabase
- **Current state:** Club profile page (`/clubs/$slug`) มีอยู่แล้ว แต่ยังไม่มี dedicated "skill landing page" สำหรับ展示 ทักษะ/ผลงาน
- **Current navigation:** Header มี tab navigation แต่ไม่มี guided search/navigator
- **DB:** Lovable Cloud `qzksqhlrkpqnbavjpieq` — ห้ามแก้ DB ตรง
- **Season 2027:** ยังไม่เริ่ม — ไม่มีแมตช์/standings

## Decisions so far

- [Destination named](#destination): Skill landing page = club profile/achievements; Wayfinder = guided search/navigator
- [01-skill-landing-page-scope](tickets/01-skill-landing-page-scope.md): ต่อยอด clubs.$slug.tsx, ทักษะ/จุดแข็งของสโมสร, hardcode ใน frontend
- [03-data-model-for-skills](tickets/03-data-model-for-skills.md): DB ไม่มีโครงสร้าง skills/highlights — hardcode ถูกต้องแล้ว; `club_history.achievements` เป็น achievement แหล่งเดียวที่ public อ่านได้
- [05-skill-landing-page-implementation](tickets/05-skill-landing-page-implementation.md): สร้าง clubSkills.ts + SkillShowcaseSection.tsx + เพิ่มใน clubs.$slug.tsx
- [02-wayfinder-ux-design](tickets/02-wayfinder-ux-design.md): Global Search Bar center header, ทุกอย่าง, group by category, real-time autocomplete
- [04-wayfinder-implementation](tickets/04-wayfinder-implementation.md): สร้าง WayfinderSearchBar.tsx + เพิ่มใน Header.tsx

## Active Tickets

| Ticket | Type | Status | Blocking |
|--------|------|--------|----------|
| ~~[01-skill-landing-page-scope](tickets/01-skill-landing-page-scope.md)~~ | Grilling | ✅ Resolved | — |
| ~~[02-wayfinder-ux-design](tickets/02-wayfinder-ux-design.md)~~ | Grilling | ✅ Resolved | — |
| ~~[03-data-model-for-skills](tickets/03-data-model-for-skills.md)~~ | Research | ✅ Resolved | ~~01~~ (resolved) |
| ~~[04-wayfinder-implementation](tickets/04-wayfinder-implementation.md)~~ | Grilling | ✅ Resolved | — |
| ~~[05-skill-landing-page-implementation](tickets/05-skill-landing-page-implementation.md)~~ | Task | ✅ Resolved | — |

**Frontier (unblocked, ready to work):** — (ทุก ticket ปิดแล้ว — ทางชัดเจน พร้อม hand-off)

## Not yet specified

- Performance optimization for search (ยังไม่ sharp — ข้อมูล volume ยังน้อย เลื่อนไปได้จนกว่าจะมีปัญหาจริง)
- Mobile wayfinder (ถ้า owner อยากใช้บนมือถือ — อยู่นอก destination นี้ ยังไม่ชัดเจนพอจะ ticket)

## Out of scope

- การแก้ DB schema (ห้ามแก้ DB ตรง)
- การสร้าง data 2027 เอง (ใช้เฉพาะที่ owner ยืนยันแล้ว)
- Supabase migration/seed
