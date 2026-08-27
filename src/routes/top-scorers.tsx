import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchTopScorersTable, fetchClubs } from "@/lib/queries";
import { CODE_TO_SLUG } from "@/lib/clubCodes";
import { DivisionTab } from "@/components/DivisionTab";
import type { DivisionKey } from "@/lib/divisions";
import { ClubCrest } from "@/components/site/ClubCrest";
import { PageHeader } from "./standings";
import { buildHead, SITE_YEAR } from "@/lib/site";

type Category = "senior" | "u16";

type Row = {
  id: string;
  name: string;
  club_code: string;
  goals: number;
  category: string;
};

export const Route = createFileRoute("/top-scorers")({
  component: TopScorersPage,
  head: () =>
    buildHead(
      "ดาวซัลโว",
      `อันดับดาวซัลโว Korat Super League ${SITE_YEAR} ทั้งชุดใหญ่และ U-16`,
      "/top-scorers"
    ),
});

const CATEGORY_MAP: Record<"SUPER_LEAGUE" | "U16", Category> = {
  SUPER_LEAGUE: "senior",
  U16: "u16",
};

function ScorerList({ rows, clubs }: { rows: Row[]; clubs: any[] }) {
  const clubsBySlug = useMemo(() => {
    const map = new Map<string, any>();
    for (const c of clubs) map.set(c.slug, c);
    return map;
  }, [clubs]);

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        ยังไม่มีข้อมูล
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((p, i) => {
        const slug = CODE_TO_SLUG[p.club_code as keyof typeof CODE_TO_SLUG];
        const club = slug ? clubsBySlug.get(slug) : undefined;

        return (
          <li
            key={p.id}
            className="flex items-center gap-3 p-3 hover:bg-korat-red/5 transition-colors"
          >
            <div
              className={`font-display text-xl tabular-nums w-10 text-center ${
                i < 3 ? "text-korat-red" : "text-muted-foreground"
              }`}
            >
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
                  <ClubCrest
                    shortName={club.short_name}
                    color={club.primary_color}
                    logoUrl={club.logo_url}
                    size="sm"
                  />
                  <span className="truncate">{club.name}</span>
                </Link>
              ) : (
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {p.club_code}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="font-display text-2xl font-extrabold tabular-nums text-korat-red leading-none">
                {p.goals}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                ประตู
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function TopScorersPage() {
  const [division, setDivision] = useState<DivisionKey>("SUPER_LEAGUE");
  const [rows, setRows] = useState<Row[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tab = useMemo(() => CATEGORY_MAP[division], [division]);

  useEffect(() => {
    fetchClubs().then(setClubs).catch(() => setClubs([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTopScorersTable(tab)
      .then((d) => {
        if (!cancelled) setRows(d as Row[]);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <PageHeader
        eyebrow="Top Scorers"
        title="ดาวซัลโวประจำลีก"
        subtitle={`อันดับนักเตะที่ยิงประตูได้มากที่สุดในศึก Korat Super League ${SITE_YEAR}`}
      />

      <DivisionTab active={division} onChange={setDivision} />

      <div className="rounded-xl border border-border bg-card overflow-hidden card-shadow">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            กำลังโหลด...
          </div>
        ) : (
          <ScorerList rows={rows} clubs={clubs} />
        )}
      </div>
    </div>
  );
}
