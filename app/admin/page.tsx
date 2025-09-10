"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Moon,
  Sun,
  LogOut,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Calendar,
  Mail,
  Plus,
  Edit,
  Save,
  FileText,
  ImageIcon,
  Video,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { getAllUsers, approveUser, rejectUser, deleteUser } from "@/lib/admin"
import { useRouter } from "next/navigation"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

type UserRow = {
  id: string
  email: string
  password_hash: string
  full_name: string
  phone: string | null
  university: string | null
  major: string | null
  status: "pending" | "approved" | "rejected"
  is_admin: boolean
  created_at: string
  updated_at: string
}

interface ContentItem {
  id: string
  title: string
  excerpt: string
  content?: string
  imageUrl?: string
  date: string
  author: string
  category: string
  link?: string
}

interface PageContent {
  learning: ContentItem[]
  galleries: ContentItem[]
  media: ContentItem[]
}

function AdminContent() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [pageContent, setPageContent] = useState<PageContent>({
    learning: [],
    galleries: [],
    media: [],
  })
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({})
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    try {
      await approveUser(userId)
      loadUsers()
    } catch (error) {
      console.error("Failed to approve user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (userId: string) => {
    setActionLoading(userId)
    try {
      await deleteUser(userId)
      loadUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    setActionLoading(userId)
    try {
      await rejectUser(userId)
      loadUsers()
    } catch (error) {
      console.error("Failed to reject user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)

      const savedContent = localStorage.getItem("pageContent")
      if (savedContent) {
        setPageContent(JSON.parse(savedContent))
      } else {
        // Initialize with default media content
        const defaultContent: PageContent = {
          learning: [
            {
              id: "1",
              title: "창업 기초 과정",
              excerpt: "창업의 기본 개념부터 사업계획서 작성까지",
              content: "창업에 필요한 기본 지식을 학습합니다.",
              date: new Date().toISOString().split("T")[0],
              author: "인하벤처클럽",
              category: "교육",
              imageUrl: "/placeholder.svg?height=200&width=400&text=창업+기초+과정",
            },
          ],
          galleries: [
            {
              id: "1",
              title: "2024 창업 경진대회",
              excerpt: "인하벤처클럽 주최 창업 경진대회 현장",
              date: new Date().toISOString().split("T")[0],
              author: "인하벤처클럽",
              category: "행사",
              imageUrl: "/placeholder.svg?height=200&width=400&text=창업+경진대회",
            },
          ],
          media: [
            {
              id: "1",
              title: "인하벤처클럽, 30년 전통의 창업 동아리로 주목받아",
              excerpt: "한국경제 매거진에서 인하벤처클럽의 30년 역사와 성과를 조명했습니다.",
              date: "2020-10-19",
              author: "한국경제",
              category: "언론보도",
              imageUrl: "/placeholder.svg?height=200&width=400&text=한국경제+매거진",
              link: "https://magazine.hankyung.com/job-joy/article/202010193231b",
            },
          ],
        }
        setPageContent(defaultContent)
        localStorage.setItem("pageContent", JSON.stringify(defaultContent))
      }
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const userData = await getAllUsers()
      setUsers(userData)
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const saveContent = (newContent: PageContent) => {
    setPageContent(newContent)
    localStorage.setItem("pageContent", JSON.stringify(newContent))
  }

  const addContentItem = (pageType: keyof PageContent) => {
    if (!newItem.title || !newItem.excerpt) return

    const item: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      excerpt: newItem.excerpt,
      content: newItem.content || "",
      imageUrl: newItem.imageUrl || "",
      date: newItem.date || new Date().toISOString().split("T")[0],
      author: newItem.author || "인하벤처클럽",
      category: newItem.category || "일반",
      link: newItem.link || "",
    }

    const updatedContent = {
      ...pageContent,
      [pageType]: [...pageContent[pageType], item],
    }

    saveContent(updatedContent)
    setNewItem({})
  }

  const updateContentItem = (pageType: keyof PageContent, itemId: string, updatedItem: ContentItem) => {
    const updatedContent = {
      ...pageContent,
      [pageType]: pageContent[pageType].map((item) => (item.id === itemId ? updatedItem : item)),
    }

    saveContent(updatedContent)
    setEditingItem(null)
  }

  const deleteContentItem = (pageType: keyof PageContent, itemId: string) => {
    if (!confirm("정말로 이 항목을 삭제하시겠습니까?")) return

    const updatedContent = {
      ...pageContent,
      [pageType]: pageContent[pageType].filter((item) => item.id !== itemId),
    }

    saveContent(updatedContent)
  }

  const pendingUsers = users.filter((u) => u.status === "pending")
  const approvedUsers = users.filter((u) => u.status === "approved")

  const ContentForm = ({
    pageType,
    item,
    onSave,
    onCancel,
  }: {
    pageType: keyof PageContent
    item?: ContentItem
    onSave: (item: ContentItem) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Partial<ContentItem>>(
      item || {
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
        author: "인하벤처클럽",
        category: "일반",
        link: "",
      },
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.excerpt) return

      onSave({
        id: item?.id || Date.now().toString(),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content || "",
        imageUrl: formData.imageUrl || "",
        date: formData.date || new Date().toISOString().split("T")[0],
        author: formData.author || "인하벤처클럽",
        category: formData.category || "일반",
        link: formData.link || "",
      })
    }

    return (
      <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
        <CardHeader>
          <CardTitle>{item ? "항목 수정" : "새 항목 추가"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <Input
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="카테고리"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">요약</label>
              <Textarea
                value={formData.excerpt || ""}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="간단한 요약을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">내용</label>
              <Textarea
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="상세 내용을 입력하세요"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">이미지 URL</label>
                <Input
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="이미지 URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">링크 URL</label>
                <Input
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="외부 링크 URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">작성자</label>
                <Input
                  value={formData.author || ""}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="작성자"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">날짜</label>
                <Input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
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
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <img src="/images/ivc-logo.svg" alt="IVC Logo" className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                관리자 패널
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/70">사용자 승인 및 콘텐츠 관리</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                사용자 관리
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                콘텐츠 관리
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/70">전체 사용자</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/70">승인 대기</p>
                        <p className="text-2xl font-bold">{pendingUsers.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-white/70">승인 완료</p>
                        <p className="text-2xl font-bold">{approvedUsers.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Users */}
              {pendingUsers.length > 0 && (
                <Card className="mb-12 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      승인 대기 중인 사용자 ({pendingUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.full_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || "이름 없음"}</p>
                              <p className="text-sm text-gray-600 dark:text-white/70 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-white/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(user.created_at).toLocaleDateString("ko-KR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? "처리 중..." : "승인"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                              onClick={() => handleDelete(user.id)}
                              disabled={actionLoading === user.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Users */}
              <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    전체 사용자 ({users.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-white/70">사용자 목록을 불러오는 중...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.map((userData) => (
                        <div
                          key={userData.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {userData.full_name?.[0] || userData.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{userData.full_name || "이름 없음"}</p>
                                <Badge variant={userData.status === "approved" ? "default" : "secondary"}>
                                  {userData.status === "approved" ? "승인됨" : "대기중"}
                                </Badge>
                                {userData.is_admin && (
                                  <Badge variant="outline" className="border-purple-300 text-purple-600">
                                    관리자
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-white/70 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {userData.email}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-white/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                가입: {new Date(userData.created_at).toLocaleDateString("ko-KR")}
                                {userData.updated_at && (
                                  <span className="ml-2">
                                    승인: {new Date(userData.updated_at).toLocaleDateString("ko-KR")}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {userData.status === "approved" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-900/20 bg-transparent"
                                onClick={() => handleReject(userData.id)}
                                disabled={actionLoading === userData.id || userData.is_admin}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(userData.id)}
                                disabled={actionLoading === userData.id}
                              >
                                승인
                              </Button>
                            )}
                            {!userData.is_admin && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                                onClick={() => handleDelete(userData.id)}
                                disabled={actionLoading === userData.id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Tabs defaultValue="learning" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="learning" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Learning Hub
                  </TabsTrigger>
                  <TabsTrigger value="galleries" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Galleries
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Media
                  </TabsTrigger>
                </TabsList>

                {(["learning", "galleries", "media"] as const).map((pageType) => (
                  <TabsContent key={pageType} value={pageType}>
                    <div className="space-y-6">
                      {/* Add new item form */}
                      <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />새{" "}
                            {pageType === "learning"
                              ? "학습 자료"
                              : pageType === "galleries"
                                ? "갤러리 항목"
                                : "미디어 항목"}{" "}
                            추가
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              placeholder="제목"
                              value={newItem.title || ""}
                              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            />
                            <Input
                              placeholder="카테고리"
                              value={newItem.category || ""}
                              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            />
                          </div>
                          <Textarea
                            placeholder="요약"
                            value={newItem.excerpt || ""}
                            onChange={(e) => setNewItem({ ...newItem, excerpt: e.target.value })}
                            className="mb-4"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                              placeholder="이미지 URL"
                              value={newItem.imageUrl || ""}
                              onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                            />
                            <Input
                              placeholder="링크 URL"
                              value={newItem.link || ""}
                              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                            />
                          </div>
                          <Button
                            onClick={() => addContentItem(pageType)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!newItem.title || !newItem.excerpt}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            추가
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Existing items */}
                      <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
                        <CardHeader>
                          <CardTitle>
                            {pageType === "learning" ? "학습 자료" : pageType === "galleries" ? "갤러리" : "미디어"}{" "}
                            목록 ({pageContent[pageType].length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {pageContent[pageType].map((item) => (
                              <div key={item.id}>
                                {editingItem?.id === item.id ? (
                                  <ContentForm
                                    pageType={pageType}
                                    item={editingItem}
                                    onSave={(updatedItem) => updateContentItem(pageType, item.id, updatedItem)}
                                    onCancel={() => setEditingItem(null)}
                                  />
                                ) : (
                                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <Badge variant="outline">{item.category}</Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-white/70 mb-2">{item.excerpt}</p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/50">
                                        <span className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                          {item.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(item.date).toLocaleDateString("ko-KR")}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                                        onClick={() => deleteContentItem(pageType, item.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminContent />
    </AdminProtectedRoute>
  )
}
