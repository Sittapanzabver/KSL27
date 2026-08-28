import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Calendar, Trophy } from "lucide-react";
import { fetchClubHistory, type ClubHistory } from "@/lib/archiveQueries";
import { ClubCrest } from "@/components/site/ClubCrest";
import { buildHead } from "@/lib/site";

export const Route = createFileRoute("/hall-of-memory")({
  component: HallPage,
  head: () =>
    buildHead(
      "Hall of Memory",
      "ความทรงจำของสโมสรที่เคยร่วมเส้นทางในศึก Korat Super League",
      "/hall-of-memory",
    ),
});

function HallPage() {
  const [items, setItems] = useState<ClubHistory[] | null>(null);

  useEffect(() => {
    fetchClubHistory().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="bg-asphalt text-concrete min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-4 border-korat-red">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-korat-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-concrete/70 hover:text-korat-red mb-6">
            <ArrowLeft className="size-3.5" /> กลับหน้าหลัก
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 mb-3">In Loving Memory</p>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold italic leading-none tracking-tighter">
            HALL OF <span className="text-korat-red">MEMORY</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-concrete/80 leading-relaxed">
            พื้นที่จดจำสโมสรที่เคยร่วมเส้นทางกับ Korat Super League ทุกสโมสรล้วนเป็นส่วนหนึ่งของประวัติศาสตร์ลีกเสมอ
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {items === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-concrete/60 py-20">ยังไม่มีข้อมูลในขณะนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 hover:border-korat-red/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <ClubCrest shortName={c.short_name} color={c.primary_color} logoUrl={c.logo_url} size="xl" />
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded mb-2 ${
                      c.status === "dissolved" ? "bg-korat-red/20 text-korat-red" : "bg-zinc-500/20 text-zinc-300"
                    }`}>
                      {c.status === "dissolved" ? "Dissolved" : "Inactive"}
                    </span>
                    <h2 className="font-display text-2xl font-extrabold leading-tight">{c.display_name}</h2>
                    <p className="text-xs text-concrete/60 mt-1 flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      {c.years_active ?? `${c.founded_year ?? "—"} – ${c.dissolved_year ?? "—"}`}
                    </p>
                  </div>
                </div>

                {c.history_text && (
                  <p className="text-sm text-concrete/80 leading-relaxed mb-4">{c.history_text}</p>
                )}

                {c.achievements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-2 flex items-center gap-1.5">
                      <Trophy className="size-3" /> ผลงาน
                    </p>
                    <ul className="space-y-1.5">
                      {c.achievements.map((a, i) => (
                        <li key={i} className="text-xs text-concrete/80 flex gap-2">
                          <span className="text-korat-red">▸</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {c.farewell_message && (
                  <div className="mt-4 p-4 rounded-lg bg-korat-red/5 border border-korat-red/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-korat-red mb-1.5 flex items-center gap-1.5">
                      <Heart className="size-3 fill-current" /> Farewell
                    </p>
                    <p className="text-sm italic text-concrete/90 leading-relaxed">"{c.farewell_message}"</p>
                  </div>
                )}

                {c.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {c.photos.slice(0, 3).map((p, i) => (
                      <img key={i} src={p} alt="" className="w-full aspect-square object-cover rounded-md" loading="lazy" />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
