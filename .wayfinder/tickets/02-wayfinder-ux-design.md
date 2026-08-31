# Ticket: Wayfinder UX Design

**Type:** Grilling (HITL)
**Status:** ✅ Resolved
**Blocking:** None (frontier ticket)
**Labels:** wayfinder:grilling

---

## Question

ระบบ Wayfinder (guided search/navigator) ควรทำงานอย่างไร?

**ตัวเลือก UX:**
1. **Global search bar** — ค้นหาทุกอย่างจาก header (สโมสร, อำเภอ, นักเตะ, ข่าว, แมตช์)
2. **Command palette** (Cmd+K) — modal ค้นหาแบบ keyboard-first
3. **Dedicated search page** — หน้า `/search` แยกต่างหาก
4. **Sidebar navigator** — sidebar ที่ slide เข้ามาแสดง categories

**ข้อมูลที่ต้องค้นหาได้:**
- สโมสร (ชื่อ, อำเภอ, โค้ด)
- นักเตะ (ชื่อ, สโมสร, ตำแหน่ง)
- ข่าว (หัวข้อ, เนื้อหา)
- อำเภอ (32 อำเภอ)
- แมตช์ (ทีม, matchweek)

**UX flow ที่ต้องการ:**
- ควร autocomplete ไหม?
- ควรแสดงผลลัพธ์แบบ real-time ไหม?
- ควร group ผลลัพธ์ตาม category ไหม?

## Resolution

**ตัดสินใจ:**
1. **UI Pattern:** Global Search Bar ตรงกลาง Header
2. **Search Scope:** ทุกอย่าง — สโมสร, อำเภอ, นักเตะ, ข่าว, แมตช์
3. **Results Display:** Group ตาม category
4. **Position:** Center ของ Header
5. **Autocomplete:** Real-time autocomplete ขณะพิมพ์

**Unblocks:** 04-wayfinder-implementation
