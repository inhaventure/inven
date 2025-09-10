import { isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/sign-up-form"

export default async function SignUpPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Supabase Setup Required</h1>
          <p className="text-gray-600 dark:text-gray-400">Please run the SQL script to set up your database tables.</p>
        </div>
      </div>
    )
  }

  // Supabase 비활성 모드에서는 세션 체크를 생략

  return <SignUpForm />
}
