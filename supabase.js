import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Apufunktiot session-hallinnalle
export async function getOrCreateSession() {
  let sessionToken = localStorage.getItem('flashcards_session_token')
  
  if (!sessionToken) {
    // Luo uusi sessio
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ session_token: generateToken() }])
      .select()
    
    if (error) throw error
    
    sessionToken = data[0].session_token
    localStorage.setItem('flashcards_session_token', sessionToken)
  }
  
  return sessionToken
}

export async function getSessionId(token) {
  const { data, error } = await supabase
    .from('sessions')
    .select('id')
    .eq('session_token', token)
    .single()
  
  if (error) throw error
  return data.id
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Salataan API-avaimet
export async function saveEncryptedApiKey(sessionId, provider, apiKey) {
  // Yksinkertainen base64-salaus (tuotannossa käytä kunnollista salausta)
  const encrypted = btoa(apiKey)
  
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('session_id', sessionId)
    .eq('provider', provider)
  
  const { data, error: insertError } = await supabase
    .from('api_keys')
    .insert([
      {
        session_id: sessionId,
        provider: provider,
        encrypted_key: encrypted
      }
    ])
  
  if (insertError) throw insertError
  return data
}

export async function getDecryptedApiKey(sessionId, provider) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('session_id', sessionId)
    .eq('provider', provider)
    .single()
  
  if (error) return null
  if (!data) return null
  
  // Dekryptoi base64
  const decrypted = atob(data.encrypted_key)
  return decrypted
}
