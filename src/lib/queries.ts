import { supabase } from "@/integrations/supabase/client";
import { SITE_YEAR } from "@/lib/site";
import { DIVISIONS } from "@/lib/divisions";

// Public-safe columns on matches. Excludes financial/viewership columns
// (live_viewers_*, tickets_*, *_revenue) which are revoked from anon/authenticated.
export const MATCH_PUBLIC_COLS =
  "id, season_id, division_id, matchweek, home_club_id, away_club_id, kickoff_at, venue, home_score, away_score, status, mvp_player_id, highlights_url, attendance, referee, sponsor_banner_url, notes, created_at";

/**
 * สโมสรที่พักฤดูกาล 2027 (owner ยืนยัน 28/08) — SSOT ของโค้ด
 * พิมาย เอฟซี: โค้ชเติ้ลไปช่วยโคราช ซิตี้ → ไม่ส่งทีมลง 2027 (ยังไม่ยุบ อาจกลับมา)
 * หมายเหตุ: เมื่อย้าย DB ออกจาก Lovable Cloud แล้ว ให้ย้าย logic นี้ไป club_seasons ใน DB
 */
export const CLUBS_ON_BREAK_2027 = ["phimai-fc"] as const;

export function isClubOnBreak(slug: string | undefined): boolean {
  return !!slug && (CLUBS_ON_BREAK_2027 as readonly string[]).includes(slug);
}

export type Club = Awaited<ReturnType<typeof fetchActiveSeasonClubs>>[number];
export type Division = Awaited<ReturnType<typeof fetchDivisions>>[number];
export type NewsItem = Awaited<ReturnType<typeof fetchNews>>[number];
export type Sponsor = Awaited<ReturnType<typeof fetchSponsors>>[number];
export type Match = Awaited<ReturnType<typeof fetchAllMatches>>[number];
export type TopScorer = Awaited<ReturnType<typeof fetchTopScorersTable>>[number];
export type Player = Awaited<ReturnType<typeof fetchPlayersByClub>>[number];
export type MatchEvent = Awaited<ReturnType<typeof fetchMatchEvents>>[number];

export async function fetchStandings(divisionId: string = "bd770ed0-2027-47e0-ab34-901a151e9f7c") {
  const { data, error } = await supabase
    .from("standings")
    .select("*, club:clubs(*)")
    .eq("division_id", divisionId)
    .order("points", { ascending: false })
    .order("goal_difference", { ascending: false })
    .order("goals_for", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchDivisions() {
  const { data, error } = await supabase
    .from("divisions")
    .select("*, season:seasons(year, name, is_active)")
    .order("tier");
  if (error) throw error;
  return data ?? [];
}

export async function fetchClubs() {
  const { data, error } = await supabase.from("clubs").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

/**
 * ดึงสโมสรที่ลงแข่งในฤดูกาลปัจจุบัน (division SUPER_LEAGUE 2027)
 * ใช้กรอง roster ไม่ให้โชว์สโมสรที่พักฤดูกาล (เช่น พิมาย)
 */
export async function fetchActiveSeasonClubs() {
  // Roster ฤดูกาลปัจจุบัน — clubs ที่ไม่ได้พักฤดูกาล
  // (DB ยังอยู่บน Lovable Cloud และ division_id ยังเป็นของ 2026 — เลยกรองด้วย slug แทน
  //  เมื่อย้าย DB เป็นของตัวเองแล้ว: เปลี่ยนเป็น .eq("division_id", DIVISIONS.SUPER_LEAGUE.id))
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .not("slug", "in", `(${CLUBS_ON_BREAK_2027.join(",")})`)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchClubBySlug(slug: string) {
  const { data, error } = await supabase.from("clubs").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPlayersByClub(clubId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("club_id", clubId)
    .order("jersey_number");
  if (error) throw error;
  return data ?? [];
}

export async function fetchTopScorers(limit = 10, divisionId?: string) {
  let q = supabase
    .from("players")
    .select("*, club:clubs!inner(name, short_name, slug, primary_color, logo_url, division_id)")
    .gt("goals", 0)
    .order("goals", { ascending: false })
    .order("assists", { ascending: false })
    .limit(limit);
  if (divisionId) q = q.eq("club.division_id", divisionId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchUpcomingMatches(limit = 5) {
  const activeSeason = await getActiveSeasonId();
  if (!activeSeason) return [];
  const { data, error } = await supabase
    .from("matches")
    .select(
      `${MATCH_PUBLIC_COLS}, home:clubs!matches_home_club_id_fkey(*), away:clubs!matches_away_club_id_fkey(*)`,
    )
    .eq("status", "scheduled")
    .eq("season_id", activeSeason)
    .order("kickoff_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchRecentResults(limit = 5) {
  const activeSeason = await getActiveSeasonId();
  if (!activeSeason) return [];
  const { data, error } = await supabase
    .from("matches")
    .select(
      `${MATCH_PUBLIC_COLS}, home:clubs!matches_home_club_id_fkey(*), away:clubs!matches_away_club_id_fkey(*)`,
    )
    .eq("status", "completed")
    .eq("season_id", activeSeason)
    .order("kickoff_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/** id ของ season ที่ active (is_active = true) — ใช้กรองข้อมูลหน้าแรก/แมตช์ให้เป็นฤดูกาลปัจจุบัน */
export async function getActiveSeasonId(): Promise<string | null> {
  const { data, error } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function fetchAllMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select(
      `${MATCH_PUBLIC_COLS}, home:clubs!matches_home_club_id_fkey(*), away:clubs!matches_away_club_id_fkey(*)`,
    )
    .order("kickoff_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMatchById(id: string) {
  const { data, error } = await supabase
    .from("matches")
    .select(
      `${MATCH_PUBLIC_COLS}, home:clubs!matches_home_club_id_fkey(*), away:clubs!matches_away_club_id_fkey(*), mvp:players!matches_mvp_player_id_fkey(*)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMatchEvents(matchId: string) {
  const { data, error } = await supabase
    .from("match_events")
    .select("*, player:players(name, jersey_number), club:clubs(name, short_name, primary_color)")
    .eq("match_id", matchId)
    .order("minute", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMatchPhotos(matchId: string) {
  const { data, error } = await supabase
    .from("match_photos")
    .select("*")
    .eq("match_id", matchId)
    .order("display_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchNews(limit = 10) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSponsors() {
  const { data, error } = await supabase.from("sponsors").select("*").order("display_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchTopScorersTable(category: "senior" | "u16", season = Number(SITE_YEAR)) {
  const { data, error } = await supabase
    .from("top_scorers")
    .select("*")
    .eq("category", category)
    .eq("season", season)
    .order("goals", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllPlayers() {
  const { data, error } = await supabase
    .from("players")
    .select("*, club:clubs(name, short_name, slug, primary_color)")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
