import { CONTACT_URL } from "@/constants/sponsorTiers";
import { SITE_YEAR } from "@/lib/site";


export function FinalCtaSection() {
  return (
    <section>
      {/* U-16 Image Strip */}
      <div className="relative overflow-hidden mb-8 rounded-xl">
        <img
          src="https://hjljnwpfjbvrlvjpjhfv.supabase.co/storage/v1/object/public/media/u-16hero.jpg"
          alt="KSL Academy U-16"
          className="w-full h-48 md:h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
          <span className="text-[10px] font-black tracking-[0.24em] text-korat-gold uppercase mb-3">
            Academy Sponsor — เปิดรับ {SITE_YEAR}
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-[1.05] mb-2">
            ร่วมสร้างอนาคตฟุตบอลเยาวชนโคราช
          </h3>
          <p className="text-sm md:text-base text-white/70">
            120+ เยาวชนนักเตะ · 8 อำเภอ · ทีม U-16 ครบทุกสโมสร
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden border-2 border-korat-red">
        <div className="absolute inset-0 bg-korat-red" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize: "8px 8px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(0,0,0,0.35), transparent 60%)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-40 bg-black/10"
          style={{ transform: "skewX(-8deg) translateX(24px)" }}
        />
        <div className="absolute right-6 bottom-2 text-[120px] md:text-[200px] font-black text-white/[0.06] leading-none pointer-events-none select-none tracking-tighter">
          KSL
        </div>

        <div className="relative px-8 md:px-12 py-12 md:py-16 text-center md:text-left md:flex md:items-center md:justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black tracking-[0.24em] text-white/70 uppercase mb-4 flex items-center gap-2 justify-center md:justify-start">
              <span className="size-1.5 bg-white" />
              Partnership Invitation · {SITE_YEAR}
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-4">
              ลงสนามไปกับเรา
              <br />
              <span className="text-white/80">ในฤดูกาลถัดไป</span>
            </h2>
            <p className="text-sm md:text-base text-white/85 max-w-md leading-relaxed">
              เข้าถึงแฟนบอลกว่า{" "}
              <span className="font-black text-white">275,000 คน</span>{" "}
              ผ่านแพลตฟอร์มดิจิทัลและสื่อชุมชนของลีก
              ติดต่อเพื่อรับ Media Kit ฉบับเต็มและข้อเสนอที่เหมาะกับธุรกิจของคุณ
            </p>
          </div>

          <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end gap-3 flex-shrink-0">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-korat-red px-8 py-4 text-[12px] font-black tracking-[0.2em] uppercase hover:bg-poster-tan transition-colors shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]"
            >
              ติดต่อผ่าน Facebook →
            </a>
            <span className="text-[11px] text-white/75 tracking-wide">
              @KoratSuperLeague · ตอบภายใน 24 ชม.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted-foreground/60 tracking-[0.16em] uppercase font-bold">
        <span>Meinhard Sports · Korat Super League {SITE_YEAR}</span>
        <span className="text-muted-foreground/40">
          koratsuperleague.lovable.app
        </span>
      </div>
    </section>
  );
}
