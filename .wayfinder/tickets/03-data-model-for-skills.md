# Ticket: Data Model for Skills

**Type:** Research (AFK)
**Status:** Open
**Blocking:** 01-skill-landing-page-scope
**Labels:** wayfinder:research

---

## Question

ข้อมูลไหนใน DB ปัจจุบันรองรับ skill展示 ได้แล้วบ้าง และต้องเพิ่มอะไร?

**สิ่งที่มีอยู่แล้ว:**
- `clubs` table: name, short_name, slug, primary_color, logo_url, home_venue, founded_year, description, history, district
- `players` table: name, position, jersey_number, goals, assists, category (senior/u16)
- `matches` table: home/away club, scores, status, matchweek
- `club_history` table: historical data, achievements (JSON)
- `club_seasons` table: seasonal display overrides

**สิ่งที่ต้อง investigate:**
1. `club_history` table มี field อะไรบ้าง? achievements JSON มีรูปแบบอะไร?
2. `players` table มี stats อะไรบ้างนอกจาก goals/assists?
3. มี table ไหนเกี่ยวกับ "skills" หรือ "highlights" อยู่แล้วไหม?
4. RLS policies บน tables เหล่านี้เป็นอย่างไร? browser client อ่านได้ไหม?

## Resolution

*รอ research*
