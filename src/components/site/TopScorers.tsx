import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchTopScorersTable, fetchClubs } from "@/lib/queries";
import { DivisionTab } from "@/components/DivisionTab";
import type { DivisionKey } from "@/lib/divisions";
import { ClubCrest } from "@/components/site/ClubCrest";

interface Props {
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

// Map club_code → club slug for linking
const CODE_TO_SLUG: Record<string, string> = {
  NDFC: "nondaeng-fc",
  SUTD: "soengsang-united",
  PMFC: "phimai-fc",
  PUTD: "pakthongchai-united",
  KBFC: "khonburi-fc",
  SNFC: "suranaree-fc",
  UNKR: "union-korat",
  KSFC: "khamsakaesaeng-fc",
};

type Row = { id: string; name: string; club_code: string; goals: number; category: string };

const CATEGORY_MAP: Record<DivisionKey, "senior" | "u16"> = {
  SUPER_LEAGUE: "senior",
  U16: "u16",
};

export function TopScorers({ limit = 10, className = "", showHeader = true }: Props) {
  const [division, setDivision] = useState<DivisionKey>("SUPER_LEAGUE");
  const [rows, setRows] = useState<Row[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tab = useMemo(() => CATEGORY_MAP[division], [division]);

  useEffect(() => {
    fetchClubs().then(setClubs);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTopScorersTable(tab)
      .then((d) => setRows((d as Row[]).slice(0, limit)))
      .finally(() => setLoading(false));
  }, [tab, limit]);

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-red mb-1">Top Scorers</p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">ดาวซัลโวประจำลีก</h2>
          </div>
          <Link to="/top-scorers" className="text-xs font-bold uppercase tracking-widest text-korat-red hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
      )}

      <DivisionTab active={division} onChange={setDivision} />

      <div className="rounded-xl border border-border bg-card overflow-hidden card-shadow">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">กำลังโหลด...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">ยังไม่มีข้อมูลดาวซัลโว</div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((p, i) => {
              const slug = CODE_TO_SLUG[p.club_code];
              const club = clubs.find((c) => c.slug === slug);
              return (
                <li key={p.id} className="flex items-center gap-3 p-3 hover:bg-korat-red/5 transition-colors">
                  <div className={`font-display text-xl tabular-nums w-8 text-center ${i < 3 ? "text-korat-red" : "text-muted-foreground"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{p.name}</div>
                    {club ? (
                      <Link
                        to="/clubs/$slug"
                        params={{ slug: club.slug }}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-korat-red transition-colors mt-0.5"
                      >
                        <ClubCrest shortName={club.short_name} color={club.primary_color} logoUrl={club.logo_url} size="sm" />
                        <span className="truncate">{club.name}</span>
                      </Link>
                    ) : (
                      <div className="text-[11px] text-muted-foreground mt-0.5">{p.club_code}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-2xl font-extrabold tabular-nums text-korat-red leading-none">{p.goals}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">ประตู</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
