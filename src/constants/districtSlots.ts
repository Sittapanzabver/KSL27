export type DistrictSlot = {
  name: string;
  x: number;
  y: number;
  clubSlugs?: string[];
};

export const DISTRICT_SLOTS: DistrictSlot[] = [
  { name: "เมืองนครราชสีมา", x: 45, y: 52, clubSlugs: ["union-korat", "suranaree-fc"] },
  { name: "ปากช่อง", x: 19, y: 55 },
  { name: "สีคิ้ว", x: 31, y: 54 },
  { name: "สูงเนิน", x: 37, y: 55 },
  { name: "ขามทะเลสอ", x: 40, y: 50 },
  { name: "โนนสูง", x: 51, y: 47 },
  { name: "โนนไทย", x: 46, y: 39 },
  { name: "พระทองคำ", x: 37, y: 35 },
  { name: "ด่านขุนทด", x: 27, y: 30 },
  { name: "เทพารักษ์", x: 28, y: 18 },
  { name: "ขามสะแกแสง", x: 56, y: 28, clubSlugs: ["khamsakaesaeng-fc"] },
  { name: "บัวใหญ่", x: 59, y: 16 },
  { name: "บัวลาย", x: 66, y: 12 },
  { name: "สีดา", x: 65, y: 20 },
  { name: "ประทาย", x: 72, y: 26 },
  { name: "เมืองยาง", x: 79, y: 21 },
  { name: "ลำทะเมนชัย", x: 78, y: 32 },
  { name: "ชุมพวง", x: 82, y: 41 },
  { name: "พิมาย", x: 65, y: 43, clubSlugs: ["phimai-fc"] },
  { name: "ห้วยแถลง", x: 70, y: 55 },
  { name: "จักราช", x: 58, y: 57 },
  { name: "เฉลิมพระเกียรติ", x: 51, y: 55 },
  { name: "โชคชัย", x: 50, y: 66 },
  { name: "หนองบุนนาก", x: 58, y: 70 },
  { name: "เสิงสาง", x: 63, y: 82, clubSlugs: ["soengsang-united"] },
  { name: "ครบุรี", x: 48, y: 84, clubSlugs: ["khonburi-fc"] },
  { name: "ปักธงชัย", x: 38, y: 73, clubSlugs: ["pakthongchai-united"] },
  { name: "วังน้ำเขียว", x: 30, y: 78 },
  { name: "แก้งสนามนาง", x: 51, y: 13 },
  { name: "บ้านเหลื่อม", x: 49, y: 22 },
  { name: "คง", x: 57, y: 22 },
  { name: "โนนแดง", x: 70, y: 16, clubSlugs: ["nondaeng-fc"] },
];
