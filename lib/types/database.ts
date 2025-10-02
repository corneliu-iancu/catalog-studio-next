export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          user_id: string | null
          name: string
          slug: string
          description: string | null
          cuisine: Database['public']['Enums']['cuisine_type'] | null
          owner_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          website: string | null
          logo_url: string | null
          hours: Json | null
          settings: Json | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          slug: string
          description?: string | null
          cuisine?: Database['public']['Enums']['cuisine_type'] | null
          owner_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          hours?: Json | null
          settings?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          cuisine?: Database['public']['Enums']['cuisine_type'] | null
          owner_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          website?: string | null
          logo_url?: string | null
          hours?: Json | null
          settings?: Json | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      menus: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          slug: string
          description: string | null
          is_active: boolean | null
          is_default: boolean | null
          active_from: string | null
          active_to: string | null
          active_days: number[] | null
          start_date: string | null
          end_date: string | null
          currency: string | null
          sort_order: number | null
          meta_title: string | null
          meta_description: string | null
          image_url: string | null
          image_alt: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          name: string
          slug: string
          description?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          active_from?: string | null
          active_to?: string | null
          active_days?: number[] | null
          start_date?: string | null
          end_date?: string | null
          currency?: string | null
          sort_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          image_url?: string | null
          image_alt?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          active_from?: string | null
          active_to?: string | null
          active_days?: number[] | null
          start_date?: string | null
          end_date?: string | null
          currency?: string | null
          sort_order?: number | null
          meta_title?: string | null
          meta_description?: string | null
          image_url?: string | null
          image_alt?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          menu_id: string | null
          name: string
          slug: string
          description: string | null
          sort_order: number | null
          is_active: boolean | null
          is_featured: boolean | null
          meta_title: string | null
          meta_description: string | null
          image_url: string | null
          image_alt: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          menu_id?: string | null
          name: string
          slug: string
          description?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          image_url?: string | null
          image_alt?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          menu_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          image_url?: string | null
          image_alt?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          long_description: string | null
          price: number
          discount_price: number | null
          ingredients: string | null
          allergens: Database['public']['Enums']['allergen_type'][] | null
          preparation_time: string | null
          spice_level: Database['public']['Enums']['spice_level'] | null
          serving_size: string | null
          nutritional_info: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          meta_title: string | null
          meta_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          long_description?: string | null
          price: number
          discount_price?: number | null
          ingredients?: string | null
          allergens?: Database['public']['Enums']['allergen_type'][] | null
          preparation_time?: string | null
          spice_level?: Database['public']['Enums']['spice_level'] | null
          serving_size?: string | null
          nutritional_info?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          long_description?: string | null
          price?: number
          discount_price?: number | null
          ingredients?: string | null
          allergens?: Database['public']['Enums']['allergen_type'][] | null
          preparation_time?: string | null
          spice_level?: Database['public']['Enums']['spice_level'] | null
          serving_size?: string | null
          nutritional_info?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      category_products: {
        Row: {
          id: string
          category_id: string | null
          product_id: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          product_id?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          product_id?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string | null
          s3_key: string
          alt_text: string | null
          display_order: number | null
          is_primary: boolean | null
          width: number | null
          height: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          s3_key: string
          alt_text?: string | null
          display_order?: number | null
          is_primary?: boolean | null
          width?: number | null
          height?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          s3_key?: string
          alt_text?: string | null
          display_order?: number | null
          is_primary?: boolean | null
          width?: number | null
          height?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
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
      cuisine_type: 'italian' | 'american' | 'mexican' | 'asian' | 'mediterranean' | 'french' | 'indian' | 'thai' | 'japanese' | 'chinese' | 'greek' | 'other'
      spice_level: 'mild' | 'medium' | 'hot' | 'very-hot'
      allergen_type: 'dairy' | 'gluten' | 'nuts' | 'eggs' | 'soy' | 'shellfish' | 'fish' | 'sesame'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
