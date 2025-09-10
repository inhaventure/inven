import { supabase } from "./supabase/client"

export interface AuthUser {
  id: string
  email: string
  name?: string
  status: "pending" | "approved" | "rejected"
  role: "user" | "admin"
  createdAt?: string
}

// v0 환경 감지 함수
const isV0Environment = () => {
  if (typeof window === "undefined") return false
  return window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("v0.dev")
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

const generateMockId = () => {
  return "mock-" + Math.random().toString(36).substr(2, 9)
}

export const signIn = async (email: string, password: string) => {
  // 관리자 계정 체크 - admin/1997
  if (email === "admin" && password === "1997") {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSession", "true")
    }
    return {
      user: {
        id: "admin",
        email: "admin@inhaventureclub.com",
        user_metadata: { name: "관리자" },
      },
      session: { access_token: "admin_token" },
    }
  }

  // v0 환경에서는 mock 로그인
  if (isV0Environment()) {
    const mockUsers = getMockUsers()
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
    }

    if (user.status !== "approved") {
      throw new Error("관리자 승인이 완료되어야 로그인할 수 있습니다. 승인을 기다려주세요.")
    }

    // Mock 세션 저장
    localStorage.setItem("mockSession", JSON.stringify(user))

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: { name: user.name },
      },
      session: { access_token: "mock_token" },
    }
  }

  // 실제 Supabase 로그인
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      const approvalStatus = await checkUserApproval(data.user.id)
      if (approvalStatus.status !== "approved") {
        await supabase.auth.signOut()
        throw new Error("관리자 승인이 완료되어야 로그인할 수 있습니다. 승인을 기다려주세요.")
      }
    }

    return data
  } catch (error: any) {
    console.error("Supabase login failed:", error)
    throw error
  }
}

export const signUp = async (email: string, password: string, name?: string) => {
  console.log("Starting signup process...", { email, name })

  // v0 환경에서는 mock 회원가입
  if (isV0Environment()) {
    console.log("Using mock signup for v0 environment")

    const mockUsers = getMockUsers()

    // 이미 존재하는 이메일 체크
    if (mockUsers.find((u) => u.email === email)) {
      throw new Error("이미 사용 중인 이메일입니다.")
    }

    const newUser = {
      id: generateMockId(),
      email,
      name: name || email,
      password, // 실제 환경에서는 절대 저장하면 안됨!
      status: "pending",
      role: "user",
      created_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    saveMockUsers(mockUsers)

    console.log("Mock user created:", { id: newUser.id, email: newUser.email })

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { name: newUser.name },
      },
      session: null, // 회원가입 후에는 세션 없음
    }
  }

  // 실제 Supabase 회원가입
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || "",
        },
      },
    })

    console.log("Supabase signup response:", { data, error })

    if (error) {
      throw new Error(error.message)
    }

    // 회원가입 성공 후 users 테이블에 수동으로 추가
    if (data.user && !error) {
      try {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          name: name || data.user.email!,
          status: "pending",
          role: "user",
        })

        if (insertError) {
          console.log("User already exists in users table or insert failed:", insertError)
        } else {
          console.log("User successfully added to users table")
        }
      } catch (insertErr) {
        console.log("Insert to users table failed, but signup succeeded:", insertErr)
      }
    }

    return data
  } catch (err: any) {
    console.error("Supabase signup failed:", err)

    // Supabase 연결 실패 시 mock으로 fallback
    if (err.message?.includes("fetch") || err.message?.includes("network")) {
      console.log("Falling back to mock signup due to network error")
      return signUp(email, password, name) // 재귀 호출로 mock 버전 실행
    }

    throw err
  }
}

export const signOut = async () => {
  // 관리자 세션 제거
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminSession")
    localStorage.removeItem("mockSession")
  }

  if (!isV0Environment()) {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // 관리자 세션 체크
  if (typeof window !== "undefined" && localStorage.getItem("adminSession") === "true") {
    return {
      id: "admin",
      email: "admin@inhaventureclub.com",
      name: "관리자",
      status: "approved",
      role: "admin",
    }
  }

  // v0 환경에서는 mock 세션 체크
  if (isV0Environment()) {
    if (typeof window !== "undefined") {
      const mockSession = localStorage.getItem("mockSession")
      if (mockSession) {
        const user = JSON.parse(mockSession)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
          role: user.role,
          createdAt: user.created_at,
        }
      }
    }
    return null
  }

  // 실제 Supabase 사용자 확인
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("status, role, created_at, name")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      console.error("Failed to get user data:", userError)
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: userData.name || user.user_metadata?.name || user.email,
      status: userData.status,
      role: userData.role,
      createdAt: userData.created_at,
    }
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

export const checkUserApproval = async (userId: string) => {
  if (isV0Environment()) {
    const mockUsers = getMockUsers()
    const user = mockUsers.find((u) => u.id === userId)
    return {
      status: user?.status || "pending",
      role: user?.role || ("user" as const),
    }
  }

  try {
    const { data, error } = await supabase.from("users").select("status, role").eq("id", userId).single()

    if (error) {
      console.error("Failed to check user approval:", error)
      return { status: "pending" as const, role: "user" as const }
    }

    return {
      status: data.status as "pending" | "approved" | "rejected",
      role: data.role as "user" | "admin",
    }
  } catch (error) {
    console.error("Failed to check user approval:", error)
    return { status: "pending" as const, role: "user" as const }
  }
}

export const getSession = async () => {
  if (isV0Environment()) {
    if (typeof window !== "undefined") {
      const mockSession = localStorage.getItem("mockSession")
      const adminSession = localStorage.getItem("adminSession")

      if (adminSession === "true") {
        return { access_token: "admin_token", user: { id: "admin" } }
      }

      if (mockSession) {
        const user = JSON.parse(mockSession)
        return { access_token: "mock_token", user: { id: user.id } }
      }
    }
    return null
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return session
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  if (isV0Environment()) {
    // v0 환경에서는 storage 이벤트 리스너 사용
    const handleStorageChange = async () => {
      const user = await getCurrentUser()
      callback(user)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener("storage", handleStorageChange)
            },
          },
        },
      }
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }
  }

  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event, session?.user?.email)
    if (session?.user) {
      const authUser = await getCurrentUser()
      callback(authUser)
    } else {
      callback(null)
    }
  })
}
