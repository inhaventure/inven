import { supabase } from "./supabase/client"

export interface PendingUser {
  id: string
  email: string
  name: string | null
  created_at: string
  status: "pending" | "approved" | "rejected"
}

// v0 환경 감지
const isV0Environment = () => {
  if (typeof window === "undefined") return false
  return window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("v0.dev")
}

// 관리자 세션 체크 함수 (admin/1997)
const isAdminSession = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminSession") === "true"
  }
  return false
}

// Mock 사용자 데이터 관리
const getMockUsers = (): any[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("mockUsers")
  return users ? JSON.parse(users) : []
}

const saveMockUsers = (users: any[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("mockUsers", JSON.stringify(users))
}

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  // 관리자 세션인 경우 mock 데이터에서 승인 대기 사용자 반환
  if (isAdminSession()) {
    const mockUsers = getMockUsers()
    return mockUsers
      .filter((user) => user.status === "pending")
      .map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        status: user.status,
      }))
  }

  if (isV0Environment()) {
    return []
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, created_at, status")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export const getAllUsers = async () => {
  // 관리자 세션인 경우 mock 데이터 반환
  if (isAdminSession()) {
    const mockUsers = getMockUsers()
    const allUsers = [
      {
        id: "admin",
        email: "admin@inhaventureclub.com",
        name: "관리자",
        created_at: new Date().toISOString(),
        status: "approved",
        updated_at: new Date().toISOString(),
        role: "admin",
      },
      ...mockUsers.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        status: user.status,
        updated_at: user.updated_at || user.created_at,
        role: user.role || "user",
      })),
    ]
    return allUsers
  }

  if (isV0Environment()) {
    return []
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, created_at, status, updated_at, role")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export const approveUser = async (userId: string, adminId: string) => {
  // 관리자 세션인 경우 mock 데이터 업데이트
  if (isAdminSession()) {
    const mockUsers = getMockUsers()
    const userIndex = mockUsers.findIndex((user) => user.id === userId)

    if (userIndex !== -1) {
      mockUsers[userIndex].status = "approved"
      mockUsers[userIndex].updated_at = new Date().toISOString()
      saveMockUsers(mockUsers)
      console.log(`사용자 ${userId} 승인됨 (관리자 세션)`)
    }

    return [{ id: userId, status: "approved" }]
  }

  if (isV0Environment()) {
    return []
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const rejectUser = async (userId: string) => {
  // 관리자 세션인 경우 mock 데이터 업데이트
  if (isAdminSession()) {
    const mockUsers = getMockUsers()
    const userIndex = mockUsers.findIndex((user) => user.id === userId)

    if (userIndex !== -1) {
      mockUsers[userIndex].status = "rejected"
      mockUsers[userIndex].updated_at = new Date().toISOString()
      saveMockUsers(mockUsers)
      console.log(`사용자 ${userId} 거부됨 (관리자 세션)`)
    }

    return [{ id: userId, status: "rejected" }]
  }

  if (isV0Environment()) {
    return []
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const deleteUser = async (userId: string) => {
  // 관리자 세션인 경우 mock 데이터에서 삭제
  if (isAdminSession()) {
    const mockUsers = getMockUsers()
    const filteredUsers = mockUsers.filter((user) => user.id !== userId)
    saveMockUsers(filteredUsers)
    console.log(`사용자 ${userId} 삭제됨 (관리자 세션)`)
    return
  }

  if (isV0Environment()) {
    return
  }

  // users 테이블에서 삭제
  const { error: userError } = await supabase.from("users").delete().eq("id", userId)

  if (userError) {
    throw new Error(userError.message)
  }
}

export const isAdmin = async (userId: string): Promise<boolean> => {
  // 관리자 세션인 경우 true 반환
  if (isAdminSession()) {
    return true
  }

  if (isV0Environment()) {
    return false
  }

  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error || !data) {
    return false
  }

  return data.role === "admin"
}

export const getContentByType = async (pageType: "learning" | "galleries" | "media") => {
  if (isV0Environment() || isAdminSession()) {
    // v0 환경에서는 localStorage 사용
    const content = localStorage.getItem(`content_${pageType}`)
    return content ? JSON.parse(content) : []
  }

  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("page_type", pageType)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export const addContent = async (pageType: "learning" | "galleries" | "media", contentData: any) => {
  if (isV0Environment() || isAdminSession()) {
    // v0 환경에서는 localStorage 사용
    const existingContent = localStorage.getItem(`content_${pageType}`)
    const content = existingContent ? JSON.parse(existingContent) : []
    const newContent = {
      id: `mock-${Date.now()}`,
      ...contentData,
      created_at: new Date().toISOString(),
    }
    content.push(newContent)
    localStorage.setItem(`content_${pageType}`, JSON.stringify(content))
    return newContent
  }

  const { data, error } = await supabase
    .from("content")
    .insert({
      page_type: pageType,
      ...contentData,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const updateContent = async (id: string, contentData: any) => {
  if (isV0Environment() || isAdminSession()) {
    // v0 환경에서는 localStorage 업데이트
    const pageTypes = ["learning", "galleries", "media"]
    for (const pageType of pageTypes) {
      const existingContent = localStorage.getItem(`content_${pageType}`)
      if (existingContent) {
        const content = JSON.parse(existingContent)
        const index = content.findIndex((item: any) => item.id === id)
        if (index !== -1) {
          content[index] = { ...content[index], ...contentData, updated_at: new Date().toISOString() }
          localStorage.setItem(`content_${pageType}`, JSON.stringify(content))
          return content[index]
        }
      }
    }
    return null
  }

  const { data, error } = await supabase
    .from("content")
    .update({
      ...contentData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const deleteContent = async (id: string) => {
  if (isV0Environment() || isAdminSession()) {
    // v0 환경에서는 localStorage에서 삭제
    const pageTypes = ["learning", "galleries", "media"]
    for (const pageType of pageTypes) {
      const existingContent = localStorage.getItem(`content_${pageType}`)
      if (existingContent) {
        const content = JSON.parse(existingContent)
        const filteredContent = content.filter((item: any) => item.id !== id)
        if (filteredContent.length !== content.length) {
          localStorage.setItem(`content_${pageType}`, JSON.stringify(filteredContent))
          return
        }
      }
    }
    return
  }

  const { error } = await supabase.from("content").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}
