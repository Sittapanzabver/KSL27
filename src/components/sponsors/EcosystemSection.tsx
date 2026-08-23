import { ClubCrest } from "@/components/site/ClubCrest";
import { teams } from "@/constants/sponsorTiers";
import { SectionHeader } from "./SectionHeader";

export function EcosystemSection({ clubs }: { clubs: any[] }) {
  const list =
    clubs.length > 0
      ? clubs
      : teams.map((t) => ({
          id: t.code,
          name: t.name,
          short_name: t.code,
          logo_url: null,
          primary_color: null,
        }));

  return (
    <section>
      <SectionHeader
        kicker="03 · League Ecosystem"
        title="8 สโมสร · 1 จังหวัด"
        sub="ทุกสโมสรคือประตูสู่ชุมชนท้องถิ่นที่มีฐานแฟนของตัวเอง"
      />

      <div className="relative border border-border bg-card overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 14px)",
          }}
        />
        <div className="relative p-6 md:p-10">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-3xl">
            Korat Super League ครอบคลุม{" "}
            <span className="text-foreground font-bold">8 อำเภอ</span>{" "}
            ทั่วจังหวัดนครราชสีมา
            แต่ละสโมสรมีฐานแฟนที่แข็งแกร่งในชุมชนของตนเอง —
            การสนับสนุนลีกนี้คือการพูดกับชาวโคราชโดยตรง
            ผ่านสิ่งที่พวกเขารักจริง
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {list.map((c: any) => (
              <div
                key={c.id}
                className="group relative border border-border bg-asphalt-deep/40 p-4 flex items-center gap-3 hover:border-korat-red/60 hover:bg-korat-red/[0.04] transition-all"
              >
                <ClubCrest
                  shortName={c.short_name}
                  color={c.primary_color}
                  logoUrl={c.logo_url}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-[12px] text-foreground font-bold leading-snug truncate">
                    {c.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 tracking-widest uppercase mt-0.5">
                    KSL Club
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4 text-center">
            {[
              { n: "8", l: "อำเภอ / Districts" },
              { n: "14", l: "Matchdays" },
              { n: "274K+", l: "Online Reach" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-black text-korat-red tabular-nums tracking-tight">
                  {s.n}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-[0.16em] uppercase mt-2 font-bold">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
