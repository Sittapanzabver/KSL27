# Ticket: Skill Landing Page Implementation

**Type:** Task (HITL)
**Status:** ✅ Resolved
**Blocking:** 01-skill-landing-page-scope, 03-data-model-for-skills
**Labels:** wayfinder:task

---

## Question

สร้างหน้า Skill Landing Page อย่างไร?

**ตัวเลือก:**
1. **ต่อยอด clubs.$slug.tsx** — เพิ่ม sections ใหม่เข้าไปในหน้าเดิม
2. **สร้างหน้าใหม่ `/clubs/$slug/skills`** — separate page สำหรับ skill showcase
3. **Tab ใหม่** — เพิ่ม tab "Skills" ในหน้า clubs.$slug.tsx

**Sections ที่ต้องสร้าง:**
- Skill highlights (จุดแข็งของสโมสร)
- Player spotlight (นักเตะเด่น)
- Achievement timeline (ผลงาน/แชมป์)
- Comparison radar chart (เปรียบเทียบกับสโมสรอื่น)

**Technical:**
- ใช้ recharts สำหรับ radar chart?
- ใช้ ClubCrest component ที่มีอยู่แล้ว?
- ต้องสร้าง new query functions ใน queries.ts?

## Resolution

**สร้างแล้ว:**
1. `src/data/clubSkills.ts` — skill data hardcode สำหรับ 7 สโมสร (style, strengths, tactics, radar data)
2. `src/components/club/SkillShowcaseSection.tsx` — component แสดงทักษะ/จุดแข็ง + radar chart
3. เพิ่มใน `src/routes/clubs.$slug.tsx` — หลังส่วนข้อมูลสโมสร ก่อนสปอนเซอร์

**Build:** ✅ exit 0 (6.13s)
**TypeCheck:** ✅ 0 errors
