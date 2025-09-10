import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()
  return createServerActionClient({ cookies: () => cookieStore })
}

export const createServerClient = createClient

export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
