import { CONTACT_URL, tiers, type SponsorTier } from "@/constants/sponsorTiers";
import { SectionHeader } from "./SectionHeader";
import { SITE_YEAR } from "@/lib/site";


function TierCard({ tier, idx }: { tier: SponsorTier; idx: number }) {
  return (
    <div
      className={`relative flex flex-col ${
        tier.highlight
          ? "md:-mt-4 md:mb-0 border-2 border-korat-red bg-gradient-to-b from-korat-red/[0.08] to-transparent shadow-[0_20px_60px_-20px_rgba(204,0,0,0.5)]"
          : "border border-border bg-card"
      }`}
    >
      {tier.highlight && (
        <div className="bg-korat-red px-4 py-2 text-center">
          <span className="text-[10px] font-black tracking-[0.22em] text-white uppercase">
            ★ Most Valuable · Maximum Exposure
          </span>
        </div>
      )}

      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-5">
          <span
            className={`text-[10px] font-black tracking-[0.22em] uppercase ${
              tier.highlight
                ? "text-korat-red"
                : idx === 1
                  ? "text-yellow-500"
                  : "text-muted-foreground"
            }`}
          >
            Tier {String(idx + 1).padStart(2, "0")} · {tier.nameEn}
          </span>
          <div
            className={`h-px w-10 ${
              tier.highlight
                ? "bg-korat-red"
                : idx === 1
                  ? "bg-yellow-500/50"
                  : "bg-border"
            }`}
          />
        </div>

        <h3
          className={`text-2xl font-black tracking-tight mb-2 ${
            tier.highlight
              ? "text-foreground"
              : idx === 1
                ? "text-yellow-500"
                : "text-foreground"
          }`}
        >
          {tier.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-6 leading-snug">
          {tier.tagline}
        </p>

        <div className="flex-1 space-y-2.5 mb-7 border-t border-border/60 pt-5">
          {tier.perks.map((p) => (
            <div key={p} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex items-center justify-center size-4 text-[10px] font-black leading-none flex-shrink-0 ${
                  tier.highlight
                    ? "bg-korat-red text-white"
                    : "bg-foreground/10 text-foreground"
                }`}
              >
                ✓
              </span>
              <span className="text-[12px] text-foreground leading-snug">{p}</span>
            </div>
          ))}
          {tier.inactive.map((p) => (
            <div key={p} className="flex items-start gap-3 opacity-40">
              <span className="mt-0.5 flex items-center justify-center size-4 text-[10px] leading-none flex-shrink-0 border border-border text-muted-foreground">
                —
              </span>
              <span className="text-[12px] text-muted-foreground leading-snug line-through decoration-muted-foreground/40">
                {p}
              </span>
            </div>
          ))}
        </div>

        <a
          href={CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-center text-[11px] font-black tracking-[0.18em] uppercase py-3.5 transition-colors ${
            tier.highlight
              ? "bg-korat-red text-white hover:bg-korat-red-deep"
              : "border border-border text-foreground hover:bg-foreground hover:text-background"
          }`}
        >
          ขอ Media Kit →
        </a>
      </div>
    </div>
  );
}

export function PackagesSection() {
  return (
    <section>
      <SectionHeader
        kicker="02 · Partnership Packages"
        title="แพ็กเกจสปอนเซอร์"
        sub="เลือกระดับการมีส่วนร่วมที่เหมาะกับเป้าหมายธุรกิจของคุณ — ปรับแต่งเพิ่มเติมได้"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {tiers.map((t, idx) => (
          <TierCard key={t.name} tier={t} idx={idx} />
        ))}
      </div>

      {/* Academy U-16 Tier */}
      <div className="mt-6 relative flex flex-col border-2 border-korat-gold bg-gradient-to-b from-korat-gold/[0.08] to-transparent rounded-xl overflow-hidden">
        <div className="bg-korat-gold px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-[9px] font-black px-2 py-0.5 bg-asphalt text-korat-gold rounded">
            ใหม่ {SITE_YEAR}
          </span>
          <span className="text-[10px] font-black tracking-[0.22em] text-asphalt uppercase">
            ★ Community Impact · Youth Development
          </span>
        </div>
        <div className="p-6 md:p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase text-korat-gold">
              Tier 04 · Academy
            </span>
            <div className="h-px w-10 bg-korat-gold" />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2 text-foreground">
            🎓 Academy Partner
          </h3>
          <p className="text-[11px] text-muted-foreground mb-6 leading-snug">
            สนับสนุน KSL Academy U-16
          </p>
          <div className="flex-1 space-y-2.5 mb-7 border-t border-border/60 pt-5">
            {[
              "โลโก้บนชุดแข่ง U-16 ทั้ง 8 ทีม",
              "ป้ายสนามในนัดเยาวชนทุกแมตช์",
              "Feature บน KSL Hub หน้า Sponsors",
              "โพสต์ Social Media ต้อนรับสปอนเซอร์",
              "Certificate of Community Impact",
            ].map((p) => (
              <div key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex items-center justify-center size-4 text-[10px] font-black leading-none flex-shrink-0 bg-korat-gold text-asphalt">
                  ✓
                </span>
                <span className="text-[12px] text-foreground leading-snug">{p}</span>
              </div>
            ))}
          </div>
          <a
            href="mailto:sponsor@koratsuperleague.app"
            className="block text-center bg-korat-gold text-asphalt font-extrabold uppercase tracking-widest px-5 py-2.5 text-[11px] w-full mt-4 hover:bg-korat-gold/90 transition-colors"
          >
            ติดต่อสอบถาม →
          </a>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground/60 mt-5 text-center">
        * แพ็กเกจทั้งหมดปรับแต่งได้ตามอุตสาหกรรมและเป้าหมายของธุรกิจ ·
        พร้อมรายงานผลรายเดือน
      </p>
    </section>
  );
}
