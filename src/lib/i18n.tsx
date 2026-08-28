import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SITE_YEAR } from "@/lib/site";

export type Lang = "th" | "en";

const dict = {
  // Header / nav
  "nav.home": { th: "หน้าแรก", en: "Home" },
  "nav.standings": { th: "ตารางคะแนน", en: "Standings" },
  "nav.matches": { th: "​ผลการแข่งขัน", en: "Matches" },
  "nav.clubs": { th: "สโมสร", en: "Clubs" },
  "nav.players": { th: "ดาวซัลโว", en: "Top Scorers" },
  "nav.build": { th: "สร้าง KSL", en: "Build" },
  "nav.squads": { th: "นักเตะ", en: "Players" },
  "nav.clubsAndSquads": { th: "สโมสร & นักเตะ", en: "Clubs & Players" },
  "home.mainSponsor": { th: "สปอนเซอร์หลัก", en: "Main Sponsor" },
  "nav.competition": { th: "การแข่งขัน", en: "Competition" },
  "nav.news": { th: "ข่าวสาร", en: "News" },
  "nav.sponsors": { th: "สปอนเซอร์", en: "Sponsors" },
  "nav.fanRegister": { th: "ลงทะเบียนแฟนบอล", en: "Fan Register" },
  "nav.signin": { th: "เข้าสู่ระบบ", en: "Sign in" },
  "nav.signout": { th: "ออกจากระบบ", en: "Sign out" },

  // Home hero
  "home.matchday": { th: `เปิดฤดูกาล ${SITE_YEAR} · กำลังเตรียมโปรแกรมการแข่งขัน`, en: `Season ${SITE_YEAR} · Fixtures Coming Soon` },
  "home.heroDesc": {
    th: "พร้อมลุยศึก Korat Super League ฤดูกาล 2027\n7 สโมสร · 32 อำเภอ · หนึ่งลีกของคนโคราช",
    en: "Get ready for Korat Super League 2027\n7 clubs · 32 districts · one league for Korat.",
  },
  "home.champLabel": { th: `Korat Super League ${SITE_YEAR}`, en: `Korat Super League ${SITE_YEAR}` },
  "home.champTeam": { th: "รอติดตามทีมแชมป์ 2027", en: "Champions TBD" },
  "home.playoff": { th: "เพลย์ออฟ", en: "Play-off" },
  "home.champBadge": { th: "แชมป์", en: "Champion" },

  // Awards
  "awards.title": { th: `รางวัลประจำฤดูกาล ${SITE_YEAR}`, en: `Season ${SITE_YEAR} Awards` },
  "awards.kicker": { th: "Season Awards", en: "Season Awards" },
  "awards.championLabel": { th: "แชมป์ลีก", en: "League Champion" },
  "awards.championTeam": { th: "รอประกาศ", en: "TBA" },
  "awards.championDesc": { th: "จะประกาศเมื่อจบฤดูกาล", en: "To be announced at season end" },
  "awards.coachLabel": { th: "โค้ชยอดเยี่ยม", en: "Best Coach" },
  "awards.coachName": { th: "รอประกาศ", en: "TBA" },
  "awards.coachDesc": { th: "จะประกาศเมื่อจบฤดูกาล", en: "To be announced at season end" },
  "awards.devLabel": { th: "ดาวซัลโวประจำลีก", en: "League Top Scorer" },
  "awards.devName": { th: "รอประกาศ", en: "TBA" },
  "awards.devDesc": { th: "จะประกาศเมื่อจบฤดูกาล", en: "To be announced at season end" },
  "awards.playoffNote": { th: "หมายเหตุ: รายละเอียดรอบเพลย์ออฟจะประกาศเมื่อเปิดฤดูกาล", en: "Note: Play-off details to be announced at season start." },
  "home.cumulativeViews": { th: "ยอดวิวสะสม", en: "Cumulative Views" },
  "home.viewStandings": { th: "ดูตารางคะแนน", en: "View Standings" },
  "home.viewFixtures": { th: "​ผลการแข่งขัน", en: "Fixtures" },
  "home.motw": { th: "นัดสุดท้ายของฤดูกาล", en: "Final Match of the Season" },

  // Sections
  "sec.standings": { th: "ตารางคะแนน", en: "League Table" },
  "sec.viewAll": { th: "ดูทั้งหมด", en: "View all" },
  "sec.upcoming": { th: "โปรแกรมถัดไป", en: "Upcoming" },
  "sec.recent": { th: "ผลล่าสุด", en: "Recent results" },
  "sec.finalResults": { th: "ผลการแข่งขัน (รอบสุดท้าย)", en: "Final Match Results" },
  "sec.all": { th: "ทั้งหมด", en: "All" },
  "sec.news": { th: "ข่าวสารล่าสุด", en: "Latest News" },
  "sec.viewAllNews": { th: "ดูข่าวทั้งหมด", en: "View all news" },
  "sec.partners": { th: "พันธมิตรอย่างเป็นทางการ", en: "Official Partners" },

  // Table headers
  "tbl.rank": { th: "#", en: "#" },
  "tbl.club": { th: "สโมสร", en: "Club" },
  "tbl.played": { th: "แข่ง", en: "P" },
  "tbl.won": { th: "ช", en: "W" },
  "tbl.drawn": { th: "ส", en: "D" },
  "tbl.lost": { th: "พ", en: "L" },
  "tbl.points": { th: "แต้ม", en: "Pts" },
} as const;

type Key = keyof typeof dict;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("ksl-lang") as Lang | null) : null;
    if (saved === "th" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ksl-lang", l);
  };

  const t = (key: Key) => dict[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`inline-flex items-center border border-white/15 rounded-md overflow-hidden text-[10px] font-bold tracking-widest uppercase ${className}`}>
      <button
        onClick={() => setLang("th")}
        className={`px-2.5 py-1.5 transition-colors ${lang === "th" ? "bg-korat-red text-white" : "text-muted-foreground hover:text-white"}`}
        aria-label="ภาษาไทย"
        aria-pressed={lang === "th"}
      >
        TH
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 transition-colors ${lang === "en" ? "bg-korat-red text-white" : "text-muted-foreground hover:text-white"}`}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}