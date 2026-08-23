# KSL Web App — Project Context

## Tech Stack

- Framework: TanStack Router (file-based routing)
- Backend: Supabase (project ID: qzksqhlrkpqnbavjpieq)
- Hosted: koratsuperleague.lovable.app

## Season 2027 (อัปเดต 22/08/2026)

- `SITE_YEAR` ใน `src/lib/site.ts` = 2027 (SSOT ปีที่แสดง)
- ฤดูกาล 2027 ยังไม่มีผลแข่ง — เตรียมโครงสร้างใน `supabase/seed_2027_structure.sql` (ยังไม่รัน)
- Season 2027 id: `7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d`
- Divisions 2027 (ตรงกับ `src/lib/divisions.ts`): Super League `bd770ed0-2027-47e0-ab34-901a151e9f7c` · U-16 `11111111-2027-4016-8000-000000000016`

## Database — Key UUIDs

### Seasons
- 2027: 7f3c9a2e-2027-4b8d-a1c4-9e5f6a7b8c9d (active — หลังรัน seed)
- 2026 Super League: 423c1997-b247-4db6-ac40-7b01ca536b1d
- 2025 Super League: c7a564ea-7656-4393-8289-b47d0fec56ee
- 2024 Super League: bbdce67d-0e12-4d2b-8745-309aeb405f68

### Divisions
- Super League (tier 1, 2027): bd770ed0-2027-47e0-ab34-901a151e9f7c
- U-16 (tier 2, 2027): 11111111-2027-4016-8000-000000000016

### Clubs
- ครบุรี เอฟซี (KBR):        5ea7ea7e-735f-41e4-913d-1e292b30e6ff
- พิมาย เอฟซี (PMI):         967aaca4-0575-4b74-99ab-3b5c97e8892d
- สุรนารี เอฟซี (SNR):       b2e5a0cc-fec1-40ae-94f1-f2260785c6b2
- ขามสะแกแสง เอฟซี (KSK):   6d429ad1-26af-4b48-bf3c-33b0899b8d74
- ยูเนี่ยน โคราช (UKR):      4fd42b79-ece9-4dc6-936e-3e59d9f58bb1
- ปักธงชัย ยูไนเต็ด (PTU):   6ffe59ba-cb62-483e-b085-decde56c2a38

## Database — Schema Notes

- matches.status: ใช้ 'completed' (ไม่ใช่ 'finished')
- matches.kickoff_at: timestamp with timezone (UTC+7)
- matches.matchweek: NOT NULL integer
- matches.division_id: foreign key to divisions
- matches.season_id: foreign key to seasons
- goal_difference in standings: generated column (ห้าม UPDATE ตรงๆ)
- top_scorers: ใช้ club_code (string) ไม่ใช่ club_id (UUID)
- top_scorers.category: 'senior' หรือ 'U16'
- top_scorers.season: integer (เช่น 2026)

## Frontend — Key Behaviors

- Default division เมื่อโหลดหน้า matches/standings: tier = 1 เสมอ
- Tab "ผลการแข่งขัน": filter status === 'completed'
- Tab "นัดหมาย": filter status !== 'completed'
- Score display: แสดงเมื่อ status === 'completed' เท่านั้น
- Sheet scorers: match ด้วย normalize(team name) กับ division ปัจจุบัน

## Data Summary

- ชุดใหญ่: 56 matches, 8 clubs, season 2026
- U-16: 30 matches, 6 clubs, matchweek 1-13, season 2026
- top_scorers U-16: 58 records (category = 'U16')

## Known Issues Fixed

- status 'finished' → เปลี่ยนเป็น 'completed' ทั้งหมดแล้ว
- standings คำนวณด้วย manual UPDATE (ไม่มี trigger)
- goal_difference เป็น generated column ห้ามใส่ใน UPDATE SET
