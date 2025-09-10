"use client"

import type React from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireApproval?: boolean
  adminOnly?: boolean
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>
}
