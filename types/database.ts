// Supabase DB 스키마 타입 (스키마와 1:1, snake_case)
// Supabase 클라이언트 제네릭 Database 타입 또는 수동 정의

export interface UserRow {
  id: string;
  google_id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  product_type: "Molded" | "Extruded" | "CIP (Isotropic)" | null;
  summary: string | null;
  description: string | null;
  applications: string[] | null;
  specifications: Record<string, { value: string; unit: string }> | null;
  created_at: string;
  created_by: string;
}

export interface InquiryRow {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  ai_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryInsert {
  user_id: string;
  product_id: string;
  content: string;
  ai_response?: string | null;
}

export interface InquiryUpdate {
  ai_response?: string | null;
}

export interface AiResponseRow {
  id: string;
  user_id: string | null;
  prompt: string;
  response: string;
  category: string | null;
  token_usage: any | null;
  provider: string | null;
  created_at: string;
}

export interface AiResponseInsert {
  user_id?: string | null;
  prompt: string;
  response: string;
  category?: string | null;
  token_usage?: any | null;
  provider?: string | null;
}

/** Supabase Database 타입 (클라이언트 제네릭용) */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: {
          id: string;
          google_id: string;
          email?: string | null;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserRow, "id">>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: {
          name: string;
          product_type?: "Molded" | "Extruded" | "CIP (Isotropic)" | null;
          summary?: string | null;
          description?: string | null;
          applications?: string[] | null;
          specifications?: Record<string, { value: string; unit: string }> | null;
          created_at?: string;
          created_by?: string;
        };
        Update: Partial<Omit<ProductRow, "id">>;
        Relationships: [];
      };
      inquiries: {
        Row: InquiryRow;
        Insert: InquiryInsert & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: InquiryUpdate;
        Relationships: [];
      };
      ai_responses: {
        Row: AiResponseRow;
        Insert: AiResponseInsert;
        Update: Partial<AiResponseRow>;
        Relationships: [
          {
            foreignKeyName: "ai_responses_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
