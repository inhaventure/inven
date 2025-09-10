export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          phone: string | null
          university: string | null
          major: string | null
          status: "pending" | "approved" | "rejected"
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          phone?: string | null
          university?: string | null
          major?: string | null
          status?: "pending" | "approved" | "rejected"
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          phone?: string | null
          university?: string | null
          major?: string | null
          status?: "pending" | "approved" | "rejected"
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          page_type: "learning" | "galleries" | "media"
          title: string
          description: string | null
          image_url: string | null
          link_url: string | null
          content_data: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_type: "learning" | "galleries" | "media"
          title: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          content_data?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_type?: "learning" | "galleries" | "media"
          title?: string
          description?: string | null
          image_url?: string | null
          link_url?: string | null
          content_data?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Export as both named and default export for maximum compatibility
export default Database
export type { Database }
