import { Link } from "@tanstack/react-router";
import { ClubCrest } from "@/components/site/ClubCrest";
import { useI18n } from "@/lib/i18n";
import { SectionTitle } from "./SectionTitle";
import { MiniMatch } from "./MiniMatch";

// Note: ResultsSection is kept exported for backward compatibility but no longer
// rendered inside StandingsSection. Final match results were removed from the
// homepage in favor of the Hall of Fame preview.


export function StandingsSection({
  standings,
}: {
  standings: any[];
  results?: any[];
}) {
  const { t } = useI18n();

  return (
    <section>
      <SectionTitle
        title={t("sec.standings")}
        link="/standings"
        linkLabel={t("sec.viewAll")}
      />
      <div className="rounded-xl border border-border bg-card overflow-x-auto card-shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/60 text-muted-foreground text-[10px] uppercase tracking-widest">
              <th className="p-3 w-10">#</th>
              <th className="p-3">{t("tbl.club")}</th>
              <th className="p-3 text-center">{t("tbl.played")}</th>
              <th className="p-3 text-center hidden sm:table-cell">{t("tbl.won")}</th>
              <th className="p-3 text-center hidden sm:table-cell">D</th>
              <th className="p-3 text-center hidden sm:table-cell">{t("tbl.lost")}</th>
              <th className="p-3 text-center hidden md:table-cell">+/-</th>
              <th className="p-3 text-center bg-korat-red/10 text-korat-red">{t("tbl.points")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {standings.slice(0, 8).map((row, i) => {
              const gd = row.goals_for - row.goals_against;
              const total = Math.min(standings.length, 8);
              const isLast = i === total - 1 && standings.length >= 4;
              const borderColor =
                i === 0
                  ? "#f0b429"
                  : i === 1
                  ? "#a0aec0"
                  : i === 2
                  ? "#6b7280"
                  : isLast
                  ? "#8b0000"
                  : "transparent";
              const isChamp = i === 0;
              return (
                <tr
                  key={row.id}
                  className="hover:bg-korat-red/5 transition-colors group"
                  style={{ borderLeft: `4px solid ${borderColor}` }}
                >
                  <td className="p-3 font-display text-base tabular-nums">
                    <span className={i < 3 ? "text-korat-red font-extrabold" : "text-muted-foreground"}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      to="/clubs/$slug"
                      params={{ slug: row.club.slug }}
                      className="flex items-center gap-2 group-hover:text-korat-red transition-colors"
                    >
                      <ClubCrest
                        shortName={row.club.short_name}
                        color={row.club.primary_color}
                        logoUrl={row.club.logo_url}
                        size="md"
                      />
                      <span className="text-sm font-semibold truncate">
                        {row.club.name}
                      </span>
                      {isChamp && (
                        <span className="ml-1 inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-asphalt text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow shrink-0">
                          🏆 แชมป์
                        </span>
                      )}
                      {isLast && (
                        <span className="ml-1 inline-flex items-center bg-korat-red/10 text-korat-red text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border border-korat-red/40 shrink-0">
                          เพลย์ออฟ
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="p-3 text-center tabular-nums text-muted-foreground text-sm">
                    {row.played}
                  </td>
                  <td className="p-3 text-center tabular-nums text-sm text-emerald-400 font-semibold hidden sm:table-cell">
                    {row.won}
                  </td>
                  <td className="p-3 text-center tabular-nums text-sm text-muted-foreground hidden sm:table-cell">
                    {row.drawn ?? row.draw ?? "-"}
                  </td>
                  <td className="p-3 text-center tabular-nums text-muted-foreground text-sm hidden sm:table-cell">
                    {row.lost}
                  </td>
                  <td
                    className={`p-3 text-center tabular-nums text-sm font-bold hidden md:table-cell ${
                      gd > 0
                        ? "text-emerald-400"
                        : gd < 0
                        ? "text-korat-red"
                        : ""
                    }`}
                  >
                    {gd > 0 ? "+" : ""}
                    {gd}
                  </td>
                  <td className="p-3 text-center font-display text-lg font-extrabold tabular-nums bg-korat-red/5 text-white">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}


export function ResultsSection({ results }: { results: any[] }) {
  const { t } = useI18n();
  return (
    <div className="mt-10">
      <SectionTitle
        title={t("sec.finalResults")}
        link="/matches"
        linkLabel={t("sec.all")}
        small
      />
      <div className="space-y-2">
        {results.map((m) => (
          <MiniMatch key={m.id} match={m} done />
        ))}
      </div>
    </div>
  );
}
