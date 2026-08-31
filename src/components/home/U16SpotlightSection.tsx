import { Link } from "@tanstack/react-router";
import { SITE_YEAR } from "@/lib/site";

const U16_HERO_URL = "/u16-hero.jpg";

export function U16SpotlightSection() {
  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px]">
      {/* Full-bleed hero image */}
      <img
        src={U16_HERO_URL}
        alt="KSL Academy U-16 เยาวชนนักเตะโคราช"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
        }}
      />

      {/* Top-right sponsor badge */}
      <Link
        to="/sponsors"
        className="absolute top-6 right-6 bg-black/50 backdrop-blur border border-white/20 px-4 py-3 text-center"
      >
        <div className="text-[10px] font-black text-korat-gold tracking-widest">
          🎓 Academy Sponsor
        </div>
        <div className="text-xs text-white/60 mt-0.5">ร่วมสนับสนุนโครงการ</div>
      </Link>

      {/* Bottom-left content */}
      <div className="absolute bottom-0 left-0 p-8 md:p-12">
        {/* Eyebrow */}
        <div className="text-[10px] font-black tracking-[0.22em] text-korat-gold uppercase">
          KSL ACADEMY · SEASON {SITE_YEAR}
        </div>

        {/* Headline */}
        <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-none mt-3">
          ความฝัน
          <br />
          <span className="text-korat-gold">ของเด็กโคราช</span>
        </h2>

        {/* Sub */}
        <p className="text-sm text-white/70 mt-3">เยาวชนนักเตะจาก 7 อำเภอ · ฤดูกาล {SITE_YEAR}</p>

        {/* CTAs */}
        <div className="flex gap-3 mt-6">
          <Link
            to="/top-scorers"
            className="inline-flex items-center bg-korat-gold text-asphalt px-5 py-2.5 text-[11px] font-extrabold uppercase hover:brightness-110 transition-all"
          >
            ดาวซัลโว U-16 →
          </Link>
          <Link
            to="/standings"
            className="inline-flex items-center border border-white/40 text-white px-5 py-2.5 text-[11px] font-extrabold uppercase hover:bg-white/10 transition-all"
          >
            ตารางคะแนน U-16
          </Link>
        </div>
      </div>
    </section>
  );
}
