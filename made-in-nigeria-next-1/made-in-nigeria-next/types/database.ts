/**
 * Supabase database types for the Made in Nigeria platform.
 * 
 * To regenerate from your actual Supabase project:
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 * 
 * IMPORTANT: `Views`, `Functions`, `Enums`, and `CompositeTypes` below are
 * empty, but they must exist as keys even when empty. supabase-js's client
 * generic resolves `Database['public']` against an internal `GenericSchema`
 * type that requires all of these keys to be present.
 */
export interface Database {
  public: {
    Tables: {
      // ============================================================
      // EXISTING TABLES (from your original codebase)
      // ============================================================
      
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
          status: 'pending' | 'delivered';
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

      // ============================================================
      // NEW INVESTOR HUB TABLES
      // ============================================================

      /**
       * Investor Profiles - Extended investor information
       * Links to profiles table via user_id
       */
      investor_profiles: {
        Row: {
          id: string;
          user_id: string;
          investor_type: 'first_time' | 'experienced' | 'angel' | 'impact' | 'diaspora' | 'corporate' | 'government' | 'vc' | 'strategic';
          preferred_sectors: string[]; // Array of industry categories
          preferred_stages: string[]; // startup, growth, expansion, established
          investment_size_min: number | null;
          investment_size_max: number | null;
          involvement_level: 'hands_off' | 'advisory' | 'active' | 'strategic';
          risk_tolerance: number | null; // 1-10 scale
          geographic_preference: string[]; // Array of states or regions
          women_led_preferred: boolean;
          youth_led_preferred: boolean;
          sustainability_preferred: boolean;
          community_impact_preferred: boolean;
          verification_status: 'pending' | 'verified' | 'rejected';
          terms_accepted: boolean;
          terms_accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['investor_profiles']['Row']> & {
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['investor_profiles']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'investor_profiles_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Investment Opportunities - Businesses seeking investment
       */
      investment_opportunities: {
        Row: {
          id: string;
          business_id: string;
          amount_raised: number | null;
          amount_seeking: number;
          investment_type: 'equity' | 'debt' | 'convertible_note' | 'revenue_share' | 'grant';
          equity_offered: number | null; // Percentage if equity
          use_of_funds: Record<string, number> | null; // JSON breakdown
          funding_deadline: string | null;
          timeline: string | null;
          status: 'draft' | 'open' | 'under_review' | 'closed' | 'funded';
          visibility: 'draft' | 'private' | 'public';
          ai_compatibility_score: number | null;
          ai_risk_assessment: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['investment_opportunities']['Row']> & {
          business_id: string;
          amount_seeking: number;
          investment_type: Database['public']['Tables']['investment_opportunities']['Row']['investment_type'];
        };
        Update: Partial<Database['public']['Tables']['investment_opportunities']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'investment_opportunities_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Investor Interests - Track investor interest in opportunities
       */
      investor_interests: {
        Row: {
          id: string;
          investor_id: string;
          opportunity_id: string;
          status: 'interested' | 'in_discussion' | 'agreed' | 'not_proceeding';
          message: string | null;
          notified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['investor_interests']['Row']> & {
          investor_id: string;
          opportunity_id: string;
        };
        Update: Partial<Database['public']['Tables']['investor_interests']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'investor_interests_investor_id_fkey';
            columns: ['investor_id'];
            referencedRelation: 'investor_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'investor_interests_opportunity_id_fkey';
            columns: ['opportunity_id'];
            referencedRelation: 'investment_opportunities';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Agreements - Investment, sponsorship, and partnership agreements
       */
      agreements: {
        Row: {
          id: string;
          investor_id: string;
          business_id: string;
          opportunity_id: string;
          amount: number;
          type: 'investment' | 'sponsorship' | 'partnership';
          terms: Record<string, any> | null;
          milestones: Record<string, any>[] | null;
          status: 'draft' | 'under_review' | 'signed' | 'active' | 'completed' | 'disputed';
          investor_signed: boolean;
          business_signed: boolean;
          signed_at: string | null;
          escrow_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['agreements']['Row']> & {
          investor_id: string;
          business_id: string;
          opportunity_id: string;
          amount: number;
          type: Database['public']['Tables']['agreements']['Row']['type'];
        };
        Update: Partial<Database['public']['Tables']['agreements']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'agreements_investor_id_fkey';
            columns: ['investor_id'];
            referencedRelation: 'investor_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agreements_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agreements_opportunity_id_fkey';
            columns: ['opportunity_id'];
            referencedRelation: 'investment_opportunities';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Escrow Transactions - Secure fund holding for agreements
       */
      escrow_transactions: {
        Row: {
          id: string;
          agreement_id: string;
          amount: number;
          currency: string;
          status: 'held' | 'released' | 'disputed' | 'refunded';
          held_at: string;
          released_at: string | null;
          auto_release_at: string | null;
          dispute_reason: string | null;
          dispute_resolution: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['escrow_transactions']['Row']> & {
          agreement_id: string;
          amount: number;
        };
        Update: Partial<Database['public']['Tables']['escrow_transactions']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'escrow_transactions_agreement_id_fkey';
            columns: ['agreement_id'];
            referencedRelation: 'agreements';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Investment Documents - Documents shared during due diligence
       */
      investment_documents: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string;
          status: 'pending' | 'verified' | 'rejected' | 'expired';
          verified_by: string | null;
          verified_at: string | null;
          expiry_date: string | null;
          is_public: boolean;
          allowed_investors: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['investment_documents']['Row']> & {
          business_id: string;
          title: string;
          file_url: string;
          file_type: string;
        };
        Update: Partial<Database['public']['Tables']['investment_documents']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'investment_documents_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Due Diligence Requests - Investor requests to review businesses
       */
      due_diligence_requests: {
        Row: {
          id: string;
          investor_id: string;
          business_id: string;
          status: 'requested' | 'approved' | 'in_progress' | 'completed' | 'declined';
          documents_requested: string[] | null;
          documents_reviewed: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['due_diligence_requests']['Row']> & {
          investor_id: string;
          business_id: string;
        };
        Update: Partial<Database['public']['Tables']['due_diligence_requests']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'due_diligence_requests_investor_id_fkey';
            columns: ['investor_id'];
            referencedRelation: 'investor_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'due_diligence_requests_business_id_fkey';
            columns: ['business_id'];
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          }
        ];
      };

      /**
       * Investment Reports - Regular performance reports for agreements
       */
      investment_reports: {
        Row: {
          id: string;
          agreement_id: string;
          report_period: 'monthly' | 'quarterly' | 'annual';
          period_start: string;
          period_end: string;
          revenue: number | null;
          profit: number | null;
          growth: number | null;
          milestones_completed: number | null;
          milestones_total: number | null;
          ai_summary: string | null;
          ai_insights: Record<string, any> | null;
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['investment_reports']['Row']> & {
          agreement_id: string;
          report_period: Database['public']['Tables']['investment_reports']['Row']['report_period'];
          period_start: string;
          period_end: string;
        };
        Update: Partial<Database['public']['Tables']['investment_reports']['Row']>;
        Relationships: [
          {
            foreignKeyName: 'investment_reports_agreement_id_fkey';
            columns: ['agreement_id'];
            referencedRelation: 'agreements';
            referencedColumns: ['id'];
          }
        ];
      };

      // ============================================================
      // END OF TABLES
      // ============================================================
    };

    // ============================================================
    // VIEWS, FUNCTIONS, ENUMS, COMPOSITE TYPES
    // These must exist even when empty
    // ============================================================

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
