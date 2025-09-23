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
      menu_items: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          long_description: string | null
          price: number
          discount_price: number | null
          ingredients: string | null
          allergens: Database['public']['Enums']['allergen_type'][] | null
          preparation_time: string | null
          spice_level: Database['public']['Enums']['spice_level'] | null
          serving_size: string | null
          nutritional_info: Json | null
          image_url: string | null
          image_alt: string | null
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
          description: string
          long_description?: string | null
          price: number
          discount_price?: number | null
          ingredients?: string | null
          allergens?: Database['public']['Enums']['allergen_type'][] | null
          preparation_time?: string | null
          spice_level?: Database['public']['Enums']['spice_level'] | null
          serving_size?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          image_alt?: string | null
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
          description?: string
          long_description?: string | null
          price?: number
          discount_price?: number | null
          ingredients?: string | null
          allergens?: Database['public']['Enums']['allergen_type'][] | null
          preparation_time?: string | null
          spice_level?: Database['public']['Enums']['spice_level'] | null
          serving_size?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          image_alt?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      category_menu_items: {
        Row: {
          id: string
          category_id: string | null
          menu_item_id: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          menu_item_id?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          menu_item_id?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_menu_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          }
        ]
      }
      media_files: {
        Row: {
          id: string
          restaurant_id: string | null
          filename: string
          original_name: string
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          storage_path: string
          public_url: string
          thumbnail_url: string | null
          folder: string | null
          used_in_type: string | null
          used_in_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          filename: string
          original_name: string
          file_size: number
          mime_type: string
          width?: number | null
          height?: number | null
          storage_path: string
          public_url: string
          thumbnail_url?: string | null
          folder?: string | null
          used_in_type?: string | null
          used_in_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string | null
          filename?: string
          original_name?: string
          file_size?: number
          mime_type?: string
          width?: number | null
          height?: number | null
          storage_path?: string
          public_url?: string
          thumbnail_url?: string | null
          folder?: string | null
          used_in_type?: string | null
          used_in_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
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
