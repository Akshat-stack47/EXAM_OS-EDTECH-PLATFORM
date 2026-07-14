import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function createServerClient() {
  const cookieStore = await cookies()
  // Support both cookie names (sb-access-token is what we set in actions.ts)
  const authToken =
    cookieStore.get('sb-access-token')?.value ??
    cookieStore.get('sb-auth-token')?.value

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  })
}
