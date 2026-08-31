# Ticket: Skill Landing Page Scope

**Type:** Grilling (HITL)
**Status:** ✅ Resolved
**Blocking:** None (frontier ticket)
**Labels:** wayfinder:grilling

---

## Question

หน้า Skill Landing Page สำหรับ KSL Hub ควรแสดงข้อมูลอะไรบ้าง? ปัจจุบัน clubs.$slug.tsx มี:
- Hero section (สโมสร, สี, logo)
- Season stats strip (อันดับ, แต้ม, แข่ง, etc.)
- ฟอร์มล่าสุด (W/D/L)
- ประวัติสโมสร
- ข้อมูลสโมสร (สี, ชื่อย่อ, คำอธิบาย)
- สนามเหย้า
- ผู้สนับสนุนหลัก
- นักเตะในทีม (senior + U-16)
- โปรแกรมและผลการแข่งขัน
- ที่เที่ยวใกล้สนาม

**ต้องการข้อมูลเพิ่ม:**
1. ควรเพิ่มส่วน "ทักษะ/Skills" ที่展示 จุดแข็งของสโมสรไหม? (เช่น สไตล์การเล่น, จุดเด่น, สถิติเปรียบเทียบ)
2. ควรเพิ่มส่วน "Highlights" หรือ "Achievements" แยกจากประวัติสโมสรไหม?
3. หน้า skill landing page ควรเป็นหน้าใหม่ `/clubs/$slug/skills` หรือรวมอยู่ใน clubs.$slug.tsx เดิม?
4. ข้อมูลไหนต้องเพิ่มใน DB (players table หรือ new table)?

## Resolution

**ตัดสินใจ:**
1. **ที่อยู่:** ต่อยอด clubs.$slug.tsx — เพิ่ม sections ใหม่เข้าไปในหน้า club profile เดิม
2. **Content:** ทักษะ/จุดแข็งของสโมสร (สไตล์การเล่น, จุดเด่น, สถิติเปรียบเทียบ)
3. **Data:** Hardcode ใน frontend — ข้อมูล skill เป็น static data ใน component

**Unblocks:** 03-data-model-for-skills, 05-skill-landing-page-implementation
