export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      club_history: {
        Row: {
          achievements: Json
          club_id: string | null
          created_at: string
          display_name: string
          display_order: number
          dissolved_year: number | null
          farewell_message: string | null
          founded_year: number | null
          history_text: string | null
          id: string
          logo_url: string | null
          photos: Json
          primary_color: string | null
          short_name: string
          status: Database["public"]["Enums"]["club_status"]
          updated_at: string
          years_active: string | null
        }
        Insert: {
          achievements?: Json
          club_id?: string | null
          created_at?: string
          display_name: string
          display_order?: number
          dissolved_year?: number | null
          farewell_message?: string | null
          founded_year?: number | null
          history_text?: string | null
          id?: string
          logo_url?: string | null
          photos?: Json
          primary_color?: string | null
          short_name: string
          status?: Database["public"]["Enums"]["club_status"]
          updated_at?: string
          years_active?: string | null
        }
        Update: {
          achievements?: Json
          club_id?: string | null
          created_at?: string
          display_name?: string
          display_order?: number
          dissolved_year?: number | null
          farewell_message?: string | null
          founded_year?: number | null
          history_text?: string | null
          id?: string
          logo_url?: string | null
          photos?: Json
          primary_color?: string | null
          short_name?: string
          status?: Database["public"]["Enums"]["club_status"]
          updated_at?: string
          years_active?: string | null
        }
        Relationships: []
      }
      club_seasons: {
        Row: {
          club_id: string | null
          created_at: string
          id: string
          season_description: string | null
          season_id: string
          season_logo_url: string | null
          season_name: string
          season_primary_color: string | null
          season_short_name: string
          season_status: string | null
          updated_at: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          id?: string
          season_description?: string | null
          season_id: string
          season_logo_url?: string | null
          season_name: string
          season_primary_color?: string | null
          season_short_name: string
          season_status?: string | null
          updated_at?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          id?: string
          season_description?: string | null
          season_id?: string
          season_logo_url?: string | null
          season_name?: string
          season_primary_color?: string | null
          season_short_name?: string
          season_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          capacity: number | null
          cover_url: string | null
          created_at: string
          description: string | null
          dissolved_year: number | null
          district: string | null
          division_id: string | null
          founded_year: number | null
          gallery_urls: string[] | null
          history: string | null
          home_venue: string | null
          id: string
          logo_url: string | null
          manager_name: string | null
          manager_photo_url: string | null
          name: string
          primary_color: string | null
          short_name: string
          slug: string
          social_facebook: string | null
          social_instagram: string | null
          social_line: string | null
          stadium_address: string | null
          stadium_map_url: string | null
          stadium_name: string | null
          status: Database["public"]["Enums"]["club_status"]
        }
        Insert: {
          capacity?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          dissolved_year?: number | null
          district?: string | null
          division_id?: string | null
          founded_year?: number | null
          gallery_urls?: string[] | null
          history?: string | null
          home_venue?: string | null
          id?: string
          logo_url?: string | null
          manager_name?: string | null
          manager_photo_url?: string | null
          name: string
          primary_color?: string | null
          short_name: string
          slug: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_line?: string | null
          stadium_address?: string | null
          stadium_map_url?: string | null
          stadium_name?: string | null
          status?: Database["public"]["Enums"]["club_status"]
        }
        Update: {
          capacity?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          dissolved_year?: number | null
          district?: string | null
          division_id?: string | null
          founded_year?: number | null
          gallery_urls?: string[] | null
          history?: string | null
          home_venue?: string | null
          id?: string
          logo_url?: string | null
          manager_name?: string | null
          manager_photo_url?: string | null
          name?: string
          primary_color?: string | null
          short_name?: string
          slug?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_line?: string | null
          stadium_address?: string | null
          stadium_map_url?: string | null
          stadium_name?: string | null
          status?: Database["public"]["Enums"]["club_status"]
        }
        Relationships: [
          {
            foreignKeyName: "clubs_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      divisions: {
        Row: {
          created_at: string
          id: string
          name: string
          season_id: string
          tier: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          season_id: string
          tier?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          season_id?: string
          tier?: number
        }
        Relationships: [
          {
            foreignKeyName: "divisions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      ksl_season_stats: {
        Row: {
          id: number
          live_views: number | null
          merch_sales: number | null
          on_site_attendance: number | null
          period: string | null
          season_year: string | null
          sponsorship_injection: number | null
          ticket_sales: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          live_views?: number | null
          merch_sales?: number | null
          on_site_attendance?: number | null
          period?: string | null
          season_year?: string | null
          sponsorship_injection?: number | null
          ticket_sales?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          live_views?: number | null
          merch_sales?: number | null
          on_site_attendance?: number | null
          period?: string | null
          season_year?: string | null
          sponsorship_injection?: number | null
          ticket_sales?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      match_events: {
        Row: {
          club_id: string | null
          created_at: string
          detail: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          match_id: string
          minute: number | null
          player_id: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          detail?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          match_id: string
          minute?: number | null
          player_id?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string
          detail?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          match_id?: string
          minute?: number | null
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_photos: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          match_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          match_id: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          match_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_photos_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          attendance: number | null
          away_club_id: string
          away_score: number | null
          created_at: string
          division_id: string | null
          highlights_url: string | null
          home_club_id: string
          home_score: number | null
          id: string
          kickoff_at: string
          live_viewers_main: number | null
          live_viewers_total: number | null
          live_viewers_u16: number | null
          matchweek: number
          merch_revenue: number | null
          mvp_player_id: string | null
          notes: string | null
          referee: string | null
          scorer_away: string | null
          scorer_home: string | null
          season_id: string | null
          season_tickets_revenue: number | null
          season_tickets_sold: number | null
          sponsor_banner_url: string | null
          sponsor_revenue: number | null
          status: string
          ticket_revenue: number | null
          tickets_sold: number | null
          total_revenue: number | null
          venue: string | null
        }
        Insert: {
          attendance?: number | null
          away_club_id: string
          away_score?: number | null
          created_at?: string
          division_id?: string | null
          highlights_url?: string | null
          home_club_id: string
          home_score?: number | null
          id?: string
          kickoff_at: string
          live_viewers_main?: number | null
          live_viewers_total?: number | null
          live_viewers_u16?: number | null
          matchweek: number
          merch_revenue?: number | null
          mvp_player_id?: string | null
          notes?: string | null
          referee?: string | null
          scorer_away?: string | null
          scorer_home?: string | null
          season_id?: string | null
          season_tickets_revenue?: number | null
          season_tickets_sold?: number | null
          sponsor_banner_url?: string | null
          sponsor_revenue?: number | null
          status?: string
          ticket_revenue?: number | null
          tickets_sold?: number | null
          total_revenue?: number | null
          venue?: string | null
        }
        Update: {
          attendance?: number | null
          away_club_id?: string
          away_score?: number | null
          created_at?: string
          division_id?: string | null
          highlights_url?: string | null
          home_club_id?: string
          home_score?: number | null
          id?: string
          kickoff_at?: string
          live_viewers_main?: number | null
          live_viewers_total?: number | null
          live_viewers_u16?: number | null
          matchweek?: number
          merch_revenue?: number | null
          mvp_player_id?: string | null
          notes?: string | null
          referee?: string | null
          scorer_away?: string | null
          scorer_home?: string | null
          season_id?: string | null
          season_tickets_revenue?: number | null
          season_tickets_sold?: number | null
          sponsor_banner_url?: string | null
          sponsor_revenue?: number | null
          status?: string
          ticket_revenue?: number | null
          tickets_sold?: number | null
          total_revenue?: number | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_club_id_fkey"
            columns: ["away_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_club_id_fkey"
            columns: ["home_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_mvp_player_id_fkey"
            columns: ["mvp_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          appearances: number
          assists: number
          category: string | null
          clean_sheets: number
          club_code: string | null
          club_id: string | null
          created_at: string
          date_of_birth: string | null
          goals: number
          id: string
          jersey_number: number | null
          minutes_played: number
          name: string
          nationality: string | null
          photo_url: string | null
          position: string | null
          position_code: string | null
          red_cards: number
          yellow_cards: number
        }
        Insert: {
          appearances?: number
          assists?: number
          category?: string | null
          clean_sheets?: number
          club_code?: string | null
          club_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          goals?: number
          id?: string
          jersey_number?: number | null
          minutes_played?: number
          name: string
          nationality?: string | null
          photo_url?: string | null
          position?: string | null
          position_code?: string | null
          red_cards?: number
          yellow_cards?: number
        }
        Update: {
          appearances?: number
          assists?: number
          category?: string | null
          clean_sheets?: number
          club_code?: string | null
          club_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          goals?: number
          id?: string
          jersey_number?: number | null
          minutes_played?: number
          name?: string
          nationality?: string | null
          photo_url?: string | null
          position?: string | null
          position_code?: string | null
          red_cards?: number
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "players_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string | null
          year: number
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date?: string | null
          year: number
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string | null
          year?: number
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          logo_url: string | null
          name: string
          tier: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name: string
          tier?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          logo_url?: string | null
          name?: string
          tier?: string
          website?: string | null
        }
        Relationships: []
      }
      standings: {
        Row: {
          club_id: string
          division_id: string | null
          drawn: number
          goal_difference: number | null
          goals_against: number
          goals_for: number
          id: string
          lost: number
          played: number
          points: number
          season_id: string | null
          updated_at: string
          won: number
        }
        Insert: {
          club_id: string
          division_id?: string | null
          drawn?: number
          goal_difference?: number | null
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          season_id?: string | null
          updated_at?: string
          won?: number
        }
        Update: {
          club_id?: string
          division_id?: string | null
          drawn?: number
          goal_difference?: number | null
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          season_id?: string | null
          updated_at?: string
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      top_scorers: {
        Row: {
          category: string
          club_code: string
          created_at: string
          goals: number
          id: string
          name: string
          season: number
          updated_at: string
        }
        Insert: {
          category: string
          club_code: string
          created_at?: string
          goals?: number
          id?: string
          name: string
          season: number
          updated_at?: string
        }
        Update: {
          category?: string
          club_code?: string
          created_at?: string
          goals?: number
          id?: string
          name?: string
          season?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalc_player_stats: { Args: { _player: string }; Returns: undefined }
      recalc_standings: {
        Args: { _division: string; _season: string }
        Returns: undefined
      }
    }
    Enums: {
      club_status: "active" | "inactive" | "dissolved" | "rebranding"
      event_type:
        | "goal"
        | "assist"
        | "yellow_card"
        | "red_card"
        | "substitution"
        | "own_goal"
        | "penalty"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      club_status: ["active", "inactive", "dissolved", "rebranding"],
      event_type: [
        "goal",
        "assist",
        "yellow_card",
        "red_card",
        "substitution",
        "own_goal",
        "penalty",
      ],
    },
  },
} as const
