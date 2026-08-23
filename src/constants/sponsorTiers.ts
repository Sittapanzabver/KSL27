export const CONTACT_URL = "https://www.facebook.com/KoratSuperLeague";

export const teams = [
  { name: "เสิงสาง ยูไนเต็ด", code: "SUTD" },
  { name: "โนนแดง เอฟซี", code: "NDFC" },
  { name: "พิมาย เอฟซี", code: "PMFC" },
  { name: "ปักธงชัย ยูไนเต็ด", code: "PUTD" },
  { name: "สุรนารี เอฟซี", code: "SNFC" },
  { name: "ยูเนี่ยน โคราช", code: "UNKR" },
  { name: "ขามสะแกแสง เอฟซี", code: "KSFC" },
  { name: "ครบุรี เอฟซี", code: "KBFC" },
];

export type SponsorTier = {
  name: string;
  nameEn: string;
  tagline: string;
  highlight: boolean;
  perks: string[];
  inactive: string[];
};

export const tiers: SponsorTier[] = [
  {
    name: "TITLE SPONSOR",
    nameEn: "Title",
    tagline: "Maximum exposure · ทุกจุดสัมผัสของลีก",
    highlight: true,
    perks: [
      "โลโก้บน Header ทุกหน้าเว็บไซต์",
      "แบนเนอร์หลัก Homepage",
      "พิธีกรกล่าวชื่อทุกนัดการแข่งขัน",
      "โพสต์ Social Media ทุกนัด",
      "รายงานสถิติ Exposure รายเดือน",
      "ป้ายสนามและสื่อออนไลน์",
    ],
    inactive: [],
  },
  {
    name: "GOLD SPONSOR",
    nameEn: "Gold",
    tagline: "การมองเห็นต่อเนื่องทั้งฤดูกาล",
    highlight: false,
    perks: [
      "โลโก้บน Footer ทุกหน้าเว็บไซต์",
      "แบนเนอร์หน้าตารางคะแนน",
      "กล่าวถึงใน Social Media",
    ],
    inactive: ["โพสต์ dedicated ทุกนัด", "รายงานสถิติรายเดือน"],
  },
  {
    name: "SILVER SPONSOR",
    nameEn: "Silver",
    tagline: "จุดเริ่มต้นสำหรับธุรกิจท้องถิ่น",
    highlight: false,
    perks: ["โลโก้หน้า Sponsors", "กล่าวถึงใน Social Media"],
    inactive: ["แบนเนอร์ในเว็บไซต์", "โพสต์ dedicated", "รายงานสถิติ"],
  },
];
