import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Trophy, Calendar, Archive } from "lucide-react";
import { getSeason, type ArchiveStanding, CURRENT_SEASON } from "@/lib/seasonArchive";
import { ClubCrest } from "@/components/site/ClubCrest";
import { fetchClubSeasonsByYear, type ClubSeason } from "@/lib/archiveQueries";

export const Route = createFileRoute("/season/$year")({
  component: SeasonPage,
  loader: ({ params }) => {
    const season = getSeason(Number(params.year));
    if (!season) throw notFound();
    return { season };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.season.title} — Archive` },
          { name: "description", content: loaderData.season.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-5xl font-extrabold mb-3">ไม่พบฤดูกาล</h1>
      <p className="text-muted-foreground mb-6">ฤดูกาลที่คุณค้นหาไม่อยู่ในคลังข้อมูล</p>
      <Link to="/" className="inline-flex bg-korat-red text-white px-6 py-3 font-bold uppercase tracking-wider">
        กลับหน้าหลัก
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">เกิดข้อผิดพลาด: {error.message}</div>
  ),
});

type SortKey = keyof Pick<ArchiveStanding, "pos" | "played" | "won" | "drawn" | "lost" | "gf" | "ga" | "gd" | "points">;

function SeasonPage() {
  const { season } = Route.useLoaderData();
  const [identity, setIdentity] = useState<Map<string, ClubSeason>>(new Map());

  useEffect(() => {
    fetchClubSeasonsByYear(season.year)
      .then((rows) => {
        const m = new Map<string, ClubSeason>();
        rows.forEach((r) => m.set(r.season_short_name, r));
        setIdentity(m);
      })
      .catch(() => {});
  }, [season.year]);

  return (
    <div className="bg-asphalt text-concrete min-h-screen">
      <SeasonHero season={season} />
      <SeasonTable standings={season.standings} identity={identity} year={season.year} />
      <SeasonFooterNav year={season.year} />
    </div>
  );
}

/* -------- Reusable: SeasonHero -------- */
function SeasonHero({ season }: { season: ReturnType<typeof getSeason> & {} }) {
  return (
    <section className="relative overflow-hidden border-b-4 border-korat-red">
      <div className="absolute inset-0">
        <img src={season.cover} alt={season.title} className="size-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt via-asphalt/85 to-asphalt/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-concrete/70 hover:text-korat-red mb-6">
          <ArrowLeft className="size-3.5" /> กลับหน้าหลัก
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 mb-4">
          <Archive className="size-3" /> Season Archive
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold italic leading-none tracking-tighter">
          KSL <span className="text-korat-red">{season.year}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm md:text-base text-concrete/80 leading-relaxed">{season.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Pill icon={<Trophy className="size-4 text-yellow-400" />} label="แชมป์" value={season.champion} />
          <Pill icon={<Calendar className="size-4 text-cyan-300" />} label="แมตช์เดย์" value={`${season.matchdays} นัด`} />
        </div>
      </div>
    </section>
  );
}

/* -------- Reusable: SeasonTable -------- */
function SeasonTable({
  standings,
  identity,
  year,
}: {
  standings: ArchiveStanding[];
  identity: Map<string, ClubSeason>;
  year: number;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("pos");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const arr = [...standings];
    arr.sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [standings, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir(k === "pos" ? "asc" : "desc");
    }
  };
  const ind = (k: SortKey) => (sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "");
  const hasGoals = standings.some((s) => s.gf > 0 || s.ga > 0);

  return (
    <section id="standings" className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-14">
      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-red mb-2">Final Standings</p>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">ตารางคะแนนสุดท้าย</h2>
        </div>
        <p className="text-[11px] text-concrete/50">คลิกหัวคอลัมน์เพื่อจัดเรียง</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[680px]">
          <thead>
            <tr className="bg-white/5 text-concrete/60 text-[10px] uppercase tracking-widest">
              <Th onClick={() => toggleSort("pos")}>#{ind("pos")}</Th>
              <th className="p-3">สโมสร</th>
              <Th onClick={() => toggleSort("played")} center>P{ind("played")}</Th>
              <Th onClick={() => toggleSort("won")} center>W{ind("won")}</Th>
              <Th onClick={() => toggleSort("drawn")} center>D{ind("drawn")}</Th>
              <Th onClick={() => toggleSort("lost")} center>L{ind("lost")}</Th>
              {hasGoals && <Th onClick={() => toggleSort("gf")} center>GF{ind("gf")}</Th>}
              {hasGoals && <Th onClick={() => toggleSort("ga")} center>GA{ind("ga")}</Th>}
              <Th onClick={() => toggleSort("gd")} center>GD{ind("gd")}</Th>
              <Th onClick={() => toggleSort("points")} center accent>PTS{ind("points")}</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((row) => {
              const isChamp = row.pos === 1;
              const isTop3 = row.pos <= 3;
              const id = identity.get(row.short);
              const displayName = id?.season_name ?? row.team;
              const displayColor = id?.season_primary_color ?? row.color;
              const displayLogo = id?.season_logo_url ?? null;
              return (
                <tr key={row.team} className={`hover:bg-korat-red/5 transition-colors ${isChamp ? "bg-yellow-500/5" : ""}`}>
                  <td className="p-3 font-display text-lg tabular-nums">
                    <span className={isChamp ? "text-yellow-400" : isTop3 ? "text-korat-red" : ""}>
                      {String(row.pos).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <ClubCrest shortName={row.short} color={displayColor} logoUrl={displayLogo} size="sm" />
                      <span className={`font-semibold ${isChamp ? "text-yellow-400" : ""}`}>
                        {displayName}
                        {isChamp && (
                          <span className="ml-2 text-[9px] font-extrabold bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded uppercase tracking-widest">
                            🏆 Champ
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center tabular-nums">{row.played}</td>
                  <td className="p-3 text-center tabular-nums text-emerald-400">{row.won}</td>
                  <td className="p-3 text-center tabular-nums">{row.drawn}</td>
                  <td className="p-3 text-center tabular-nums text-concrete/60">{row.lost}</td>
                  {hasGoals && <td className="p-3 text-center tabular-nums">{row.gf}</td>}
                  {hasGoals && <td className="p-3 text-center tabular-nums">{row.ga}</td>}
                  <td className={`p-3 text-center tabular-nums font-bold ${row.gd > 0 ? "text-emerald-400" : row.gd < 0 ? "text-korat-red" : ""}`}>
                    {row.gd > 0 ? "+" : ""}{row.gd}
                  </td>
                  <td className="p-3 text-center font-display text-lg font-extrabold tabular-nums bg-korat-red/10 text-korat-red">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!hasGoals && (
        <div className="mt-3 text-[11px] text-concrete/50">หมายเหตุ: ข้อมูลประตูได้/เสียของฤดูกาล {year} ไม่ได้ถูกบันทึกไว้ในต้นฉบับ</div>
      )}
    </section>
  );
}

/* -------- Footer nav back to current season -------- */
function SeasonFooterNav({ year }: { year: number }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 mb-1">Archived Season</p>
          <h3 className="font-display text-xl md:text-2xl font-extrabold">
            กลับสู่ฤดูกาลปัจจุบัน <span className="text-korat-red">{CURRENT_SEASON}</span>
          </h3>
          <p className="text-xs text-concrete/60 mt-1">ดูสถิติ ผลแข่ง และข่าวสารล่าสุดของลีก</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-korat-red text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-korat-red-deep transition-colors"
          >
            ฤดูกาล {CURRENT_SEASON}
          </Link>
          <Link
            to="/hall-of-memory"
            className="inline-flex items-center gap-2 border border-white/15 text-concrete/80 px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-korat-red hover:text-korat-red transition-colors"
          >
            Hall of Memory
          </Link>
          {year !== 2024 && (
            <Link
              to="/season/$year"
              params={{ year: "2024" }}
              className="inline-flex items-center gap-2 border border-white/15 text-concrete/80 px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-korat-red hover:text-korat-red transition-colors"
            >
              KSL 2024
            </Link>
          )}
          {year !== 2025 && (
            <Link
              to="/season/$year"
              params={{ year: "2025" }}
              className="inline-flex items-center gap-2 border border-white/15 text-concrete/80 px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-korat-red hover:text-korat-red transition-colors"
            >
              KSL 2025
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Th({ children, onClick, center, accent }: { children: React.ReactNode; onClick?: () => void; center?: boolean; accent?: boolean }) {
  return (
    <th
      onClick={onClick}
      className={`p-3 cursor-pointer select-none hover:text-korat-red transition-colors ${center ? "text-center" : ""} ${accent ? "bg-korat-red/10 text-korat-red" : ""}`}
    >
      {children}
    </th>
  );
}

function Pill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-white/5 border border-white/10 backdrop-blur">
      {icon}
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-widest text-concrete/60">{label}</div>
        <div className="font-display font-extrabold text-sm">{value}</div>
      </div>
    </div>
  );
}
