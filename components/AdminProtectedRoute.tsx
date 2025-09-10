"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdminSession, setIsAdminSession] = useState(false)

  useEffect(() => {
    // 관리자 세션 체크
    if (typeof window !== "undefined") {
      const adminSession = localStorage.getItem("adminSession")
      setIsAdminSession(adminSession === "true")
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      // 관리자 세션이 없고 일반 사용자도 관리자가 아닌 경우
      if (!isAdminSession && (!user || user.role !== "admin")) {
        router.push("/login")
      }
    }
  }, [user, loading, isAdminSession, router])

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

  // 관리자 세션이 있거나 관리자 권한이 있는 경우에만 접근 허용
  if (!isAdminSession && (!user || user.role !== "admin")) {
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
