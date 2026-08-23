# KSL FOOTBALL PLATFORM — ASSET / OWNERSHIP ARCHITECTURE

> **Purpose:** เอกสาร SSOT กำหนด "อะไรเป็นของ Platform / อะไรเป็นของ League / ข้อมูลใดที่ลีกได้รับอนุญาตให้ใช้" — ตามหลัก White-label Platform Owner (หน้าบ้าน = KSL แบนด์ · หลังบ้าน = ASA เจ้าของ 100%) · ต้องทำ**ก่อน**รื้อระบบครั้งใหญ่
> **Owner:** Sp1cyP (ASA TEC STUDIO = Platform Owner) · **Date:** 22/08/2026 · **Status:** ✅ **CONFIRMED** (อนุมัติ 22/08/2026) — Matrix §3 ปิดแล้ว · เหลืองานย้าย infra (§6 ข้อ 3) + เจรจา Operator (§6 ข้อ 2)
> **หลักยึด:** "อย่าให้คนไม่รู้ว่าคุณเป็นเจ้าของ กลายเป็น คุณไม่มีหลักฐานว่าคุณเป็นเจ้าของ" — แบนด์หน้า = KSL 100% · Ownership หลัง = ASA ชัดเจน 100% (สองเรื่องแยกจากกัน)

---

## 1. หลักการ White-label Platform (จากแนวทาง 2027)

```
คุณ / ASA TEC STUDIO (Platform Owner)
│
├── Technology / Platform
│   ├── Match Engine
│   ├── Team System
│   ├── Player System
│   ├── Fantasy
│   ├── Stats
│   └── User System
│
└── KSL Platform  (แบรนด์หน้าเว็บ)
    ├── Korat Super League  (ลีกแรกบน Platform)
    ├── Teams · Players · Fans · Tournaments
```

**หลัก White-label:** หน้าเว็บ (public-facing) = **KSL** เป็นแบนด์ Platform ส่วนเจ้าของเทคโนโลยี (ASA) ไม่จำเป็นต้องโผล่หน้าหลัก — แต่**ความเป็นเจ้าของต้องระบุได้ชัดในระดับระบบ/เอกสาร**

> ⚠️ **ข้อเดียวที่ย้ำ:** แบนด์หน้าบ้าน = KSL ได้ 100% · **Ownership หลังบ้าน = ASA ชัดเจน 100%** — สองอย่างนี้แยกกันได้ อย่าให้ "คนไม่รู้ว่าคุณเป็นเจ้าของ" กลายเป็น "คุณไม่มีหลักฐานว่าคุณเป็นเจ้าของ"

---

## 2. สามชั้นของ Asset (อะไรเป็นของใคร)

| ชั้น | เจ้าของ | ตัวอย่าง | สิทธิ์ |
|---|---|---|---|
| **A. Platform Technology** (โค้ด/โครงสร้าง) | **ASA TEC STUDIO** (Platform Owner) | architecture · schema · engine · component · repository · Supabase/database · storage · hosting · domain · API keys · auth infra · analytics | ASA ควบคุมทั้งหมด · ใช้ซ้ำกับลีกอื่นได้ |
| **B. League / Brand** (ตัวลีก) | **League Operator** (เช่น กบ กสินเฮด) | ชื่อลีก KSL · โลโก้ลีก · สิทธิ์จัดการแข่งขัน · ผล/ตาราง/สถิติของลีก · ข่าว/ภาพของลีก | Operator มีสิทธิ์บริหารเนื้อหาลีก แต่**ไม่ใช่เจ้าของ Platform** |
| **C. Shared Data / Content** | ตามแหล่งกำเนิด | ภาพถ่าย/ข่าว **จากเพจ Facebook ของแต่ละสโมสร** (สโมสร/ทีมงาน Operator/ช่างภาพ) · ข้อมูลนักเตะ | ต้องระบุ source + ได้รับสิทธิ์ใช้เท่านั้น — **ไม่ใช่สมบัติของ Platform อัตโนมัติ** · สโมสร/Operator กระจายเนื้อหาเอง ผ่าน Platform |

> **หลัก:** League Operator ใช้ Platform ได้ (สิทธิ์ Admin/Operator สำหรับงานลีก) แต่**ไม่เป็นเจ้าของ Platform/Infrastructure อัตโนมัติ** (Master Brief §4 — เป็นเรื่อง Asset Governance ไม่ใช่ความไม่ไว้วางใจบุคคล)

---

## 3. Ownership Matrix (ตารางระบุเจ้าของราย asset)

| Asset | เจ้าของ | เอกสาร/หลักฐาน | ASA ใช้ซ้ำได้ไหม |
|---|---|---|---|
| **โค้ด Platform** (src/supabase/config) | 🟢 ASA | `CSDP/ksl-hub/` (repo) | ✅ ได้เต็มที่ |
| **Database schema** | 🟢 ASA | `supabase/migrations/` | ✅ ได้ |
| **DB หลัก (`qzk`)** | 🟢 ASA (หลังย้าย) | `MIGRATION_QZK_TO_HJLN.md` | ✅ |
| **Storage รูป** | 🟢 ASA | `hjljn...` bucket `media` | ✅ |
| **Domain/URL** | 🟢 ASA | `koratsuperleague.lovable.app` | ✅ (แต่ต้องย้ายเข้าสู่ ASA ตาม R-03) |
| **ชื่อลีก "Korat Super League"** | 🟡 League Operator | ตามข้อตกลงกับ Operator | ⚠️ ใช้ได้เฉพาะบน Platform KSL |
| **โลโก้/ภาพแบรนด์ลีก** | 🟡 League Operator | ต้องถาม | ⚠️ ไม่ใช้ออกนอกบริบทลีก |
| **ข้อมูลผล/ตาราง/สถิติลีก** | 🟡 Operator (แหล่ง) | data ใน DB | ⚠️ ใช้บนแพลตฟอร์มนี้ได้ แต่อย่าไปขาย/อ้างเป็นของตัวเอง |
| **ภาพถ่ายแมตช์** | 🟡 ช่างภาพ/สโมสร/Operator | ต้องระบุผู้ให้ | ⚠️ ต้องได้รับอนุญาต |
| **ข้อมูลนักเตะ/ทีม** | 🟡 Operator/สโมสร | ต้นทาง | ⚠️ ใช้ตามวัตถุประสงค์แพลตฟอร์มเท่านั้น |
| **Public brand "KSL Football Platform"** | 🟢 ASA (แบนด์ Platform) | เอกสารนี้ | ✅ — แบนด์ระบบที่ ASA สร้าง |

> 🟢 = ASA (Platform Owner) ควบคุมเต็ม · 🟡 = League Operator/บุคคลที่สาม (ต้องได้รับสิทธิ์/ไม่อ้างเป็นเจ้าของ)

---

## 4. สิทธิ์ที่กั้น (สำคัญ — ป้องกันกรรมสิทธิ์มัว)

| สิ่งที่ | กติกา |
|---|---|
| League Operator กับ Infra | Operator **ไม่มีสิทธิ์** เป็นเจ้าของ domain/repo/Supabase/DB/storage/keys อัตโนมัติ |
| ASA กับเนื้อหาลีก | ASA **ไม่เอาข้อมูลลีก/ภาพ/โลโก้** ของ Operator ไปขาย/อ้างเป็นสินค้าของตัวเอง |
| Exit (ลีกหยุด) | **ถ้า KSL หยุดจัด Platform ยังต้องใช้ได้กับลีกอื่น** (Master Brief §3) — คืนข้อมูลลีกให้ Operator, เก็บ Platform ไว้ |
| ความไม่รู้เจ้าของ | ต้องมีหลักฐาน (เอกสารนี้ + repo + deployment account) ที่ระบุว่า **ASA = Platform Owner** — แม้หน้าเว็บเป็น KSL |

---

## 5. license / Revenue / Exit (แนวทาง — รอ Owner อนุมัติ)

- **License:** Platform ใช้ได้โดย League Operator ตามข้อตกลง (ไม่โอนกรรมสิทธิ์โค้ด)
- **Revenue sharing:** กำหนดตามข้อตกลง (มี Sponsor/Subscription ตาม Master Brief §21 — ไม่ใช่การพนัน §22)
- **Exit scenario:** ถ้า KSL หยุด → Platform ยังใช้งานต่อได้ · ข้อมูลที่เป็นของ Operator ส่งคืน · โค้ด/engine เป็นของ ASA เสมอ

---

## 6. งานที่ต้องคุณก่อนรื้อระบบ (ตาม "ก่อนให้ Hermes รื้อ")

| # | งาน | สถานะ |
|---|---|---|
| 1 | อนุมัติ Ownership Matrix §3 + หลักการ §1 | ⏳ รอ |
| 2 | เจรจา/ยืนยันข้อตกลงกับ League Operator (กบ กสินเฮด) เรื่องสิทธิ์ใช้แบรนด์/ข้อมูลลีก | ⏳ รอ |
| 3 | ย้าย infra (Domain/Supabase/Storage) เข้าสู่ ASA (R-01/R-03) — ดู `MIGRATION_QZK_TO_HJLN.md` | ⏳ รอ |
| 4 | ระบุ ที่มาของรูป/ข่าว (ขออนุญาต/ระบุผู้ให้) | ⏳ รอ |

---

## 7. ความหมายต่อโค้ด (สิ่งที่กำลังทำ — ไม่ขัดหลักนี้)

- **หน้าบ้าน (public)** → แบนด์ **KSL Football Platform** (Master Brief §25) — "จัดการแข่งขัน · ติดตามทีม · ดูนักเตะ · สถิติ · Fantasy"
- **KSL Super League** → เป็น**หนึ่งในลีก**บน Platform (ไม่ใช่ทั้งแพลตฟอร์ม)
- **Credit "พัฒนาโดย ASA"** → ลงที่ Footer (หลังบ้าน/ownership) — ไม่ใช่หน้า Hero หลัก (แบรนด์หน้าบ้าน = KSL)
- **`SITE_YEAR`** → SSOT ปีเดียว (แก้จุดเดียวขึ้น 2027)

---

> ไฟล์นี้เป็น **SSOT ของ Asset/Ownership** — ห้าม duplicate ข้ามไฟล์ · อัปเดตเมื่อข้อตกลงกับ Operator ชัดเจน · ก่อนรื้อระบบใหญ่ ต้องอนุมัติ §3 + §6
