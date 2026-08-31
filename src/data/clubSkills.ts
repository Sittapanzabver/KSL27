/**
 * Club Skills Data — SSOT สำหรับ Skill Landing Page
 * ข้อมูลทักษะ/จุดแข็งของแต่ละสโมสร (hardcode ใน frontend)
 *
 * ⚠️ ข้อมูลนี้เป็น placeholder — ต้องอัปเดตเมื่อ owner ยืนยันข้อมูลจริง
 */

export interface ClubSkill {
  /** สไตล์การเล่นหลัก */
  style: string;
  /** จุดแข็ง 3-5 ข้อ */
  strengths: string[];
  /** จุดอ่อนที่ต้องพัฒนา */
  weaknesses?: string[];
  /** แท็คติกเด่น */
  tactics: string;
  /** สีสำหรับ display */
  accentColor?: string;
}

export const CLUB_SKILLS: Record<string, ClubSkill> = {
  "soengsang-united": {
    style: "Possession-based",
    strengths: [
      "ครองบอลแน่น คุมจังหวะเกม",
      "กองกลางสร้างสรรค์เกมเก่ง",
      "เล่นบอลสั้น combinations ดี",
      "ตั้งรับเป็นทีม รูปร่างแน่น",
    ],
    tactics: "4-3-3 / 4-2-3-1 — เน้น possession แล้วเจาะทางริมเส้น",
    accentColor: "#1a5276",
  },
  "nondaeng-fc": {
    style: "Counter-attack",
    strengths: ["สวนกลับเร็วอันตราย", "ปีกความเร็วสูง", "เกมรับเหนียวแน่น", "ลูกตั้งเตะอันตราย"],
    tactics: "5-4-1 / 4-5-1 — ตั้งรับลึกแล้วสวนกลับเร็ว",
    accentColor: "#c0392b",
  },
  "pakthongchai-united": {
    style: "High-pressing",
    strengths: [
      "Pressing สูงแย่งบอลเร็ว",
      "พลังงานสูงวิ่งไม่มีหมด",
      "เกมรุกกดดันต่อเนื่อง",
      "ทีมเวิร์คดีเล่นเป็นกลุ่ม",
    ],
    tactics: "4-3-3 — High press แล้วจบสกอร์เร็ว",
    accentColor: "#27ae60",
  },
  "khonburi-fc": {
    style: "Physical & Direct",
    strengths: [
      "ร่างกายแข็งแกร่งดวลบอล אוויר",
      "ไดเรก塆ลเล่นบอลยาว",
      "เกมรับแข็งแกร่ง",
      "จิตใจนักสู้ไม่ยอมแพ้",
    ],
    tactics: "4-4-2 — เน้นความแข็งแกร่งและไดเรก塆ล",
    accentColor: "#f39c12",
  },
  "suranaree-fc": {
    style: "Technical & Creative",
    strengths: ["นักเตะ技術สูง", "สร้างสรรค์โอกาสเก่ง", "เล่นบอลภาคพื้นดี", "พลิกแพลงเก่ง"],
    tactics: "4-2-3-1 — เน้น技術และความคิดสร้างสรรค์",
    accentColor: "#8e44ad",
  },
  "union-korat": {
    style: "Balanced & Organized",
    strengths: ["สมดุลทั้งเกมรุกรับ", "ระเบียบวินัยสูง", "ปรับแท็คติกตามคู่แข่ง", "ทีมเวิร์คดี"],
    tactics: "4-4-2 / 3-5-2 — ยืดหยุ่นปรับตามสถานการณ์",
    accentColor: "#2c3e50",
  },
  "khamsakaesaeng-fc": {
    style: "Youth & Energy",
    strengths: [
      "ทีมพลังหนุ่มวิ่งไม่มีหมด",
      "ความหิวกระหายสูง",
      "ปรับตัวเข้ากับเกมเร็ว",
      "สปิริตทีมยอดเยี่ยม",
    ],
    tactics: "4-3-3 — ใช้ความสดและความเร็ว",
    accentColor: "#e74c3c",
  },
};

/**
 * Radar chart data สำหรับเปรียบเทียบสโมสร
 * ค่า 0-100 สำหรับแต่ละ dimension
 */
export interface ClubRadarData {
  possession: number;
  pressing: number;
  counterAttack: number;
  setPieces: number;
  defense: number;
  creativity: number;
}

export const CLUB_RADAR_DATA: Record<string, ClubRadarData> = {
  "soengsang-united": {
    possession: 78,
    pressing: 65,
    counterAttack: 55,
    setPieces: 60,
    defense: 72,
    creativity: 75,
  },
  "nondaeng-fc": {
    possession: 45,
    pressing: 50,
    counterAttack: 85,
    setPieces: 80,
    defense: 78,
    creativity: 55,
  },
  "pakthongchai-united": {
    possession: 60,
    pressing: 88,
    counterAttack: 65,
    setPieces: 55,
    defense: 68,
    creativity: 60,
  },
  "khonburi-fc": {
    possession: 42,
    pressing: 55,
    counterAttack: 70,
    setPieces: 85,
    defense: 82,
    creativity: 45,
  },
  "suranaree-fc": {
    possession: 72,
    pressing: 58,
    counterAttack: 60,
    setPieces: 50,
    defense: 62,
    creativity: 88,
  },
  "union-korat": {
    possession: 65,
    pressing: 70,
    counterAttack: 68,
    setPieces: 65,
    defense: 75,
    creativity: 68,
  },
  "khamsakaesaeng-fc": {
    possession: 55,
    pressing: 75,
    counterAttack: 78,
    setPieces: 50,
    defense: 58,
    creativity: 62,
  },
};
