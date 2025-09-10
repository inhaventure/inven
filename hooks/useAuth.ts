"use client"

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signOut: async () => {},
    isAuthenticated: false,
    isApproved: false,
    isAdmin: false,
  }
}
