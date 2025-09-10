"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Moon, Sun, Download, FileText, ImageIcon, LogOut, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const resources = [
    {
      id: 1,
      title: "사업계획서 가이드북 2025",
      description: "인하벤처클럽의 창업 노하우가 담긴 완벽 가이드",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "팀빌딩 활동 사진",
      description: "2024년 팀빌딩 캠프 활동 사진 모음",
      type: "Images",
      icon: ImageIcon,
      downloadUrl: "https://drive.google.com/drive/folders/1KTtjAxBDmD-EIqEaxRgG4mahAhEDqawh?usp=drive_link",
    },
    {
      id: 3,
      title: "하계 MT 사진",
      description: "성공하기 위한 사람들의 네트워킹",
      type: "Images",
      icon: ImageIcon,
      downloadUrl: "#",
    },
    {
      id: 4,
      title: "비즈니스 모델 템플릿",
      description: "검증된 비즈니스 모델 캔버스 템플릿",
      type: "PDF",
      icon: FileText,
      downloadUrl: "#",
    },
  ]

  const handleDownload = (resource: any) => {
    if (resource.downloadUrl === "#") {
      console.log(`Downloading ${resource.title}`)
      // 실제 다운로드 로직 구현
    } else {
      // 외부 링크로 이동
      window.open(resource.downloadUrl, "_blank")
    }
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
      <main className="relative z-10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <img src="/images/ivc-logo.svg" alt="IVC Logo" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                환영합니다!
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/70 mb-2">{user?.name || user?.email}님</p>
            <p className="text-gray-500 dark:text-white/50">인하벤처클럽의 모든 자료에 접근할 수 있습니다.</p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => {
              const IconComponent = resource.icon
              return (
                <Card
                  key={resource.id}
                  className="group hover:scale-105 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-6 leading-relaxed">{resource.description}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-500 dark:via-pink-500 dark:to-cyan-500 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      onClick={() => handleDownload(resource)}
                    >
                      {resource.downloadUrl === "#" ? (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          다운로드
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          링크 열기
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-800">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">더 많은 자료가 필요하신가요?</h3>
                <p className="text-gray-600 dark:text-white/70 mb-6">
                  관리자에게 문의하시면 추가 자료를 제공해드립니다.
                </p>
                <Button
                  variant="outline"
                  className="border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
                >
                  관리자 문의하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
