"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, onAuthStateChange, signOut as authSignOut } from "@/lib/auth"
import type { AuthUser } from "@/lib/auth"

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await authSignOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    isApproved: user?.isApproved || false,
    isAdmin: user?.role === "admin",
  }
}
