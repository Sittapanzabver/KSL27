import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDivisions, getActiveSeasonId } from "@/lib/queries";
import { fetchStandingsFromMatches } from "@/lib/calculateStandings";
import { ClubCrest } from "@/components/site/ClubCrest";
import { DivisionTab } from "@/components/DivisionTab";
import { DIVISIONS, type DivisionKey } from "@/lib/divisions";
import { buildHead, SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/standings")({
  component: StandingsPage,
  head: () =>
    buildHead(
      "ตารางคะแนน",
      `ตารางคะแนนล่าสุดของ Korat Super League ${SITE_YEAR} และ Korat Super Youth League U-16 พร้อมสถิติทั้งหมดของแต่ละสโมสร`,
      "/standings",
    ),
});

function StandingsPage() {
  const [division, setDivision] = useState<DivisionKey>("SUPER_LEAGUE");
  const divId = DIVISIONS[division].id;

  const { data: divisions = [] } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const divs = await fetchDivisions();
      return [...divs].sort((a: any, b: any) => a.tier - b.tier);
    },
  });

  const { data: activeSeasonId } = useQuery({
    queryKey: ["active-season-id"],
    queryFn: getActiveSeasonId,
  });

  const { data: standings = [] } = useQuery({
    queryKey: ["standings-from-matches", divId],
    queryFn: () => fetchStandingsFromMatches(divId, activeSeasonId!),
    enabled: !!activeSeasonId,
  });

  const current = useMemo(() => divisions.find((d) => d.id === divId), [divisions, divId]);
  const isU16 = division === "U16" || current?.name === "U-16";

  const subtitle = isU16
    ? `Korat Super Youth League ${SITE_YEAR} — ระดับ U-16`
    : `ตารางคะแนนอัปเดตอัตโนมัติจากผลการแข่งขัน — Korat Super League ${SITE_YEAR}`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <PageHeader eyebrow="League Table" title="ตารางคะแนนลีก" subtitle={subtitle} />

      <div className="mb-6">
        <DivisionTab active={division} onChange={setDivision} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto card-shadow">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-secondary/60 text-muted-foreground text-[10px] uppercase tracking-widest">
              <th className="p-3 md:p-4 w-14">อันดับ</th>
              <th className="p-3 md:p-4">สโมสร</th>
              <th className="p-3 md:p-4 text-center">แข่ง</th>
              <th className="p-3 md:p-4 text-center hidden sm:table-cell">ชนะ</th>
              <th className="p-3 md:p-4 text-center hidden sm:table-cell">เสมอ</th>
              <th className="p-3 md:p-4 text-center hidden sm:table-cell">แพ้</th>
              <th className="p-3 md:p-4 text-center hidden md:table-cell">ได้</th>
              <th className="p-3 md:p-4 text-center hidden md:table-cell">เสีย</th>
              <th className="p-3 md:p-4 text-center">+/-</th>
              <th className="p-3 md:p-4 text-center bg-korat-red/10 text-korat-red">แต้ม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {standings.map((row, i) => {
              const gd = row.goals_for - row.goals_against;
              const medal =
                i === 0
                  ? "medal-gold"
                  : i === 1
                    ? "medal-silver"
                    : i === 2
                      ? "medal-bronze"
                      : "medal-none";
              return (
                <tr
                  key={row.id}
                  className={`${medal} hover:bg-korat-red/5 transition-colors group`}
                >
                  <td className="p-3 md:p-4 font-display text-xl md:text-2xl tabular-nums">
                    <span
                      className={
                        i < 3
                          ? "text-korat-red"
                          : i >= standings.length - 1
                            ? "text-muted-foreground"
                            : ""
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="p-3 md:p-4">
                    <Link
                      to="/clubs/$slug"
                      params={{ slug: row.club.slug }}
                      className="flex items-center gap-3 group-hover:text-korat-red transition-colors"
                    >
                      <ClubCrest
                        shortName={row.club.short_name}
                        color={row.club.primary_color}
                        logoUrl={row.club.logo_url}
                        size="md"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm md:text-base truncate">
                          {row.club.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate hidden sm:block">
                          {row.club.home_venue}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-sm">{row.played}</td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-success font-semibold text-sm hidden sm:table-cell">
                    {row.won}
                  </td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-sm hidden sm:table-cell">
                    {row.drawn}
                  </td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-muted-foreground text-sm hidden sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-sm hidden md:table-cell">
                    {row.goals_for}
                  </td>
                  <td className="p-3 md:p-4 text-center tabular-nums text-sm hidden md:table-cell">
                    {row.goals_against}
                  </td>
                  <td
                    className={`p-3 md:p-4 text-center tabular-nums text-sm font-bold ${gd > 0 ? "text-success" : gd < 0 ? "text-korat-red" : ""}`}
                  >
                    {gd > 0 ? "+" : ""}
                    {gd}
                  </td>
                  <td className="p-3 md:p-4 text-center font-display text-xl md:text-2xl font-bold tabular-nums bg-korat-red/5">
                    {row.points}
                  </td>
                </tr>
              );
            })}
            {standings.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground text-sm">
                  ยังไม่มีผลการแข่งขันของฤดูกาล {SITE_YEAR} — รอโปรแกรมเปิดฤดูกาล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: "oklch(0.82 0.16 88)" }} />
          อันดับ 1 — แชมป์
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: "oklch(0.78 0.02 250)" }} />
          อันดับ 2
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: "oklch(0.62 0.13 55)" }} />
          อันดับ 3
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 bg-muted-foreground/50 rounded-sm" />
          อันดับสุดท้าย — ต้องลุ้นรอด
        </span>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-red mb-3">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
