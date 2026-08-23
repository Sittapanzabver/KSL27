import { SEASON } from "@/constants/seasonStats";
import { SITE_YEAR } from "@/lib/site";


export function SponsorHero() {
  return (
    <section className="relative bg-asphalt-deep overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 59px,#fff 59px,#fff 60px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 59px,#fff 59px,#fff 60px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 80% 20%, rgba(204,0,0,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(204,0,0,0.12), transparent 60%)",
        }}
      />
      <div
        className="absolute -right-24 top-0 h-full w-72 bg-korat-red opacity-10"
        style={{ transform: "skewX(-12deg)" }}
      />
      <div
        className="absolute -right-10 top-0 h-full w-20 bg-korat-red opacity-25"
        style={{ transform: "skewX(-12deg)" }}
      />
      <div className="absolute right-4 bottom-0 text-[120px] md:text-[220px] font-black text-white/[0.045] leading-none pointer-events-none select-none tracking-tighter">
        KSL
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-10 bg-korat-red" />
          <span className="text-[10px] font-bold tracking-[0.24em] text-korat-red uppercase">
            Sponsorship Media Kit · Season {SITE_YEAR}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] text-white mb-6">
          BE PART OF
          <br />
          <span className="text-korat-red">KORAT&apos;S GAME.</span>
        </h1>
        <p className="text-base md:text-lg text-white/65 max-w-2xl leading-relaxed mb-12">
          ลีกฟุตบอลชุมชนที่เข้าถึงคนโคราชมากที่สุดในรอบหลายปี · {SEASON.matches} แมตช์เดย์ · {SEASON.clubs} สโมสรทั่วจังหวัด
          <br />
          <span className="text-white/40">
            Meinhard Sports · Korat Super League {SITE_YEAR}
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 backdrop-blur-sm">
          {[
            { n: "275K+", l: "Live Viewers", s: "ผู้ชมไลฟ์สดสะสมตลอดฤดูกาล" },
            { n: "38.1K", l: "Peak Single Match", s: "ยอดไลฟ์สูงสุด · Match Day 10" },
            { n: "8 / 14", l: "Clubs / Matchdays", s: "ครอบคลุมทั่วจังหวัดนครราชสีมา" },
          ].map((item, i) => (
            <div
              key={item.l}
              className="bg-asphalt-deep/90 px-5 py-6 md:px-7 md:py-8 relative group"
            >
              {i === 0 && (
                <span className="absolute top-3 right-3 text-[8px] font-black tracking-[0.18em] text-korat-red uppercase">
                  ● Live
                </span>
              )}
              <div className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none tabular-nums">
                {item.n}
              </div>
              <div className="text-[10px] text-korat-red font-bold tracking-[0.18em] uppercase mt-3">
                {item.l}
              </div>
              <div className="text-[11px] text-white/40 mt-1 leading-snug">
                {item.s}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] tracking-[0.18em] uppercase text-white/40 font-bold">
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-korat-red" /> Official League
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-white/60" /> Community-Driven
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-white/60" /> Live-Streamed Every Matchday
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-white/60" /> Korat-Wide Reach
          </span>
        </div>
      </div>
    </section>
  );
}
