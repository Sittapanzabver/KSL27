import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchDivisions, MATCH_PUBLIC_COLS } from "@/lib/queries";
import { fetchSheetScorers } from "@/lib/sheetScorers.functions";
import { ClubCrest } from "@/components/site/ClubCrest";
import { PageHeader } from "./standings";
import { buildHead } from "@/lib/site";

export const Route = createFileRoute("/matches/")({
  component: MatchesPage,
  head: () =>
    buildHead(
      "โปรแกรมและผลการแข่งขัน",
      "โปรแกรมการแข่งขันและผลการแข่งขันทั้งหมดของ Korat Super League",
      "/matches"
    ),
});

interface Season {
  id: string;
  year: number;
  name: string;
  is_active: boolean;
}

interface Division {
  id: string;
  name: string;
  tier: number;
  season_id: string;
}

function normalize(s?: string) {
  return (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function MatchesPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [sheetRows, setSheetRows] = useState<any[]>([]);

  const [seasonId, setSeasonId] = useState<string | null>(
    null
  );

  const [divId, setDivId] = useState<string | null>(null);

  const [tab, setTab] = useState<
    "upcoming" | "results"
  >("results");

  const [loading, setLoading] = useState(true);

  // Load seasons + divisions
  useEffect(() => {
    (async () => {
      const [{ data: ss }, divs] = await Promise.all([
        supabase
          .from("seasons")
          .select("*")
          .order("year", { ascending: false }),

        fetchDivisions(),
      ]);

      const seasonList = (ss ?? []) as Season[];

      setSeasons(seasonList);
      setDivisions(divs as any);

      const active =
        seasonList.find((s) => s.is_active) ??
        seasonList[0];

      if (active) setSeasonId(active.id);
    })();
  }, []);

  // Divisions filtered by season
  const seasonDivisions = useMemo(
    () =>
      divisions
        .filter((d) => d.season_id === seasonId)
        .sort((a, b) => a.tier - b.tier),

    [divisions, seasonId]
  );

  // Default division
  useEffect(() => {
    if (!seasonId) return;

    const def =
      seasonDivisions.find((d) => d.tier === 1) ??
      seasonDivisions[0];

    setDivId(def?.id ?? null);
  }, [seasonId, seasonDivisions]);

  // Load matches + sheet scorers
  useEffect(() => {
    if (!seasonId) return;

    setLoading(true);

    const currentDiv = divisions.find((d) => d.id === divId);
    const isU16 = currentDiv?.name === "U-16";

    fetchSheetScorers({ data: isU16 })
      .then((rows) => {
        console.log("SHEET:", rows);
        setSheetRows(rows ?? []);
      })
      .catch((e) =>
        console.error("sheet scorers error", e)
      );

    supabase
      .from("matches")
      .select(
        `${MATCH_PUBLIC_COLS},
        home:clubs!matches_home_club_id_fkey(*),
        away:clubs!matches_away_club_id_fkey(*)`
      )
      .eq("season_id", seasonId)
      .order("kickoff_at", { ascending: true })
      .then(({ data, error }) => {
        if (error)
          console.error("matches fetch", error);

        console.log("MATCHES:", data);

        setMatches(data ?? []);
        setLoading(false);
      });
  }, [seasonId, divId, divisions]);

  // Filter matches
  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (
        divId &&
        m.division_id &&
        m.division_id !== divId
      )
        return false;

      return tab === "upcoming"
        ? m.status !== "completed"
        : m.status === "completed";
    });
  }, [matches, tab, divId]);

  // Group by week
  const grouped = useMemo(() => {
    const map = new Map<number, any[]>();

    filtered.forEach((m) => {
      if (!map.has(m.matchweek))
        map.set(m.matchweek, []);

      map.get(m.matchweek)!.push(m);
    });

    return Array.from(map.entries()).sort((a, b) =>
      tab === "upcoming"
        ? a[0] - b[0]
        : b[0] - a[0]
    );
  }, [filtered, tab]);

  const currentDivision = seasonDivisions.find(
    (d) => d.id === divId
  );

  const isU16 = currentDivision?.name === "U-16";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <PageHeader
        eyebrow="Match Center"
        title="โปรแกรมและผลการแข่งขัน"
        subtitle={
          isU16
            ? "ทุกแมตช์ของ Korat Super Youth League U-16"
            : "ติดตามทุกแมตช์ของ Korat Super League"
        }
      />

      {/* Season selector */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
          ฤดูกาล
        </label>

        <select
          value={seasonId ?? ""}
          onChange={(e) =>
            setSeasonId(e.target.value)
          }
          className="bg-card border border-border rounded-md px-4 py-2 font-display font-bold text-sm focus:outline-none focus:border-korat-red"
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.year}
            </option>
          ))}
        </select>
      </div>

      {/* Division tabs */}
      {seasonDivisions.length > 0 && (
        <div className="flex gap-1 mb-4 flex-wrap">
          {seasonDivisions.map((d) => (
            <button
              key={d.id}
              onClick={() => setDivId(d.id)}
              className={`px-5 py-2.5 font-display font-bold uppercase tracking-wide text-sm rounded-md transition-colors ${
                d.id === divId
                  ? "bg-korat-red text-white"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.name === "U-16"
                ? "ยุวชน U-16"
                : "ประชาชน (Senior)"}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 md:mb-10">
        {[
          {
            id: "results",
            label: "ผลการแข่งขัน",
          },
          {
            id: "upcoming",
            label: "นัดหมาย",
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 sm:flex-none px-5 sm:px-6 py-3 font-display font-bold uppercase tracking-wide text-sm transition-colors rounded-md ${
              tab === t.id
                ? "bg-korat-red text-white"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-10 md:space-y-12">
        {loading && (
          <p className="text-center text-muted-foreground py-16">
            กำลังโหลด...
          </p>
        )}

        {!loading &&
          grouped.map(([week, list], gIdx) => (
            <div key={week}>
              <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                <span className="bg-korat-red px-3 py-1 text-white text-sm rounded">
                  นัดที่ {week}
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((m, i) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    sheetRows={sheetRows}
                    featured={
                      tab === "upcoming" &&
                      gIdx === 0 &&
                      i === 0
                    }
                  />
                ))}
              </div>
            </div>
          ))}

        {!loading && grouped.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            ยังไม่มีข้อมูล
          </p>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  featured,
  sheetRows,
}: {
  match: any;
  featured?: boolean;
  sheetRows: any[];
}) {
  const navigate = useNavigate();

  const done = match.status === "completed";

  const date = new Date(match.kickoff_at);

  const sheetMatch = sheetRows.find(
    (r) =>
      normalize(r.home_team) ===
        normalize(match.home?.name) &&
      normalize(r.away_team) ===
        normalize(match.away?.name)
  );

  const homeScorers = sheetMatch?.home ?? [];
  const awayScorers = sheetMatch?.away ?? [];

  return (
    <div
      onClick={() =>
        navigate({
          to: "/matches/$matchId",
          params: { matchId: match.id },
        })
      }
      className="relative block bg-card border border-border rounded-xl p-5 md:p-6 card-shadow hover:card-shadow-hover hover:border-korat-red/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {featured && (
        <span className="absolute -top-2 left-4 bg-korat-red text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-lg">
          ★ Match of the Week
        </span>
      )}

      <div className="flex items-center justify-between text-[11px] uppercase font-bold text-muted-foreground mb-5 tracking-wider">
        <span>
          {date.toLocaleDateString("th-TH", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span
          className={
            done ? "text-success" : "text-korat-red"
          }
        >
          {done
            ? "FT"
            : date.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
        </span>
      </div>

      <div className="grid grid-cols-3 items-center gap-3">
        {/* HOME */}
        <div className="flex flex-col items-center gap-2 text-center">
          <ClubCrest
            shortName={
              match.home?.short_name ?? "?"
            }
            color={match.home?.primary_color}
            logoUrl={match.home?.logo_url}
            size="lg"
          />

          <span className="font-bold text-xs sm:text-sm leading-tight line-clamp-2">
            {match.home?.name}
          </span>
        </div>

        {/* SCORE */}
        <div className="flex items-center justify-center">
          {done ? (
            <span className="font-display text-3xl md:text-4xl font-extrabold tabular-nums">
              {match.home_score}
              <span className="text-muted-foreground mx-1">
                -
              </span>
              {match.away_score}
            </span>
          ) : (
            <span className="font-display text-2xl md:text-3xl font-black italic text-korat-red">
              VS
            </span>
          )}
        </div>

        {/* AWAY */}
        <div className="flex flex-col items-center gap-2 text-center">
          <ClubCrest
            shortName={
              match.away?.short_name ?? "?"
            }
            color={match.away?.primary_color}
            logoUrl={match.away?.logo_url}
            size="lg"
          />

          <span className="font-bold text-xs sm:text-sm leading-tight line-clamp-2">
            {match.away?.name}
          </span>
        </div>
      </div>

      {/* SCORERS */}
      {done &&
        (homeScorers.length > 0 ||
          awayScorers.length > 0) && (
          <div className="mt-5 pt-4 border-t border-border/60">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 text-right">
                {homeScorers.map(
                  (g: any, i: number) => (
                    <div key={`h-${i}`}>
                      ⚽ {g.name}

                      {g.minute !== null && (
                        <span className="text-korat-red">
                          {" "}
                          {g.minute}'
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="space-y-1 text-left">
                {awayScorers.map(
                  (g: any, i: number) => (
                    <div key={`a-${i}`}>
                      ⚽ {g.name}

                      {g.minute !== null && (
                        <span className="text-korat-red">
                          {" "}
                          {g.minute}'
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

      {/* VENUE */}
      {match.venue && (
        <div className="mt-5 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground truncate">
          📍 {match.venue}
        </div>
      )}
    </div>
  );
}
