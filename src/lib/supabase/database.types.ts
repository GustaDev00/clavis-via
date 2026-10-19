
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "check_ins": {
                  Row: {
                    "created_at": string,"emotion": Database["public"]['Enums']["emotion"],"id": string,"note": string | null,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"emotion": Database["public"]['Enums']["emotion"],"id"?: string,"note"?: string | null,"user_id"?: string
                  }
                  Update: {
                    "created_at"?: string,"emotion"?: Database["public"]['Enums']["emotion"],"id"?: string,"note"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "check_ins_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"plan_day_completions": {
                  Row: {
                    "completed_at": string,"id": string,"plan_day_id": string,"plan_id": string,"reflection": string | null,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string,"id"?: string,"plan_day_id": string,"plan_id": string,"reflection"?: string | null,"user_id"?: string
                  }
                  Update: {
                    "completed_at"?: string,"id"?: string,"plan_day_id"?: string,"plan_id"?: string,"reflection"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "plan_day_completions_plan_day_id_plan_id_fkey"
      columns: ["plan_day_id","plan_id"]
isOneToOne: false
      referencedRelation: "plan_days"
      referencedColumns: ["id","plan_id"]
    },{
      foreignKeyName: "plan_day_completions_user_id_plan_id_fkey"
      columns: ["user_id","plan_id"]
isOneToOne: false
      referencedRelation: "plan_enrollments"
      referencedColumns: ["user_id","plan_id"]
    }
                  ]
                },"plan_days": {
                  Row: {
                    "action": string,"day_number": number,"id": string,"message": string,"plan_id": string,"reflection_prompt": string,"subtitle": string,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"day_number": number,"id"?: string,"message": string,"plan_id": string,"reflection_prompt": string,"subtitle": string,"title": string
                  }
                  Update: {
                    "action"?: string,"day_number"?: number,"id"?: string,"message"?: string,"plan_id"?: string,"reflection_prompt"?: string,"subtitle"?: string,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "plan_days_plan_id_fkey"
      columns: ["plan_id"]
isOneToOne: false
      referencedRelation: "plans"
      referencedColumns: ["id"]
    }
                  ]
                },"plan_enrollments": {
                  Row: {
                    "plan_id": string,"started_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "plan_id": string,"started_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "plan_id"?: string,"started_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "plan_enrollments_plan_id_fkey"
      columns: ["plan_id"]
isOneToOne: false
      referencedRelation: "plans"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "plan_enrollments_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"plans": {
                  Row: {
                    "description": string,"emotions": (Database["public"]['Enums']["emotion"])[],"id": string,"minutes_per_day": string,"palette": string,"slug": string,"sort_order": number,"summary": string,"theme": string,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description": string,"emotions"?: (Database["public"]['Enums']["emotion"])[],"id"?: string,"minutes_per_day": string,"palette"?: string,"slug": string,"sort_order"?: number,"summary": string,"theme": string,"title": string
                  }
                  Update: {
                    "description"?: string,"emotions"?: (Database["public"]['Enums']["emotion"])[],"id"?: string,"minutes_per_day"?: string,"palette"?: string,"slug"?: string,"sort_order"?: number,"summary"?: string,"theme"?: string,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"practice_completions": {
                  Row: {
                    "check_in_id": string | null,"completed_at": string,"id": string,"practice_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "check_in_id"?: string | null,"completed_at"?: string,"id"?: string,"practice_id": string,"user_id"?: string
                  }
                  Update: {
                    "check_in_id"?: string | null,"completed_at"?: string,"id"?: string,"practice_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "practice_completions_check_in_id_fkey"
      columns: ["check_in_id"]
isOneToOne: false
      referencedRelation: "check_ins"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "practice_completions_practice_id_fkey"
      columns: ["practice_id"]
isOneToOne: false
      referencedRelation: "practices"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "practice_completions_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"practices": {
                  Row: {
                    "breath_pattern": (number)[] | null,"duration_minutes": number,"emotions": (Database["public"]['Enums']["emotion"])[],"id": string,"key_message": string,"key_title": string,"kind": Database["public"]['Enums']["practice_kind"],"slug": string,"sort_order": number,"steps": (string)[],"summary": string,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "breath_pattern"?: (number)[] | null,"duration_minutes": number,"emotions": (Database["public"]['Enums']["emotion"])[],"id"?: string,"key_message": string,"key_title": string,"kind": Database["public"]['Enums']["practice_kind"],"slug": string,"sort_order"?: number,"steps": (string)[],"summary": string,"title": string
                  }
                  Update: {
                    "breath_pattern"?: (number)[] | null,"duration_minutes"?: number,"emotions"?: (Database["public"]['Enums']["emotion"])[],"id"?: string,"key_message"?: string,"key_title"?: string,"kind"?: Database["public"]['Enums']["practice_kind"],"slug"?: string,"sort_order"?: number,"steps"?: (string)[],"summary"?: string,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string,"id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"display_name": string,"id": string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string,"id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            "emotion": "ansiedade"|"cansaco"|"desanimo"|"irritacao"|"sensibilidade"|"paz"|"esperanca"|"outro","practice_kind": "respiracao"|"corpo"|"escrita"|"pausa"|"gratidao"|"contemplacao"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "emotion": ["ansiedade", "cansaco", "desanimo", "irritacao", "sensibilidade", "paz", "esperanca", "outro"],"practice_kind": ["respiracao", "corpo", "escrita", "pausa", "gratidao", "contemplacao"]
          }
        }
} as const
