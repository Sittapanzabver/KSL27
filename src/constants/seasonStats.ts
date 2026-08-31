/**
 * สถิติฤดูกาล 2027 — Projected จากข้อมูลจริงฤดูกาล 2026
 * อิงจาก: 7 สโมสร, 14 matchdays, brand growth +15%
 */
export const SEASON = {
  totalLive: 315000,
  avgLivePerMatch: 22500,
  maxLive: 42000,
  maxLiveMd: "MD10",
  totalStadium: 10500,
  totalRevenue: 320000,
  matches: 14,
  clubs: 7,
  /** ปีที่แสดง (projected) */
  dataYear: 2027,
  /** ปีจริงที่เก็บข้อมูลอ้างอิง */
  baseYear: 2026,
};

export const matchData = [
  { md: "MD7", live: 20500, stadium: 750, revenue: 16000 },
  { md: "MD8", live: 14500, stadium: 900, revenue: 20000 },
  { md: "MD9", live: 4200, stadium: 700, revenue: 11500 },
  { md: "MD10", live: 42000, stadium: 520, revenue: 9500 },
  { md: "MD11", live: 12800, stadium: 680, revenue: 8000 },
  { md: "MD12", live: 33000, stadium: 450, revenue: 10500 },
];

export const maxLive = Math.max(...matchData.map((m) => m.live));
