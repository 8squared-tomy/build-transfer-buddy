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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      club_members: {
        Row: {
          club_role: string
          id: string
          is_active: boolean
          name: string
          photo_url: string | null
          sort_order: number
        }
        Insert: {
          club_role?: string
          id?: string
          is_active?: boolean
          name: string
          photo_url?: string | null
          sort_order?: number
        }
        Update: {
          club_role?: string
          id?: string
          is_active?: boolean
          name?: string
          photo_url?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      editor_sessions: {
        Row: {
          expires_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          expires_at: string
          session_id: string
          user_id: string
        }
        Update: {
          expires_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          bac_registration_number: string | null
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          needs_accommodation: boolean
          notes: string | null
          phone: string | null
          residence: string | null
          status: string
          university: string
        }
        Insert: {
          bac_registration_number?: string | null
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          needs_accommodation?: boolean
          notes?: string | null
          phone?: string | null
          residence?: string | null
          status?: string
          university: string
        }
        Update: {
          bac_registration_number?: string | null
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          needs_accommodation?: boolean
          notes?: string | null
          phone?: string | null
          residence?: string | null
          status?: string
          university?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          event_id: string
          sponsor_id: string
        }
        Insert: {
          event_id: string
          sponsor_id: string
        }
        Update: {
          event_id?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsors_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          ends_at: string | null
          id: string
          location_ar: string | null
          location_en: string | null
          registration_open: boolean
          starts_at: string
          status: string
          title_ar: string | null
          title_en: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          ends_at?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          registration_open?: boolean
          starts_at: string
          status?: string
          title_ar?: string | null
          title_en: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          ends_at?: string | null
          id?: string
          location_ar?: string | null
          location_en?: string | null
          registration_open?: boolean
          starts_at?: string
          status?: string
          title_ar?: string | null
          title_en?: string
        }
        Relationships: []
      }
      external_links: {
        Row: {
          id: string
          is_active: boolean
          label_ar: string | null
          label_en: string
          platform: string | null
          sort_order: number
          url: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          label_ar?: string | null
          label_en: string
          platform?: string | null
          sort_order?: number
          url: string
        }
        Update: {
          id?: string
          is_active?: boolean
          label_ar?: string | null
          label_en?: string
          platform?: string | null
          sort_order?: number
          url?: string
        }
        Relationships: []
      }
      membership_requests: {
        Row: {
          created_at: string
          email: string
          fide_rating: number | null
          full_name: string
          id: string
          interests: string | null
          level: string
          message: string | null
          phone: string | null
          status: string
          university: string
          years_playing: string | null
        }
        Insert: {
          created_at?: string
          email: string
          fide_rating?: number | null
          full_name: string
          id?: string
          interests?: string | null
          level: string
          message?: string | null
          phone?: string | null
          status?: string
          university: string
          years_playing?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          fide_rating?: number | null
          full_name?: string
          id?: string
          interests?: string | null
          level?: string
          message?: string | null
          phone?: string | null
          status?: string
          university?: string
          years_playing?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          bucket_key: string
          hits: number
          window_start: string
        }
        Insert: {
          bucket_key: string
          hits?: number
          window_start: string
        }
        Update: {
          bucket_key?: string
          hits?: number
          window_start?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value_ar: string
          value_en: string
        }
        Insert: {
          key: string
          updated_at?: string
          value_ar?: string
          value_en?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value_ar?: string
          value_en?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          sort_order: number
          website_url: string | null
        }
        Insert: {
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          sort_order?: number
          website_url?: string | null
        }
        Update: {
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          sort_order?: number
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_admin: { Args: never; Returns: boolean }
      check_rate_limit: {
        Args: { p_bucket: string; p_max: number; p_window: string }
        Returns: undefined
      }
      get_event_seat_counts: {
        Args: never
        Returns: {
          confirmed_count: number
          event_id: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_editor_identity: { Args: never; Returns: boolean }
      register_for_event:
        | {
            Args: {
              p_email: string
              p_event_id: string
              p_full_name: string
              p_phone: string
              p_university: string
            }
            Returns: string
          }
        | {
            Args: {
              p_bac_registration_number: string
              p_email: string
              p_event_id: string
              p_full_name: string
              p_needs_accommodation: boolean
              p_phone: string
              p_residence: string
              p_university: string
            }
            Returns: string
          }
      submit_membership_request: {
        Args: {
          p_email: string
          p_fide_rating: number
          p_full_name: string
          p_interests: string
          p_level: string
          p_message: string
          p_phone: string
          p_university: string
          p_years_playing: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
