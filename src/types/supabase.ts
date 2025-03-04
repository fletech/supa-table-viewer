
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
      applications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          company: string
          position: string
          location: string
          date_applied: string
          status: ApplicationStatus
          url: string | null
          description: string | null
          is_archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          company: string
          position: string
          location: string
          date_applied: string
          status: ApplicationStatus
          url?: string | null
          description?: string | null
          is_archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          company?: string
          position?: string
          location?: string
          date_applied?: string
          status?: ApplicationStatus
          url?: string | null
          description?: string | null
          is_archived?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: ApplicationStatus
    }
  }
}

export type ApplicationStatus = 
  | 'Applied'
  | 'Screening call'
  | 'Interviewing'
  | 'Waiting offer'
  | 'Got Offer'
  | 'Accepted!'
  | 'Declined'
  | 'Rejected'
  | 'Error'
