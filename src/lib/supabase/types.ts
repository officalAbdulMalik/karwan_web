// Generated from the Supabase project schema (CoreByte / E Commerce).
// Regenerate with: npx supabase gen types typescript --project-id eutfesbuptqntoaxyzmu
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
      categories: {
        Row: {
          department_id: number
          id: number
          image_slug: string
          name: string
          position: number
          slug: string
        }
        Insert: {
          department_id: number
          id?: never
          image_slug: string
          name: string
          position: number
          slug: string
        }
        Update: {
          department_id?: number
          id?: never
          image_slug?: string
          name?: string
          position?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          city: string
          eta: string
          fee: number
          id: number
          position: number
          urdu_label: string
        }
        Insert: {
          city: string
          eta: string
          fee: number
          id?: never
          position: number
          urdu_label: string
        }
        Update: {
          city?: string
          eta?: string
          fee?: number
          id?: never
          position?: number
          urdu_label?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: number
          ink: string
          name: string
          position: number
        }
        Insert: {
          id?: never
          ink: string
          name: string
          position: number
        }
        Update: {
          id?: never
          ink?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          colour: string
          id: number
          image_slug: string
          order_id: string
          product_id: string | null
          quantity: number
          slug: string
          title: string
          unit_amount: number
        }
        Insert: {
          colour: string
          id?: never
          image_slug: string
          order_id: string
          product_id?: string | null
          quantity: number
          slug: string
          title: string
          unit_amount: number
        }
        Update: {
          colour?: string
          id?: never
          image_slug?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          slug?: string
          title?: string
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          access_token: string
          address: string
          city: string
          created_at: string
          customer_name: string
          delivery_fee: number
          id: string
          landmark: string | null
          order_number: string
          payment_method: string
          phone: string
          status: string
          subtotal: number
          total: number
        }
        Insert: {
          access_token?: string
          address: string
          city: string
          created_at?: string
          customer_name: string
          delivery_fee: number
          id?: string
          landmark?: string | null
          order_number?: string
          payment_method: string
          phone: string
          status?: string
          subtotal: number
          total: number
        }
        Update: {
          access_token?: string
          address?: string
          city?: string
          created_at?: string
          customer_name?: string
          delivery_fee?: number
          id?: string
          landmark?: string | null
          order_number?: string
          payment_method?: string
          phone?: string
          status?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_city_fkey"
            columns: ["city"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["city"]
          },
          {
            foreignKeyName: "orders_payment_method_fkey"
            columns: ["payment_method"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["code"]
          },
        ]
      }
      payment_methods: {
        Row: {
          blurb: string
          code: string
          delivery_discount: number
          label: string
          position: number
          urdu_blurb: string | null
          urdu_label: string
        }
        Insert: {
          blurb: string
          code: string
          delivery_discount?: number
          label: string
          position: number
          urdu_blurb?: string | null
          urdu_label: string
        }
        Update: {
          blurb?: string
          code?: string
          delivery_discount?: number
          label?: string
          position?: number
          urdu_blurb?: string | null
          urdu_label?: string
        }
        Relationships: []
      }
      product_specs: {
        Row: {
          id: number
          label: string
          position: number
          product_id: string
          value: string
        }
        Insert: {
          id?: never
          label: string
          position: number
          product_id: string
          value: string
        }
        Update: {
          id?: never
          label?: string
          position?: number
          product_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          colour: string
          id: number
          is_available: boolean
          position: number
          product_id: string
        }
        Insert: {
          colour: string
          id?: never
          is_available?: boolean
          position: number
          product_id: string
        }
        Update: {
          colour?: string
          id?: never
          is_available?: boolean
          position?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          department_id: number
          description: string | null
          id: string
          image_slug: string
          image_url: string | null
          is_active: boolean
          order_count: number | null
          rating: number | null
          shop_id: string
          slug: string
          spec: string
          stock_count: number
          title: string
          trend_rank: number | null
          was_amount: number | null
        }
        Insert: {
          amount: number
          category_id: number
          created_at?: string
          department_id: number
          description?: string | null
          id?: string
          image_slug?: string
          image_url?: string | null
          is_active?: boolean
          order_count?: number | null
          rating?: number | null
          shop_id: string
          slug: string
          spec: string
          stock_count?: number
          title: string
          trend_rank?: number | null
          was_amount?: number | null
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          department_id?: number
          description?: string | null
          id?: string
          image_slug?: string
          image_url?: string | null
          is_active?: boolean
          order_count?: number | null
          rating?: number | null
          shop_id?: string
          slug?: string
          spec?: string
          stock_count?: number
          title?: string
          trend_rank?: number | null
          was_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_product_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: number
          location: string
          product_id: string
          stars: number
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: never
          location: string
          product_id: string
          stars: number
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: never
          location?: string
          product_id?: string
          stars?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      category_product_counts: {
        Row: {
          department: string | null
          id: number | null
          image_slug: string | null
          ink: string | null
          name: string | null
          position: number | null
          product_count: number | null
          slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_order: { Args: { p_token: string }; Returns: Json }
      place_order: {
        Args: {
          p_address: string
          p_city: string
          p_items: Json
          p_landmark?: string
          p_name: string
          p_payment: string
          p_phone: string
        }
        Returns: Json
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
