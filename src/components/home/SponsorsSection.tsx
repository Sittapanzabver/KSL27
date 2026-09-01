import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE_YEAR } from "@/lib/site";
import type { Sponsor } from "@/lib/queries";

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
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

        {/* 2027 — ยังไม่ประกาศพันธมิตร แสดงเฉพาะ CTA */}
        <div className="border border-dashed border-white/[0.08] rounded-xl p-12 text-center bg-white/[0.02] backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-korat-gold mb-3">
            Coming Soon · KSL {SITE_YEAR}
          </p>
          <p className="text-sm text-muted-foreground/70 tracking-wide mb-1">
            พันธมิตรอย่างเป็นทางการประจำฤดูกาล {SITE_YEAR}
          </p>
          <p className="text-[11px] text-muted-foreground/40 tracking-wide">
            กำลังอยู่ระหว่างการประกาศ — เปิดรับพันธมิตรแล้ววันนี้
          </p>
          <Link
            to="/sponsors"
            className="inline-block mt-5 text-[11px] font-bold tracking-widest uppercase text-korat-red hover:underline"
          >
            ดูแพ็กเกจสปอนเซอร์ →
          </Link>
        </div>
      </div>
    </section>
  );
}
