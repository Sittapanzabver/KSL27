import { Link } from "@tanstack/react-router";
import { PLATFORM_OWNER, PLATFORM_OWNER_NOTE, SITE_YEAR } from "@/lib/site";

export function Footer() {
  return (
  <>
    <footer className="border-t-4 border-korat-red mt-24" style={{ backgroundColor: "#060f1e" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-sm">
          <div className="bg-white p-1.5 skew-tag inline-block mb-4">
            <span className="font-display font-extrabold text-2xl tracking-tighter text-asphalt">
              MSK<span className="text-korat-red">{SITE_YEAR.slice(2)}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide leading-relaxed">
            MEINHARD SPORTS KORAT SUPER LEAGUE {SITE_YEAR}<br />
            ลีกฟุตบอลท้องถิ่นจังหวัดนครราชสีมา<br />
            POWERED BY THE PASSION OF KORAT.
          </p>
        </div>
        <div className="flex flex-wrap gap-12">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-korat-red tracking-[0.2em]">การแข่งขัน</p>
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <Link to="/standings" className="hover:text-korat-red">ตารางคะแนน</Link>
              <Link to="/matches" className="hover:text-korat-red">ผลการแข่งขัน</Link>
              <Link to="/clubs" className="hover:text-korat-red">สโมสร</Link>
              <Link to="/players" className="hover:text-korat-red">นักเตะ</Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-korat-red tracking-[0.2em]">ลีก</p>
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <Link to="/news" className="hover:text-korat-red">ข่าวสาร</Link>
              <Link to="/sponsors" className="hover:text-korat-red">สปอนเซอร์</Link>
              <a href="#" className="hover:text-korat-red">เกี่ยวกับลีก</a>
              <a href="#" className="hover:text-korat-red">ติดต่อเรา</a>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase text-korat-red tracking-[0.2em]">โซเชียล</p>
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <a href="#" className="hover:text-korat-red">Facebook</a>
              <a href="#" className="hover:text-korat-red">Instagram</a>
              <a href="#" className="hover:text-korat-red">YouTube</a>
              <a href="#" className="hover:text-korat-red">TikTok</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] text-muted-foreground tracking-widest uppercase flex justify-between">
          <span>© {SITE_YEAR} Meinhard Sports Korat Super League</span>
          <span className="hidden sm:inline">All matches subject to change</span>
        </div>
      </div>
      {/* Platform / Technology owner — แยกจาก League Operator */}
      <div className="border-t border-border/60 bg-asphalt-deep">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] tracking-wide">
          <span className="text-muted-foreground">
            เว็บไซต์นี้พัฒนาโดย <span className="font-bold text-foreground">{PLATFORM_OWNER}</span>
            <span className="text-muted-foreground/70"> · {PLATFORM_OWNER_NOTE}</span>
          </span>
          <span className="text-muted-foreground/60 text-[10px]">
            เทคโนโลยีแพลตฟอร์มฟุตบอล · การแข่งขันดำเนินการโดยผู้จัดการแข่งขันลีก
          </span>
        </div>
      </div>
    </footer>
  </>
  );
}
