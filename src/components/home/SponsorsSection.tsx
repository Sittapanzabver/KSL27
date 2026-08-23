import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE_YEAR } from "@/lib/site";

export function SponsorsSection({ sponsors }: { sponsors: any[] }) {
  const { t } = useI18n();
  const titleSponsors = sponsors.filter((s) => s.tier === "title");
  const otherSponsors = sponsors.filter((s) => s.tier !== "title");

  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] bg-gradient-to-b from-asphalt-deep via-[#070b14] to-asphalt-deep">
      {/* Ambient radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-korat-red/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
        {/* Centered header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-4 w-full max-w-md mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-black tracking-[0.28em] text-korat-red uppercase shrink-0">
              Official Partners · KSL {SITE_YEAR}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-transparent" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            {t("sec.partners")}
          </h2>
          <Link
            to="/sponsors"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-korat-red flex items-center gap-1.5 transition-colors mt-2"
          >
            {t("sec.viewAll")} <ArrowRight className="size-3" />
          </Link>
        </div>

        {titleSponsors.length > 0 && (
          <div className="mb-6">
            {titleSponsors.map((s) => (
              <a
                key={s.id}
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7 transition-all duration-300 hover:scale-[1.01] hover:border-korat-red/30 hover:shadow-[0_0_25px_rgba(239,68,68,0.08)] block"
              >
                <div className="relative flex items-center gap-5">
                  <span className="inline-block text-[9px] font-black tracking-[0.2em] bg-korat-red text-white px-2.5 py-1 uppercase shrink-0">
                    Title Sponsor
                  </span>
                  <span className="font-display text-xl md:text-2xl font-extrabold tracking-tight group-hover:text-korat-red transition-colors">
                    {s.name}
                  </span>
                </div>
                <div className="relative w-36 h-14 flex items-center justify-center shrink-0">
                  {s.logo_url ? (
                    <img
                      src={s.logo_url}
                      alt={s.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                      {s.name}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {otherSponsors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {otherSponsors.map((s) => (
              <a
                key={s.id}
                href={s.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center overflow-hidden rounded-xl border bg-white/[0.02] backdrop-blur-sm p-5 aspect-[3/2] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(239,68,68,0.08)]
                ${
                  s.tier === "gold"
                    ? "border-yellow-600/20 hover:border-yellow-500/50"
                    : "border-white/[0.05] hover:border-korat-red/30"
                }`}
              >
                {s.tier === "gold" && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-500/60" />
                )}
                {s.logo_url ? (
                  <img
                    src={s.logo_url}
                    alt={s.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="font-display font-bold text-center text-sm leading-tight text-muted-foreground group-hover:text-korat-red transition-colors">
                    {s.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}

        {sponsors.length === 0 && (
          <div className="border border-dashed border-white/[0.08] rounded-xl p-12 text-center bg-white/[0.02] backdrop-blur-sm">
            <p className="text-[11px] text-muted-foreground/50 tracking-wide">
              กำลังเปิดรับพันธมิตรอย่างเป็นทางการสำหรับ KSL {SITE_YEAR}
            </p>
            <Link
              to="/sponsors"
              className="inline-block mt-4 text-[11px] font-bold tracking-widest uppercase text-korat-red hover:underline"
            >
              ดูแพ็กเกจสปอนเซอร์ →
            </Link>
          </div>
        )}

        {sponsors.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/[0.05] rounded-xl bg-white/[0.02] backdrop-blur-sm px-6 py-5">
            <p className="text-[11px] text-muted-foreground/60 text-center sm:text-left">
              สนใจเป็นพันธมิตรอย่างเป็นทางการกับ KSL {SITE_YEAR}?
            </p>
            <Link
              to="/sponsors"
              className="text-[11px] font-black tracking-widest uppercase text-korat-red hover:underline flex items-center gap-1 shrink-0"
            >
              ดูแพ็กเกจ <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
