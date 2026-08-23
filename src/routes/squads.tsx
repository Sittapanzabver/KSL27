import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import { fetchAllPlayers, fetchClubs } from "@/lib/queries";
import { ClubCrest } from "@/components/site/ClubCrest";
import { PageHeader } from "./standings";
import { SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/squads")({
  component: SquadsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    club: typeof search.club === "string" ? search.club : undefined,
  }),
  head: () => ({
    meta: [
      { title: `ขุมกำลังนักเตะ — Korat Super League ${SITE_YEAR}` },
      { name: "description", content: `รายชื่อนักเตะทั้งหมดของ 8 สโมสรในศึก Korat Super League ${SITE_YEAR}` },
    ],
  }),
});

function SquadsPage() {
  const { club: clubSlug } = Route.useSearch();
  const [clubs, setClubs] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [activeClub, setActiveClub] = useState<string | "all">("all");

  useEffect(() => {
    fetchClubs().then((cs) => {
      setClubs(cs);
      if (clubSlug) {
        const found = cs.find((c: any) => c.slug === clubSlug);
        if (found) setActiveClub(found.id);
      }
    });
    fetchAllPlayers().then(setPlayers);
  }, [clubSlug]);

  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const c of clubs) map.set(c.id, []);
    for (const p of players) {
      if (!p.club_id) continue;
      if (!map.has(p.club_id)) map.set(p.club_id, []);
      map.get(p.club_id)!.push(p);
    }
    return map;
  }, [clubs, players]);

  const visibleClubs = activeClub === "all" ? clubs : clubs.filter((c) => c.id === activeClub);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <PageHeader
        eyebrow="The Squads"
        title="ขุมกำลังนักเตะ"
        subtitle={`รายชื่อนักเตะของทั้ง 8 สโมสรในศึก Meinhard Sports Korat Super League ${SITE_YEAR}`}
      />

      {/* Club filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        <FilterChip active={activeClub === "all"} onClick={() => setActiveClub("all")}>
          ทั้งหมด
        </FilterChip>
        {clubs.map((c) => (
          <FilterChip key={c.id} active={activeClub === c.id} onClick={() => setActiveClub(c.id)}>
            {c.short_name ?? c.name}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-14">
        {visibleClubs.map((club) => {
          const list = grouped.get(club.id) ?? [];
          return (
            <section key={club.id}>
              <div className="flex items-center gap-4 mb-5 pb-3 border-b-2 border-korat-red/40">
                <ClubCrest shortName={club.short_name} color={club.primary_color} logoUrl={club.logo_url} size="lg" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-none">{club.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                    {list.length} นักเตะ · {club.home_venue}
                  </p>
                </div>
              </div>

              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6">ยังไม่มีข้อมูลนักเตะ</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {list
                    .slice()
                    .sort((a, b) => (a.jersey_number ?? 999) - (b.jersey_number ?? 999))
                    .map((p) => (
                      <PlayerCard key={p.id} player={p} accent={club.primary_color} />
                    ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
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
      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
        active
          ? "bg-korat-red border-korat-red text-white"
          : "bg-card border-border text-muted-foreground hover:border-korat-red hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function PlayerCard({ player, accent }: { player: any; accent?: string }) {
  return (
    <div className="bg-card border border-border hover:border-korat-red transition-colors group overflow-hidden">
      {/* Photo */}
      <div
        className="relative aspect-[3/4] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent ?? "#E10600"}33, transparent), var(--asphalt)`,
        }}
      >
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
        ) : (
          <User className="size-20 text-muted-foreground/40" strokeWidth={1} />
        )}
        {/* Jersey number watermark */}
        <span className="absolute bottom-1 right-2 font-display text-6xl font-extrabold tabular-nums text-white/15 leading-none pointer-events-none">
          {player.jersey_number ?? "—"}
        </span>
        {/* Position pill */}
        {player.position && (
          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
            {player.position}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold text-korat-red tabular-nums leading-none">
            {player.jersey_number ? String(player.jersey_number).padStart(2, "0") : "—"}
          </span>
          <h3 className="font-bold text-sm leading-tight truncate flex-1">{player.name}</h3>
        </div>

        <div className="grid grid-cols-2 gap-1 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">⚽</span>
            <div>
              <div className="font-display text-sm font-bold tabular-nums leading-none">{player.goals ?? 0}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">ประตู</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-[1px]" aria-hidden />
            <div>
              <div className="font-display text-sm font-bold tabular-nums leading-none">{player.yellow_cards ?? 0}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">ใบเหลือง</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
