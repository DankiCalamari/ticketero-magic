export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: "open" | "progress" | "closed"
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: "open" | "progress" | "closed"
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: "open" | "progress" | "closed"
          created_at?: string
        }
      }
    }
  }
}