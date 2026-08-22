/**
 * Placeholder Supabase database types. Once a real Supabase project and
 * schema exist, replace this whole file by running:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * The shapes below reflect the fields already visible across the ported
 * pages (business profile, product detail, dashboard widgets) so the app
 * type-checks now and needs minimal changes once real codegen replaces it.
 *
 * IMPORTANT: `Views`, `Functions`, `Enums`, and `CompositeTypes` below are
 * empty, but they must exist as keys even when empty. supabase-js's client
 * generic resolves `Database['public']` against an internal `GenericSchema`
 * type that requires all of these keys to be present. If any are missing,
 * the resolution silently falls back to `never` for every single query
 * result across the whole app -- every `.from(...).select(...)` call
 * anywhere -- instead of throwing a clear error at the point of the
 * mistake. That's what caused "Property 'x' does not exist on type
 * 'never'" errors in both requireRole.ts and AuthForm.tsx: not two
 * separate bugs, one root cause. Real `supabase gen types` output always
 * includes all five keys for exactly this reason -- don't drop any of
 * them when hand-editing this file to add new tables.
 */
export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          slug: string;
          owner_id: string;
          name: string;
          category: string;
          state: string | null;
          city: string | null;
          min_id: string | null;
          verification_level: 'registered' | 'verified' | 'advanced_verified';
          description: string | null;
          health_score: number | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['businesses']['Row']> & {
          owner_id: string;
          name: string;
          category: string;
        };
        Update: Partial<Database['public']['Tables']['businesses']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'businesses_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: 'products_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          }
        ];
      };
      investments: {
        Row: { id:string; investor_id:string; business_id:string; invested_kobo:number; current_value_kobo:number; return_pct:number; status:'active'|'completed'|'pending'; created_at:string; },
        Insert: Partial<Database['public']['Tables']['investments']['Row']> & { investor_id:string; business_id:string; invested_kobo:number; },
        Update: Partial<Database['public']['Tables']['investments']['Row']>, Relationships: []
      };
      investment_opportunities: {
        Row: { id:string; business_id:string; target_kobo:number; committed_kobo:number; min_kobo:number; projected_return_pct:number; description:string|null; status:'open'|'funded'|'closed'; created_at:string; },
        Insert: Partial<Database['public']['Tables']['investment_opportunities']['Row']> & { business_id:string; target_kobo:number; min_kobo:number; },
        Update: Partial<Database['public']['Tables']['investment_opportunities']['Row']>, Relationships: []
      };
      escrow_accounts: {
        Row: { id:string; investor_id:string; investment_id:string|null; balance_kobo:number; status:'held'|'released'|'disputed'; created_at:string; },
        Insert: Partial<Database['public']['Tables']['escrow_accounts']['Row']> & { investor_id:string; },
        Update: Partial<Database['public']['Tables']['escrow_accounts']['Row']>, Relationships: []
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: 'customer' | 'business_owner' | 'professional' | 'investor' | 'admin';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          full_name: string;
          role: Database['public']['Tables']['profiles']['Row']['role'];
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          business_id: string;
          product_id: string | null;
          customer_id: string | null;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          quantity: number;
          unit_price_kobo: number | null;
          total_kobo: number | null;
          shipping_name: string | null;
          shipping_phone: string | null;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_state: string | null;
          payment_method: string | null;
          payment_status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']> & {
          business_id: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'orders_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      team_members: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          position: string;
          phone: string | null;
          email: string | null;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['team_members']['Row']> & {
          business_id: string;
          name: string;
          position: string;
          start_date: string;
        };
        Update: Partial<Database['public']['Tables']['team_members']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'team_members_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          }
        ];
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          business_id: string;
          product_id: string | null;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          order_id: string;
          business_id: string;
          customer_id: string;
          rating: number;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'reviews_order_id_fkey';
            columns: ['order_id'];
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      business_verification_submissions: {
        Row: {
          id: string;
          business_id: string;
          status: 'draft' | 'pending' | 'approved' | 'rejected';
          notes: string | null;
          review_notes: string | null;
          submitted_at: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['business_verification_submissions']['Row']> & { business_id: string };
        Update: Partial<Database['public']['Tables']['business_verification_submissions']['Row']>;
        Relationships: [];
      };
      business_verification_documents: {
        Row: {
          id: string;
          business_id: string;
          document_type: 'registration' | 'identity' | 'address';
          file_name: string;
          storage_path: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['business_verification_documents']['Row']> & { business_id: string; document_type: 'registration' | 'identity' | 'address'; file_name: string; storage_path: string };
        Update: Partial<Database['public']['Tables']['business_verification_documents']['Row']>;
        Relationships: [];
      };
      community_posts: {
        Row: { id: string; business_id: string; sector: string; title: string | null; body: string; status: 'draft' | 'published' | 'archived'; likes_count: number; comments_count: number; created_at: string; updated_at: string; },
        Insert: Partial<Database['public']['Tables']['community_posts']['Row']> & { business_id: string; sector: string; body: string; },
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>,
        Relationships: [],
      };
      stories: {
        Row: { id: string; business_id: string; slug: string; title: string; excerpt: string | null; content: string; story_type: 'Founder Story' | 'Behind the Business' | 'Innovation Story' | 'Community Impact'; featured: boolean; status: 'draft' | 'published' | 'archived'; published_at: string | null; created_at: string; updated_at: string; },
        Insert: Partial<Database['public']['Tables']['stories']['Row']> & { business_id: string; slug: string; title: string; content: string; },
        Update: Partial<Database['public']['Tables']['stories']['Row']>,
        Relationships: [],
      };
      saved_businesses: {
        Row: {
          id: string;
          customer_id: string;
          business_id: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['saved_businesses']['Row']> & {
          customer_id: string;
          business_id: string;
        };
        Update: Partial<Database['public']['Tables']['saved_businesses']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'saved_businesses_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
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
