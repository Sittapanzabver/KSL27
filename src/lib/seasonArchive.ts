import season2025 from "@/assets/season-2025.jpg";
import season2024 from "@/assets/season-2024.jpg";
import { SITE_YEAR } from "@/lib/site";

export type ArchiveStanding = {
  pos: number;
  team: string;
  short: string;
  color: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form?: ("W" | "D" | "L")[];
};

export type SeasonFeatures = {
  liveCenter: boolean;
  news: boolean;
  topScorer: boolean;
  awards: boolean;
  venueMap: boolean;
  matchSchedule: boolean;
  dynamicStats: boolean;
};

export type ArchiveSeason = {
  year: number;
  title: string;
  cover: string;
  description: string;
  champion: string;
  topScorer?: { name: string; club: string; goals: number };
  mvp?: { name: string; club: string };
  matchdays: number;
  standings: ArchiveStanding[];
  archived: boolean;
  features: SeasonFeatures;
};

export const CURRENT_SEASON = Number(SITE_YEAR);

const ARCHIVED_FEATURES: SeasonFeatures = {
  liveCenter: false,
  news: false,
  topScorer: false,
  awards: false,
  venueMap: false,
  matchSchedule: false,
  dynamicStats: false,
};


export const SEASON_ARCHIVE: ArchiveSeason[] = [
  {
    year: 2025,
    title: "Korat Super League 2025",
    cover: season2025,
    description:
      "ฤดูกาล 2025 จบลงด้วยการคว้าแชมป์ของ ปักธงชัย ยูไนเต็ด ที่เก็บ 32 คะแนนนำจ่าฝูง รวม 14 นัดสุดเข้มข้น",
    champion: "ปักธงชัย ยูไนเต็ด",
    matchdays: 14,
    archived: true,
    features: ARCHIVED_FEATURES,
    standings: [
      { pos: 1, team: "ปักธงชัย ยูไนเต็ด", short: "PTC", color: "#1e3a8a", played: 14, won: 10, drawn: 2, lost: 2, gf: 28, ga: 13, gd: 15, points: 32, form: ["W","W","D","W","W"] },
      { pos: 2, team: "พิมาย เอฟซี", short: "PMI", color: "#dc2626", played: 14, won: 8, drawn: 5, lost: 1, gf: 35, ga: 11, gd: 24, points: 29, form: ["W","D","W","W","D"] },
      { pos: 3, team: "เสิงสาง ยูไนเต็ด", short: "SSU", color: "#16a34a", played: 14, won: 6, drawn: 5, lost: 3, gf: 34, ga: 24, gd: 10, points: 23, form: ["D","W","L","W","D"] },
      { pos: 4, team: "สุรนารี TVC เอฟซี", short: "TVC", color: "#7c3aed", played: 14, won: 6, drawn: 4, lost: 4, gf: 28, ga: 22, gd: 6, points: 22, form: ["W","L","D","W","L"] },
      { pos: 5, team: "ขามสะแกแสง เอฟซี", short: "KSS", color: "#ea580c", played: 14, won: 5, drawn: 3, lost: 6, gf: 24, ga: 30, gd: -6, points: 18, form: ["L","W","D","L","W"] },
      { pos: 6, team: "ยูเนี่ยน โคราช", short: "UKR", color: "#2563eb", played: 14, won: 4, drawn: 2, lost: 8, gf: 18, ga: 30, gd: -12, points: 14, form: ["L","L","W","D","L"] },
      { pos: 7, team: "GSL ธารปราสาทเพชร เอฟซี", short: "GSL", color: "#65a30d", played: 14, won: 3, drawn: 1, lost: 10, gf: 19, ga: 39, gd: -20, points: 10, form: ["L","L","L","W","L"] },
      { pos: 8, team: "เพชรน้ำหนึ่ง หนองบุญมาก ยูไนเต็ด", short: "PNN", color: "#7f1d1d", played: 14, won: 3, drawn: 0, lost: 11, gf: 17, ga: 34, gd: -17, points: 9, form: ["L","W","L","L","L"] },
    ],
  },
  {
    year: 2024,
    title: "Korat Super League 2024",
    cover: season2024,
    description:
      "ฤดูกาลแรกของลีก เสิงสาง ยูไนเต็ด ผงาดคว้าแชมป์สมัยแรกอย่างยิ่งใหญ่ รวม 10 นัดของการแข่งขัน",
    champion: "เสิงสาง ยูไนเต็ด",
    matchdays: 10,
    archived: true,
    features: ARCHIVED_FEATURES,
    standings: [
      { pos: 1, team: "เสิงสาง ยูไนเต็ด", short: "SSU", color: "#16a34a", played: 10, won: 7, drawn: 2, lost: 1, gf: 0, ga: 0, gd: 18, points: 23, form: ["W","W","W","D","W"] },
      { pos: 2, team: "ยูเนี่ยน โคราช", short: "UKR", color: "#2563eb", played: 10, won: 5, drawn: 3, lost: 2, gf: 0, ga: 0, gd: 12, points: 18, form: ["W","D","W","W","D"] },
      { pos: 3, team: "ปักธงชัย ยูไนเต็ด", short: "PTC", color: "#1e3a8a", played: 10, won: 4, drawn: 4, lost: 2, gf: 0, ga: 0, gd: 3, points: 16, form: ["D","W","D","W","L"] },
      { pos: 4, team: "ขามสะแกแสง เอฟซี", short: "KSS", color: "#ea580c", played: 10, won: 3, drawn: 3, lost: 4, gf: 0, ga: 0, gd: -4, points: 12, form: ["L","D","W","L","D"] },
      { pos: 5, team: "ด่านเกวียน เอฟซี", short: "DKW", color: "#b45309", played: 10, won: 2, drawn: 1, lost: 7, gf: 0, ga: 0, gd: -5, points: 7, form: ["L","L","W","L","L"] },
      { pos: 6, team: "ธารปราสาทเพชร เอฟซี", short: "GSL", color: "#65a30d", played: 10, won: 2, drawn: 1, lost: 7, gf: 0, ga: 0, gd: -20, points: 7, form: ["L","L","L","W","L"] },
    ],
  },
];

export function getSeason(year: number) {
  return SEASON_ARCHIVE.find((s) => s.year === year);
}
