# Ticket: Wayfinder Implementation

**Type:** Grilling (HITL)
**Status:** ✅ Resolved
**Blocking:** 02-wayfinder-ux-design
**Labels:** wayfinder:grilling

---

## Question

Wayfinder ควร implement อย่างไรใน TanStack Start + React 19?

**ตัวเลือก implementation:**
1. **React component** — สร้าง `<Wayfinder />` component ที่ใช้ TanStack Router's search params
2. **TanStack Query** — ใช้ useQuery สำหรับ search results
3. **Fuse.js** — client-side fuzzy search สำหรับ clubs/players
4. **Supabase full-text search** — server-side search ผ่าน RPC
5. **Hybrid** — client-side สำหรับข้อมูลที่โหลดแล้ว, server-side สำหรับข้อมูลใหม่

**ข้อพิจารณา:**
- Data volume: clubs (7-8), players (100+), news (unlimited), matches (unlimited)
- Performance: ต้อง realtime autocomplete ไหม?
- Bundle size: Fuse.js (~10KB) vs ไม่ใช้ library
- i18n: ต้องค้นหาทั้งภาษาไทยและอังกฤษไหม?

## Resolution

**สร้างแล้ว:**
1. `src/components/wayfinder/WayfinderSearchBar.tsx` — Global search bar component
2. เพิ่มใน `src/components/site/Header.tsx` — ตรงกลาง header

**Features:**
- Real-time autocomplete ขณะพิมพ์
- ค้นหาทุกอย่าง: สโมสร, อำเภอ, นักเตะ, ข่าว
- Group ตาม category
- Fuzzy match สำหรับค้นหา
- Close on click outside + Escape
- Mobile: ซ่อน (แสดงเฉพาะ desktop)

**Build:** ✅ exit 0 (6.03s)
**TypeCheck:** ✅ 0 errors
