"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Moon, Sun, Clock, Mail, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function PendingApprovalPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { user, signOut, isApproved } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  // 승인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (isApproved) {
      router.push("/dashboard")
    }
  }, [isApproved, router])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-4 md:top-8 right-4 md:right-8 z-50" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-3 md:gap-6">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 md:px-4 rounded-full group"
            aria-label="Toggle between light and dark theme"
          >
            <div className="group-hover:rotate-180 transition-transform duration-500">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </div>
          </Button>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 md:px-4"
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img src="/images/ivc-logo.svg" alt="IVC Logo" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                승인 대기 중
              </span>
            </h1>
            <p className="text-gray-600 dark:text-white/70">관리자의 승인을 기다리고 있습니다</p>
          </div>

          {/* Pending Approval Card */}
          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl font-bold">승인 대기 중입니다</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-white/70 mb-4">
                  안녕하세요, <strong>{user?.name || user?.email}</strong>님!
                </p>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                  회원가입이 완료되었습니다. 현재 관리자의 승인을 기다리고 있으며, 승인이 완료되면 모든 기능을 이용하실
                  수 있습니다.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">승인 알림</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      승인이 완료되면 등록하신 이메일로 알림을 보내드립니다. 일반적으로 1-2일 내에 승인이 완료됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">승인 후 이용 가능한 서비스:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Learning Hub - 창업 관련 자료 다운로드
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Galleries - 동아리 활동 사진 및 영상
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    멤버 전용 커뮤니티 기능
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    창업 멘토링 프로그램 참여
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-white/50 text-center">
                  문의사항이 있으시면 관리자에게 연락해주세요.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
