// Compute league standings from a list of completed matches.
// Each match should include home/away club objects and home_score/away_score.

import type { Club } from "@/lib/queries";

export interface MatchLike {
  id: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home?: Club | null;
  away?: Club | null;
}

export interface StandingRow {
  id: string;
  club_id: string;
  club: Club;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export function calculateStandings(matches: MatchLike[]): StandingRow[] {
  const table = new Map<string, StandingRow>();

  const ensure = (club: Club | null | undefined): StandingRow | null => {
    if (!club?.id) return null;
    let row = table.get(club.id);
    if (!row) {
      row = {
        id: club.id,
        club_id: club.id,
        club,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0,
      };
      table.set(club.id, row);
    }
    return row;
  };

  for (const m of matches ?? []) {
    if (m?.status !== "completed") continue;
    if (m.home_score == null || m.away_score == null) continue;

    const home = ensure(m.home);
    const away = ensure(m.away);
    if (!home || !away) continue;

    const hs = Number(m.home_score);
    const as = Number(m.away_score);

    home.played += 1;
    away.played += 1;
    home.goals_for += hs;
    home.goals_against += as;
    away.goals_for += as;
    away.goals_against += hs;

    if (hs > as) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (hs < as) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const rows = Array.from(table.values()).map((r) => ({
    ...r,
    goal_difference: r.goals_for - r.goals_against,
  }));

  rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.goal_difference - a.goal_difference ||
      b.goals_for - a.goals_for ||
      (a.club?.name ?? "").localeCompare(b.club?.name ?? ""),
  );

  return rows;
}

export async function fetchStandingsFromMatches(divisionId: string, seasonId?: string) {
  const { supabase } = await import("@/integrations/supabase/client");
  const { MATCH_PUBLIC_COLS } = await import("@/lib/queries");
  let q = supabase
    .from("matches")
    .select(
      `${MATCH_PUBLIC_COLS}, home:clubs!matches_home_club_id_fkey(*), away:clubs!matches_away_club_id_fkey(*)`,
    )
    .eq("division_id", divisionId)
    .eq("status", "completed");
  if (seasonId) q = q.eq("season_id", seasonId);
  const { data, error } = await q;
  if (error) throw error;
  return calculateStandings(data ?? []);
}
