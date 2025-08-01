import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface Installer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  created_at: string
  updated_at: string
}

export interface Checkin {
  id: string
  installer_id: string
  location: string
  project_name: string
  checkin_time: string
  completion_time?: string
  status: 'in_progress' | 'completed' | 'cancelled'
  checklist_data: ChecklistItem[]
  notes?: string
  created_at: string
}

export interface ChecklistItem {
  id: string
  item_name: string
  category: string
  is_required: boolean
  description: string
  sort_order: number
  created_at: string
}

export interface EmailTemplate {
  id: string
  template_name: string
  subject: string
  content: string
  recipient_email: string
  is_active: boolean
  created_at: string
}

export interface CheckinFormData {
  installer: {
    name: string
    email: string
    phone: string
    company: string
  }
  location: {
    address: string
    city: string
    state: string
    zip: string
  }
  project: {
    name: string
    description: string
    client: string
  }
}

export interface ChecklistResponse {
  item_id: string
  completed: boolean
  notes?: string
  photos?: string[]
  timestamp: string
} 