/**
 * Placeholder Supabase database types. Once a real Supabase project and
 * schema exist, replace this whole file by running:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * The shapes below reflect the fields already visible across the ported
 * pages (business profile, product detail, dashboard widgets) so the app
 * type-checks now and needs minimal changes once real codegen replaces it.
 */
export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          state: string;
          city: string;
          min_id: string;
          verification_level: 'registered' | 'verified' | 'advanced_verified';
          description: string | null;
          health_score: number | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['businesses']['Row']> & {
          name: string;
          category: string;
        };
        Update: Partial<Database['public']['Tables']['businesses']['Row']>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          business_id: string;
          name: string;
          price_kobo: number;
          compare_at_price_kobo: number | null;
          description: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['products']['Row']> & {
          business_id: string;
          name: string;
          price_kobo: number;
        };
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'customer' | 'business_owner' | 'professional' | 'investor' | 'admin';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          full_name: string;
          role: Database['public']['Tables']['profiles']['Row']['role'];
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
    };
  };
}
