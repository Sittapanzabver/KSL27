import { Calendar } from "lucide-react";
import { ClubCrest } from "@/components/site/ClubCrest";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function getResultBorder(match: any): string {
  if (match.home_score == null) return "border-korat-red";
  if (match.home_score > match.away_score) return "border-green-500";
  if (match.home_score === match.away_score) return "border-yellow-400";
  return "border-red-700";
}

export function MiniMatch({ match, done }: { match: any; done?: boolean }) {
  const resultBorder = done ? getResultBorder(match) : "border-korat-red";
  const mw = match.matchweek ?? match.matchday;

  return (
    <div
      className={`relative p-4 border-l-[3px] ${resultBorder} bg-card hover:bg-secondary transition-colors rounded-r-lg`}
    >
      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground mb-2.5 tracking-wider">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {formatDate(match.kickoff_at)}
        </span>
        <div className="flex items-center gap-2">
          {mw && (
            <span className="bg-secondary text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
              MD{mw}
            </span>
          )}
          <span className={done ? "text-muted-foreground" : "text-korat-red"}>
            {done ? "FT" : formatTime(match.kickoff_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ClubCrest
            shortName={match.home.short_name}
            color={match.home.primary_color}
            logoUrl={match.home.logo_url}
            size="md"
          />
          <span className="text-xs font-bold truncate">{match.home.name}</span>
        </div>

        {done ? (
          <span className="font-display font-black text-2xl tabular-nums px-3 tracking-tighter text-white">
            {match.home_score}
            <span className="text-muted-foreground mx-0.5 font-light">–</span>
            {match.away_score}
          </span>
        ) : (
          <span className="font-display text-sm font-bold text-muted-foreground px-3">
            VS
          </span>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold truncate">{match.away.name}</span>
          <ClubCrest
            shortName={match.away.short_name}
            color={match.away.primary_color}
            logoUrl={match.away.logo_url}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
