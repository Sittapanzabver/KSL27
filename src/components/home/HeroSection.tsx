import { Link } from "@tanstack/react-router";
import { ArrowRight, Users, Trophy, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { StatPill } from "./StatPill";
import GradientWaves from "@/components/GradientWaves/GradientWaves";
import { SITE_YEAR } from "@/lib/site";

const championNewsImg = "/ksl-champion-news.jpg";

const seasonHeroImg = "/cover-ksl-2027.jpg";

function HeroStat({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center md:items-start ${className}`}>
      <span className="font-stencil text-2xl md:text-3xl text-white tracking-wide leading-none">{value}</span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-concrete/60">{label}</span>
    </div>
  );
}

export function HeroSection({ news }: { news: any[] }) {
  const { t } = useI18n();

  return (
    <section className="relative bg-asphalt border-b-4 border-korat-red overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <GradientWaves
          horizonColor="#0a1628"
          waveColor="#cc0000"
          crestColor="#f0b429"
          speed={0.35}
          amplitude={2.2}
          waveScale={0.55}
          waveRatio={0.9}
          swell={30}
          turbulence={18}
          tilt={1.12}
          zoom={1.0}
          height={5.5}
          fogDepth={16}
          detail="low"
          brightness={0.9}
          opacity={0.5}
          mouseInteraction={true}
          parallaxStrength={0.4}
          grain={true}
          grainIntensity={0.04}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/40 to-asphalt/10" />
      </div>
      <div className="absolute inset-0 stadium-bg pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 0, transparent 8px)",
        }}
      />
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-korat-red/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[420px] h-[420px] rounded-full bg-korat-gold/10 blur-[140px] pointer-events-none" />

      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none">
        <img
          src={championNewsImg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-15 md:opacity-30 [mask-image:linear-gradient(to_left,#000_30%,transparent)] md:[mask-image:linear-gradient(to_left,#000_50%,transparent)]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-korat-red/25 via-transparent to-transparent mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8 justify-center md:justify-start">
          <span className="hero-glass inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em]">
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-korat-gold animate-ping opacity-70" />
              <span className="relative rounded-full bg-korat-gold size-2" />
            </span>
            Season {SITE_YEAR} · Coming Soon
          </span>
          <span className="hero-glass hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-concrete/80">
            <Trophy className="size-3 text-korat-gold" /> 7 Clubs · 32 Districts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-center text-center md:text-left">
          <div className="md:col-span-7 lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-korat-red" />
              <span className="font-display font-bold text-[11px] sm:text-xs uppercase tracking-[0.4em] text-korat-red">
                {t("home.matchday")}
              </span>
            </div>

            <h1 className="font-stencil hero-title text-[58px] sm:text-[88px] md:text-[112px] lg:text-[140px] leading-[0.85] tracking-[-0.01em] uppercase">
              <span className="block">Korat</span>
              <span className="block text-korat-red drop-shadow-[0_4px_30px_rgba(204,0,0,0.45)]">Super</span>
              <span className="block">League</span>
            </h1>

            <p className="mt-5 md:mt-6 text-xs sm:text-sm font-bold uppercase tracking-[0.45em] text-concrete/70">
              32 Districts · One League · Season {SITE_YEAR}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <Link
                to="/standings"
                className="group relative inline-flex items-center gap-2 bg-korat-red text-white px-6 py-3.5 font-bold uppercase text-xs tracking-[0.2em] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,0,0,0.65)] hover:-translate-y-0.5"
              >
                <span>{t("home.viewStandings")}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                to="/matches"
                className="group inline-flex items-center gap-2 border border-white/30 bg-white/5 backdrop-blur-sm text-white px-6 py-3.5 font-bold uppercase text-xs tracking-[0.2em] transition-all duration-300 hover:border-white hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <span>{t("sec.finalResults")}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>

            <div className="mt-8 hero-glass inline-flex flex-wrap items-center gap-5 sm:gap-7 px-5 py-3 rounded-md">
              <HeroStat value="7" label="Clubs" />
              <span className="w-px h-6 bg-white/15" />
              <HeroStat value="32" label="Districts" />
              <span className="w-px h-6 bg-white/15 hidden sm:block" />
              <HeroStat value="1" label="League" className="hidden sm:flex" />
            </div>
          </div>

          <div className="hidden md:block md:col-span-5 lg:col-span-5 relative">
            <div className="relative max-w-[420px] ml-auto">
              <div className="absolute -inset-8 rounded-[2.5rem] bg-korat-red/25 blur-3xl animate-pulse" />
              <div className="relative bg-gradient-to-b from-asphalt-deep to-asphalt rounded-2xl border border-white/10 p-3 shadow-2xl">
                <div className="flex items-center gap-3 mb-3 px-1">
                  <img
                    src="/ksl-logo-2027.jpg"
                    alt="KSL 2027"
                    className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/15 shadow-lg"
                  />
                  <div>
                    <div className="font-stencil text-3xl text-white tracking-[0.08em] leading-none">KSL · {SITE_YEAR}</div>
                    <div className="text-[9px] font-bold text-korat-gold tracking-[0.35em] uppercase mt-1.5">
                      Season Opener
                    </div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-white ring-1 ring-white/20 shadow-inner">
                  <img
                    src="/cover-ksl-2027.jpg"
                    alt={`Korat Super League ${SITE_YEAR}`}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-[9px] font-bold text-muted-foreground tracking-[0.3em] uppercase">
                  7 Clubs · 32 Districts · One League
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 flex items-end justify-between">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
            <span className="text-korat-red">●</span> Editor's Pick
          </h2>
          <Link
            to="/news"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-korat-red transition-colors"
          >
            ข่าวทั้งหมด <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-5" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <Link
            to="/clubs"
            className="lg:col-span-8 group relative block aspect-[16/10] md:aspect-[16/9] lg:aspect-auto lg:min-h-[520px] overflow-hidden rounded-lg border border-border bg-card lift-on-hover hover:border-korat-red"
          >
            <img
              src={seasonHeroImg}
              alt={`Korat Super League ${SITE_YEAR} กำลังจะเปิดฤดูกาล`}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-asphalt/50 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-korat-gold text-asphalt text-[10px] font-extrabold px-2 py-1 uppercase tracking-wider rounded">
                Season {SITE_YEAR}
              </span>
              <span className="bg-korat-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded">
                Season Preview
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-gold mb-3">
                Featured Story
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.92] mb-4">
                KSL {SITE_YEAR}<br />
                <span className="text-korat-red italic">เปิดฉาก</span>{" "}
                <span className="text-white/90">ฤดูกาลใหม่</span>
              </h2>
              <div className="flex items-center gap-5 mb-5">
                <div>
                  <span className="font-display text-2xl font-extrabold text-korat-red tabular-nums">7</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-concrete/60 ml-1.5">สโมสร</span>
                </div>
                <div className="border-l border-white/20 pl-5">
                  <span className="font-display text-2xl font-extrabold tabular-nums">32</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-concrete/60 ml-1.5">อำเภอ</span>
                </div>
                <div className="border-l border-white/20 pl-5">
                  <span className="font-display text-2xl font-extrabold tabular-nums">1</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-concrete/60 ml-1.5">ลีก</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-korat-red group-hover:gap-3 transition-all duration-300">
                สำรวจสโมสรทั้งหมด <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>

          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {(news.length ? news : Array.from({ length: 5 }))
              .slice(0, 5)
              .map((n: any, i: number) => {
                const placeholderImg = `https://picsum.photos/seed/ksl-news-${i}/240/160`;
                const inner = (
                  <>
                    <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden">
                      <img
                        src={n?.cover_url || placeholderImg}
                        alt={n?.title || "ข่าว"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-2.5 pr-3">
                      <span className="inline-block bg-korat-red/15 text-korat-red text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded mb-1.5">
                        {n?.category || "News"}
                      </span>
                      <h3 className="font-display text-sm font-extrabold leading-tight tracking-tight line-clamp-3 group-hover:text-korat-red transition-colors">
                        {n?.title || "ข่าวลีกล่าสุดจาก Korat Super League"}
                      </h3>
                    </div>
                  </>
                );
                const cls =
                  "group flex items-stretch gap-0 bg-card border border-border rounded-lg overflow-hidden min-h-[84px] lift-on-hover hover:border-korat-red";
                return n?.slug ? (
                  <Link
                    key={n.id}
                    to="/news/$slug"
                    params={{ slug: n.slug }}
                    className={cls}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={`placeholder-${i}`} className={cls}>
                    {inner}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/standings"
            className="bg-concrete text-asphalt px-5 py-2.5 font-bold uppercase text-xs tracking-wide hover:bg-korat-red hover:text-white transition-colors rounded-md card-shadow"
          >
            {t("home.viewStandings")}
          </Link>
          <Link
            to="/matches"
            className="border border-border bg-card text-foreground px-5 py-2.5 font-bold uppercase text-xs tracking-wide hover:border-korat-red hover:text-korat-red transition-colors rounded-md"
          >
            {t("sec.finalResults")}
          </Link>

          <div className="ml-auto flex items-center gap-1 flex-wrap justify-end">
            <StatPill icon={<Users className="size-3.5 text-muted-foreground" />} value="7" label="สโมสร" />
            <StatPill icon={<MapPin className="size-3.5 text-muted-foreground" />} value="32" label="อำเภอ" />
            <StatPill icon={<Trophy className="size-3.5 text-muted-foreground" />} value="1" label="ลีก" />
          </div>
        </div>
      </div>
    </section>
  );
}
