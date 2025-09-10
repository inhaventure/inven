"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireApproval?: boolean
  adminOnly?: boolean
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  requireApproval = true,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, loading, isApproved, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else if (requireApproval && !isApproved) {
        router.push("/pending-approval")
      } else if (adminOnly && !isAdmin) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, isApproved, isAdmin, router, redirectTo, requireApproval, adminOnly])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/70">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireApproval && !isApproved) {
    return null
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">접근 권한이 없습니다</h1>
          <p className="text-gray-600 dark:text-white/70">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
