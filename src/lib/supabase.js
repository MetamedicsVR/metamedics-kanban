import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && key && !url.includes('your-project'))

export const supabase = createClient(
  url || 'http://localhost:54321',
  key || 'placeholder'
)
