import { CONTACT_URL } from "@/constants/sponsorTiers";
import { SectionHeader } from "./SectionHeader";
import { SITE_YEAR } from "@/lib/site";


export function OfficialPartnersSection() {
  return (
    <section>
      <SectionHeader
        kicker="04 · Official Partners"
        title="พันธมิตรปัจจุบัน"
        sub={`พื้นที่ระดับพรีเมียมยังเปิดรับสำหรับฤดูกาล ${SITE_YEAR}`}
      />

      <div className="relative overflow-hidden border-2 border-korat-red/70 bg-gradient-to-br from-korat-red/[0.08] via-card to-card mb-4">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 12px)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-korat-red" />
        <div className="absolute right-0 top-0 text-[10px] font-black tracking-[0.22em] bg-korat-red text-white px-3 py-1.5 uppercase">
          ★ Title {SITE_YEAR}
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6 md:px-10 py-8 md:py-12">
          <div className="max-w-xl">
            <span className="inline-block text-[10px] font-black tracking-[0.22em] text-korat-red px-0 mb-3 uppercase">
              Official Title Sponsor
            </span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-none mb-3">
              Korat Super League
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              สนับสนุนหลักประจำฤดูกาล {SITE_YEAR} · ปรากฏในทุกจุดสัมผัสของลีก
              ตั้งแต่ Header เว็บไซต์ ป้ายสนาม ไปจนถึงทุกโพสต์โซเชียลมีเดีย
            </p>
          </div>

          <div className="flex-shrink-0 w-40 h-24 border-2 border-korat-red/40 flex items-center justify-center bg-korat-red/5">
            <span className="text-[11px] font-black tracking-[0.2em] text-korat-red/70 uppercase">
              KSL
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="relative border border-yellow-600/40 bg-card overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/70" />
          <div className="px-6 py-6 flex items-center justify-between gap-4">
            <div>
              <span className="inline-block text-[10px] font-black tracking-[0.2em] text-yellow-500 mb-2 uppercase">
                Gold Partner · ว่าง
              </span>
              <p className="text-base font-black text-foreground">
                ช่องว่างสำหรับพันธมิตร Gold
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">
                เปิดรับสปอนเซอร์ฤดูกาล {SITE_YEAR}
              </p>
            </div>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[10px] font-black tracking-[0.18em] uppercase border border-yellow-600/50 text-yellow-500 px-4 py-2.5 hover:bg-yellow-500/10 transition-colors whitespace-nowrap"
            >
              ติดต่อ →
            </a>
          </div>
        </div>

        <div className="relative border border-border bg-card overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted-foreground/40" />
          <div className="px-6 py-6 flex items-center justify-between gap-4">
            <div>
              <span className="inline-block text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-2 uppercase">
                Silver Partner · ว่าง
              </span>
              <p className="text-base font-black text-foreground">
                ช่องว่างสำหรับพันธมิตร Silver
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">
                เปิดรับสปอนเซอร์ฤดูกาล {SITE_YEAR}
              </p>
            </div>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[10px] font-black tracking-[0.18em] uppercase border border-border text-muted-foreground px-4 py-2.5 hover:border-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              ติดต่อ →
            </a>
          </div>
        </div>
      </div>

      <div className="border border-dashed border-border p-6 text-center">
        <p className="text-[12px] text-muted-foreground tracking-wide">
          <span className="text-foreground font-bold">โลโก้ของคุณจะปรากฏที่นี่</span>
          {" · "}
          ติดต่อเราเพื่อเป็นพันธมิตรอย่างเป็นทางการของ KSL {SITE_YEAR}
        </p>
      </div>
    </section>
  );
}
