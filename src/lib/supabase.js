import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && key && !url.includes('your-project'))

export const supabase = createClient(
  url || 'http://localhost:54321',
  key || 'placeholder'
)

const BUCKET = 'card-attachments'

export async function uploadFile(cardId, file) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const path = `${cardId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl, name: file.name, size: file.size, mime: file.type }
}

export async function removeFile(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
