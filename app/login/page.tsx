"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Moon, Sun, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, loading } = { user: null, loading: false } as any

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn(email, password)

      // 관리자 로그인인지 확인 - admin/1997
      if (email === "admin" && password === "1997") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message || "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Custom CSS for enhanced UX */}
      <style jsx global>{`
        ::selection {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.2)"};
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.1)" : "rgba(243, 244, 246, 0.5)"};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.3)"};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.5)" : "rgba(147, 51, 234, 0.5)"};
        }

        @keyframes subtle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        .subtle-breathe {
          animation: subtle-breathe 6s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Artistic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),rgba(0,0,0,0))]" />
      <div className="fixed top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[10%] w-32 md:w-64 h-32 md:h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 blur-3xl subtle-breathe" />
        <div
          className="absolute top-[60%] right-[15%] w-40 md:w-80 h-40 md:h-80 rounded-full bg-gradient-to-r from-pink-500/5 to-orange-500/5 dark:from-pink-500/10 dark:to-orange-500/10 blur-3xl subtle-breathe"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-36 md:w-72 h-36 md:h-72 rounded-full bg-gradient-to-r from-green-500/5 to-cyan-500/5 dark:from-green-500/10 dark:to-cyan-500/10 blur-3xl subtle-breathe"
          style={{ animationDelay: "2s" }}
        />
      </div>

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
          <Link href="/">
            <Button
              variant="ghost"
              className="text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 md:px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img src="/images/ivc-logo.svg" alt="IVC Logo" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                INHA VENTURE CLUB
              </span>
            </h1>
            <p className="text-gray-600 dark:text-white/70">멤버 전용 자료실에 접근하려면 로그인하세요</p>
          </div>

          {/* Login Disabled Notice */}
          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">로그인이 비활성화되었습니다</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center text-gray-700 dark:text-white/70">
                현재 데모 모드로 로그인 기능이 꺼져 있습니다.
              </div>
            </CardContent>
          </Card>

          {/* Admin Info */}
          <div className="mt-8 text-center">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">관리자 계정</span>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                관리자는 <strong>admin</strong> / <strong>1997</strong>로 로그인하세요
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-white/50">
              로그인 후 Learning Hub와 Galleries의 모든 자료에 접근할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
