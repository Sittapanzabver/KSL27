import { SEASON, matchData, maxLive } from "@/constants/seasonStats";
import { SectionHeader } from "./SectionHeader";
import { SITE_YEAR } from "@/lib/site";


export function MediaMetricsSection() {
  const cards = [
    {
      n: `${SEASON.totalLive.toLocaleString()}+`,
      l: "ผู้ชมไลฟ์สดสะสม",
      s: `ครบ ${SEASON.matches} แมตช์เดย์`,
      accent: true,
      tag: "Reach",
    },
    {
      n: SEASON.avgLivePerMatch.toLocaleString(),
      l: "ผู้ชมออนไลน์เฉลี่ย/นัด",
      s: "ค่าเฉลี่ยทั้งฤดูกาล",
      accent: false,
      tag: "Average",
    },
    {
      n: SEASON.maxLive.toLocaleString(),
      l: "ไลฟ์สดสูงสุด 1 นัด",
      s: `Match Day ${SEASON.maxLiveMd.replace("MD", "")}`,
      accent: true,
      tag: "Peak",
    },
    {
      n: SEASON.totalStadium.toLocaleString(),
      l: "ผู้ชมในสนามสะสม",
      s: `เฉลี่ย ${Math.round(SEASON.totalStadium / SEASON.matches).toLocaleString()} คน/นัด`,
      accent: false,
      tag: "On-Site",
    },
    {
      n: `฿${SEASON.totalRevenue.toLocaleString()}`,
      l: "รายได้รวม",
      s: "บัตร + ของที่ระลึก",
      accent: true,
      tag: "Revenue",
    },
    {
      n: `${SEASON.clubs}`,
      l: "สโมสรในลีก",
      s: "ครอบคลุมทั่วโคราช",
      accent: false,
      tag: "Network",
    },
  ];

  return (
    <section>
      <SectionHeader
        kicker="01 · Media Value"
        title="ตัวเลขที่สปอนเซอร์มองหา"
        sub="Reach, exposure, and engagement — ทุกตัวเลขเก็บจริงจากยอดสะสมของลีกและสถิติฤดูกาลที่ผ่านมา"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.l}
            className={`relative border p-5 md:p-6 group transition-colors ${
              c.accent
                ? "border-korat-red/40 bg-korat-red/[0.06] hover:border-korat-red/70"
                : "border-border bg-card hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[9px] font-black tracking-[0.18em] uppercase ${
                  c.accent ? "text-korat-red" : "text-muted-foreground"
                }`}
              >
                {c.tag}
              </span>
              <div
                className={`h-px w-8 ${
                  c.accent ? "bg-korat-red/60" : "bg-border"
                }`}
              />
            </div>
            <div
              className={`text-3xl md:text-4xl font-black tracking-tight leading-none tabular-nums ${
                c.accent ? "text-korat-red" : "text-foreground"
              }`}
            >
              {c.n}
            </div>
            <div className="text-[11px] font-bold tracking-[0.12em] text-foreground/80 uppercase mt-3">
              {c.l}
            </div>
            <div className="text-[11px] text-muted-foreground/60 mt-1 leading-snug">
              {c.s}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
              Live Viewership by Matchday
            </p>
            <h4 className="text-lg font-black tracking-tight text-foreground mt-1">
              ผู้ชมไลฟ์สดรายแมตช์เดย์
            </h4>
          </div>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Source · KSL Official Stream
          </span>
        </div>
        <div className="flex items-end gap-2 md:gap-4 h-40">
          {matchData.map((m) => {
            const pct = Math.round((m.live / maxLive) * 100);
            const isMax = m.live === maxLive;
            return (
              <div key={m.md} className="flex-1 flex flex-col items-center gap-2">
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    isMax ? "text-korat-red" : "text-muted-foreground"
                  }`}
                >
                  {m.live >= 1000
                    ? `${(m.live / 1000).toFixed(1)}K`
                    : m.live}
                </span>
                <div className="w-full flex items-end" style={{ height: "110px" }}>
                  <div
                    className={`w-full transition-all ${
                      isMax
                        ? "bg-korat-red"
                        : "bg-gradient-to-t from-muted-foreground/10 to-muted-foreground/30"
                    }`}
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isMax ? "text-korat-red" : "text-muted-foreground"
                  }`}
                >
                  {m.md}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-korat-red" />
            <span className="text-[11px] text-muted-foreground">
              Peak · MD10 · 38,100 viewers · สูงสุดในประวัติศาสตร์ KSL
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-korat-red uppercase">
            +94% vs 2024
          </span>
        </div>
      </div>
    </section>
  );
}
