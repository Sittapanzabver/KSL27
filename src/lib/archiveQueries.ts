import { supabase } from "@/integrations/supabase/client";

export type ClubSeason = {
  id: string;
  season_id: string;
  club_id: string | null;
  season_name: string;
  season_short_name: string;
  season_logo_url: string | null;
  season_primary_color: string | null;
  season_status: string | null;
  season_description: string | null;
};

export type ClubHistory = {
  id: string;
  display_name: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string | null;
  founded_year: number | null;
  dissolved_year: number | null;
  years_active: string | null;
  achievements: string[];
  farewell_message: string | null;
  history_text: string | null;
  photos: string[];
  status: string;
  display_order: number;
};

export async function fetchClubSeasonsByYear(year: number): Promise<ClubSeason[]> {
  const { data: season } = await supabase
    .from("seasons")
    .select("id")
    .eq("year", year)
    .maybeSingle();
  if (!season) return [];
  const { data, error } = await supabase
    .from("club_seasons")
    .select("*")
    .eq("season_id", season.id);
  if (error) throw error;
  return (data ?? []) as ClubSeason[];
}

export async function fetchClubHistory(): Promise<ClubHistory[]> {
  const { data, error } = await supabase
    .from("club_history")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    ...r,
    achievements: Array.isArray(r.achievements) ? r.achievements : [],
    photos: Array.isArray(r.photos) ? r.photos : [],
  })) as ClubHistory[];
}
