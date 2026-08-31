// src/routes/billboard.tsx
// ประวัติผู้สร้าง KSL — กบ สกินเฮด + ปรัชญาฟุตบอลชุมชน
import { createFileRoute } from "@tanstack/react-router";
import { Heart, MapPin, ArrowRight, Users, Award, Shield } from "lucide-react";
import { ClubCrest } from "@/components/site/ClubCrest";
import { SITE_YEAR, buildHead } from "@/lib/site";

export const Route = createFileRoute("/billboard")({
  component: BillboardPage,
  head: () =>
    buildHead(
      "KORAT SUPER LEAGUE — ฟุตบอลต้องเริ่มจากชุมชน",
      "กบ สกินเฮด ผู้ก่อตั้ง KSL · สร้างสโมสรฟุตบอลท้องถิ่นของโคราช",
      "/billboard",
    ),
});

const CLUBS = [
  { code: "SUTD", name: "เสิงสาง ยูไนเต็ด", district: "อ.เสิงสาง", color: "#1a5276" },
  { code: "NDFC", name: "โนนแดง เอฟซี", district: "อ.โนนแดง", color: "#cc0000" },
  { code: "PUTD", name: "ปักธงชัย ยูไนเต็ด", district: "อ.ปักธงชัย", color: "#7d3c98" },
  { code: "SNFC", name: "สุรนารี เอฟซี", district: "อ.เมือง", color: "#d4ac0d" },
  { code: "UNKR", name: "ยูเนี่ยน โคราช", district: "อ.เมือง", color: "#2c3e50" },
  { code: "KSFC", name: "ขามสะแกแสง เอฟซี", district: "อ.ขามสะแกแสง", color: "#e67e22" },
  { code: "KBFC", name: "ครบุรี เอฟซี", district: "อ.ครบุรี", color: "#27ae60" },
];

// ─── Hero: ปรัชญาหลัก ────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative bg-asphalt overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-korat-red/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-korat-gold/10 blur-[160px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="h-px w-8 bg-korat-gold" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-korat-gold uppercase">
            Korat Super League · Season {SITE_YEAR}
          </span>
          <span className="h-px w-8 bg-korat-gold" />
        </div>
        <h1 className="font-stencil text-[48px] sm:text-[72px] md:text-[96px] leading-[0.85] uppercase mb-8">
          <span className="block text-white">KORAT</span>
          <span className="block text-korat-red drop-shadow-[0_4px_30px_rgba(204,0,0,0.5)]">
            SUPER
          </span>
          <span className="block text-white">LEAGUE</span>
        </h1>
        <blockquote className="font-display text-xl md:text-3xl font-extrabold leading-snug italic max-w-2xl mx-auto">
          <span className="text-korat-gold">&ldquo;</span>
          ฟุตบอลต้องเริ่มจากชุมชน
          <br />
          <span className="text-concrete/70">1 คนจ่าย 100 บาท</span>
          <br />
          <span className="text-korat-gold">vs 100 คนจ่ายคนละ 1 บาท</span>
          <span className="text-korat-gold">&rdquo;</span>
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="size-10 rounded-full bg-korat-red/20 border border-korat-red/30 flex items-center justify-center">
            <Heart className="size-4 text-korat-red" />
          </div>
          <div className="text-left">
            <p className="font-display font-bold text-sm">กบ สกินเฮด</p>
            <p className="text-[10px] text-concrete/50 uppercase tracking-widest">Founder · KSL</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-concrete/40 uppercase tracking-widest">
          สร้างสโมสรฟุตบอลท้องถิ่นของอำเภอคุณ · ครบทั้ง 32 อำเภอ
        </p>
      </div>
    </section>
  );
}

// ─── ประวัติผู้สร้าง ──────────────────────────────────────────────
function FounderSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border bg-asphalt-deep">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-korat-gold" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-korat-gold uppercase">
              The Founder
            </span>
            <span className="h-px w-8 bg-korat-gold" />
          </div>
          <h2 className="font-stencil text-[40px] sm:text-[56px] md:text-[64px] leading-[0.85]">
            <span className="text-white">กบ</span> <span className="text-korat-gold">สกินเฮด</span>
          </h2>
          <img
            src="/kob-founder.jpg"
            alt="กบ สกินเฮด ผู้ก่อตั้ง KSL"
            className="mt-8 mx-auto w-52 h-52 sm:w-60 sm:h-60 rounded-full object-cover ring-2 ring-korat-gold/40 shadow-[0_0_40px_rgba(240,180,41,0.25)]"
          />
        </div>

        <div className="space-y-8 text-sm md:text-base text-concrete/80 leading-relaxed">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-korat-red/10 border border-korat-red/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="size-5 text-korat-red" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold mb-2">
                  ผู้ก่อตั้ง KORAT SUPER LEAGUE
                </h3>
                <p>
                  กบ สกินเฮด คือผู้ที่ทุ่มเทสร้างลีกฟุตบอลระดับรากหญ้าของโคราช ด้วยวิสัยทัศน์ที่ว่า{" "}
                  <span className="text-korat-gold font-bold">
                    &ldquo;สโมสรฟุตบอลท้องถิ่นต้องเริ่มจากฐานแฟนบอลในชุมชน&rdquo;
                  </span>{" "}
                  เขาเชื่อว่าโมเดล &ldquo;1 คนจ่าย 100 บาท vs 100 คนจ่ายคนละ 1 บาท&rdquo;
                  คือเส้นทางสู่ความยั่งยืนที่แท้จริง
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-korat-gold/10 border border-korat-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Award className="size-5 text-korat-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold mb-2">4 ปี 7 สโมสร</h3>
                <p>
                  KSL เริ่มต้นมาตั้งแต่ปี 2024 จนถึงฤดูกาล {SITE_YEAR} มี 7 สโมสรจาก 7 อำเภอ
                  ทุกสโมสรเติบโตจากชุมชน คนในพื้นที่คือเจ้าของร่วม แฟนบอลคือศูนย์กลาง
                  ไม่ใช่กลุ่มทุนภายนอก
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="size-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold mb-2">เป้าหมาย: 32 อำเภอ</h3>
                <p>
                  เป้าหมายสูงสุดคือสร้างสโมสรฟุตบอลท้องถิ่นครบทั้ง 32 อำเภอของนครราชสีมา
                  โดยคนในพื้นที่คือผู้สร้างและผู้พัฒนา พร้อมระบบเยาวชน U10-U16 ป้อนสู่สโมสรอาชีพ
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-korat-gold/10 via-korat-gold/5 to-transparent border border-korat-gold/20 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-xs text-korat-gold uppercase tracking-widest font-bold mb-3">
            -quote of the founder-
          </p>
          <blockquote className="font-display text-lg md:text-xl font-extrabold italic leading-relaxed">
            <span className="text-korat-gold">&ldquo;</span>
            สโมสรท้องถิ่นต้องเริ่มจากฐานแฟนบอลในชุมชน
            แล้วค่อยๆใส่เงื่อนไขในการพัฒนาตามลำดับชั้นเข้าไป
            <span className="text-korat-gold">&rdquo;</span>
          </blockquote>
          <p className="mt-3 text-xs text-concrete/50">— กบ สกินเฮด, ผู้ก่อตั้ง KSL</p>
        </div>
      </div>
    </section>
  );
}

// ─── สโมสรทั้งหมด ─────────────────────────────────────────────────
function ClubsSection() {
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-korat-red" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-korat-red uppercase">
              Clubs · Season {SITE_YEAR}
            </span>
            <span className="h-px w-8 bg-korat-red" />
          </div>
          <h2 className="font-stencil text-[40px] sm:text-[56px] md:text-[64px] leading-[0.85]">
            <span className="text-white">สโมสรของเรา</span>
          </h2>
          <p className="mt-3 text-sm text-concrete/60">
            7 สโมสร · 6 อำเภอ · ยังเปิดรับ 1 อำเภอ · พร้อมเติบโตสู่ 32 อำเภอ
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CLUBS.map((c) => (
            <div
              key={c.code}
              className="group relative overflow-hidden rounded-xl p-5 bg-card border border-border hover:border-korat-red transition-all duration-200"
            >
              <div className="flex justify-center">
                <ClubCrest shortName={c.code} color={c.color} logoUrl={null} size="lg" />
              </div>
              <div className="text-center mt-3 font-display font-extrabold text-sm leading-tight group-hover:text-korat-red transition-colors">
                {c.name}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-concrete/50">
                <MapPin className="size-2.5" />
                {c.district}
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center min-h-[132px] rounded-xl p-5 border-2 border-dashed border-white/15 bg-asphalt-deep/40">
            <div className="font-stencil text-2xl text-concrete/40">+1</div>
            <div className="text-center mt-2 font-display font-extrabold text-sm text-concrete/50 leading-tight">
              ช่องว่างสำหรับ
              <br />
              อำเภอของคุณ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA: สมัครเข้าร่วม ──────────────────────────────────────────
function RegisterSection() {
  return (
    <section
      id="register"
      className="relative py-16 md:py-24 border-t border-korat-red/30 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-asphalt-deep via-[#120202] to-asphalt-deep pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
        <p className="text-[10px] text-korat-gold uppercase tracking-[0.3em] font-bold mb-4">
          ผู้สนับสนุนหลัก Season 2027 · ท่านนเทวัญ &amp; โคราช ซิตี้
        </p>
        <h2 className="font-stencil text-[40px] sm:text-[56px] md:text-[72px] leading-[0.85]">
          <span className="text-white">อำเภอยังไม่มีทีม?</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-concrete/70 leading-relaxed">
          เปิดรับสมัครสโมสรฟุตบอลจากทุกอำเภอ สร้างทีมของคนในชุมชน แล้วก้าวเข้าสู่{" "}
          <span className="text-korat-gold font-bold">KORAT SUPER LEAGUE</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="https://www.facebook.com/unionkorat2020"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-korat-red text-white px-8 py-4 font-bold uppercase text-xs tracking-[0.2em] hover:shadow-[0_0_40px_rgba(204,0,0,0.7)] hover:-translate-y-0.5 transition-all duration-300"
          >
            ติดต่อสมัครผ่าน Facebook{" "}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border bg-asphalt-deep py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="font-stencil text-xl text-white">KSL</div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-[10px] text-concrete/50 uppercase tracking-widest">
              Korat Super League {SITE_YEAR}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CLUBS.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-concrete/60"
              >
                {c.code}
              </span>
            ))}
          </div>
          <div className="text-[10px] text-concrete/30 uppercase tracking-widest">
            &copy; {SITE_YEAR} KSL
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
function BillboardPage() {
  return (
    <div className="bg-asphalt text-concrete min-h-screen">
      <HeroSection />
      <FounderSection />
      <ClubsSection />
      <RegisterSection />
      <Footer />
    </div>
  );
}
