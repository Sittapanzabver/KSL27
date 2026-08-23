import { Link } from "@tanstack/react-router";
import { Trophy, ArrowRight, Heart, ListOrdered, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SEASON_ARCHIVE } from "@/lib/seasonArchive";

export function SeasonArchive() {
  const [query, setQuery] = useState("");
  const [activeYear, setActiveYear] = useState<number | "all">("all");

  const years = useMemo(() => SEASON_ARCHIVE.map((s) => s.year).sort((a, b) => b - a), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEASON_ARCHIVE.filter((s) => {
      if (activeYear !== "all" && s.year !== activeYear) return false;
      if (!q) return true;
      return (
        String(s.year).includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.champion.toLowerCase().includes(q)
      );
    });
  }, [query, activeYear]);

  return (
    <section className="relative bg-asphalt text-concrete py-16 md:py-20 border-t-4 border-korat-red overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-korat-red/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-red mb-2">Previous Seasons</p>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tighter leading-none">
              ย้อนชม<span className="text-korat-red"> ฤดูกาลก่อนหน้า</span>
            </h2>
            <p className="mt-3 text-sm text-concrete/60 max-w-xl">
              คลังบันทึกตารางคะแนนสุดท้ายของทุกฤดูกาล Korat Super League
            </p>
          </div>
          <Link
            to="/hall-of-memory"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-korat-red/40 bg-korat-red/10 hover:bg-korat-red hover:text-white text-korat-red text-xs font-extrabold uppercase tracking-widest transition-colors"
          >
            <Heart className="size-3.5" /> Hall of Memory
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-concrete/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาฤดูกาล / แชมป์ / ปี..."
              className="w-full pl-10 pr-9 py-2.5 rounded-md bg-white/5 border border-white/10 focus:border-korat-red focus:outline-none text-sm text-concrete placeholder:text-concrete/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-concrete/50 hover:text-concrete"
                aria-label="Clear"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <YearChip active={activeYear === "all"} onClick={() => setActiveYear("all")}>
              ทั้งหมด
            </YearChip>
            {years.map((y) => (
              <YearChip key={y} active={activeYear === y} onClick={() => setActiveYear(y)}>
                {y}
              </YearChip>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-concrete/50 text-sm border border-dashed border-white/10 rounded-xl">
            ไม่พบฤดูกาลที่ตรงกับการค้นหา
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <ArchiveCard key={s.year} season={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function YearChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 text-xs font-extrabold uppercase tracking-widest border rounded-md transition-colors ${
        active
          ? "bg-korat-red border-korat-red text-white"
          : "bg-white/5 border-white/10 text-concrete/70 hover:border-korat-red/50 hover:text-concrete"
      }`}
    >
      {children}
    </button>
  );
}


function ArchiveCard({ season: s }: { season: (typeof SEASON_ARCHIVE)[number] }) {
  return (
    <article className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-white/0 hover:border-korat-red/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(225,6,0,0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-asphalt">
        <img
          src={s.cover}
          alt={`${s.title} cover`}
          loading="lazy"
          className="size-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/40 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-korat-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-widest shadow-lg">
          <Trophy className="size-3" /> Champion
        </div>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-cyan-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-cyan-400/30">
          {s.matchdays} MD
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300/90">Season</p>
          <h3 className="font-display text-4xl md:text-5xl font-extrabold italic leading-none">{s.year}</h3>
          <p className="mt-1 text-sm font-semibold text-concrete/90 truncate">🏆 {s.champion}</p>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-concrete/70 leading-relaxed mb-4 min-h-[3rem]">{s.description}</p>

        <div className="flex flex-col gap-2">
          <Link
            to="/season/$year"
            params={{ year: String(s.year) }}
            hash="standings"
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] hover:bg-korat-red/10 hover:border-korat-red/50 hover:text-korat-red text-xs font-bold uppercase tracking-wide text-concrete/80 transition-colors"
          >
            <ListOrdered className="size-3.5" /> ตารางคะแนนสุดท้าย
          </Link>
          <Link
            to="/season/$year"
            params={{ year: String(s.year) }}
            className="flex items-center justify-between gap-2 w-full bg-korat-red hover:bg-korat-red-deep text-white px-4 py-2.5 rounded-md font-bold text-sm uppercase tracking-wider transition-colors group/cta"
          >
            เข้าชมฤดูกาล {s.year}
            <ArrowRight className="size-4 group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
