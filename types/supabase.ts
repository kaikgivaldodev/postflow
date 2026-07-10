// Tipos gerados a partir do schema em supabase/migrations/0001_init.sql.
// Depois de rodar a migration no seu projeto Supabase, prefira regenerar
// via: `npx supabase gen types typescript --project-id <id> > types/supabase.ts`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PostType = "feed" | "story" | "reel" | "carousel";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type PlanId = "pro";
export type PlanStatus = "active" | "inactive" | "trial" | "cancelled";
export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "trialing";
export type MediaType = "image" | "video";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          cpf: string | null;
          plan_id: PlanId;
          plan_status: PlanStatus;
          timezone: string;
          trial_ends_at: string | null;
          marketing_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      instagram_accounts: {
        Row: {
          id: string;
          user_id: string;
          ig_user_id: string;
          ig_username: string;
          access_token: string;
          token_expires_at: string | null;
          profile_picture_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["instagram_accounts"]["Row"]> & {
          user_id: string;
          ig_user_id: string;
          ig_username: string;
          access_token: string;
        };
        Update: Partial<Database["public"]["Tables"]["instagram_accounts"]["Row"]>;
        Relationships: [];
      };
      scheduled_posts: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          post_type: PostType;
          caption: string | null;
          hashtags: string[];
          media_urls: string[];
          scheduled_at: string;
          status: PostStatus;
          error_message: string | null;
          ig_post_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["scheduled_posts"]["Row"]> & {
          user_id: string;
          post_type: PostType;
          scheduled_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["scheduled_posts"]["Row"]>;
        Relationships: [];
      };
      media_files: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          file_url: string;
          file_type: MediaType;
          file_size: number | null;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media_files"]["Row"]> & {
          user_id: string;
          file_url: string;
          file_type: MediaType;
        };
        Update: Partial<Database["public"]["Tables"]["media_files"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          syncpay_subscription_id: string | null;
          plan_id: PlanId;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          cancelled_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          user_id: string;
          plan_id: PlanId;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      plan_limits: {
        Row: {
          plan_id: PlanId;
          max_posts_per_month: number;
          max_instagram_accounts: number;
          has_analytics: boolean;
          has_bulk_schedule: boolean;
          has_ai_caption: boolean;
          has_priority_support: boolean;
        };
        Insert: Database["public"]["Tables"]["plan_limits"]["Row"];
        Update: Partial<Database["public"]["Tables"]["plan_limits"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
