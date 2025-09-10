"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message: string
    details?: any
  }>({ status: "idle", message: "" })

  const testConnection = async () => {
    setTestResult({ status: "testing", message: "연결 테스트 중..." })

    try {
      const supabase = getSupabaseClient()

      // 1. 기본 연결 테스트
      const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

      if (connectionError) {
        throw new Error(`연결 실패: ${connectionError.message}`)
      }

      // 2. Auth 테스트
      const { data: authTest, error: authError } = await supabase.auth.getSession()

      if (authError) {
        throw new Error(`Auth 실패: ${authError.message}`)
      }

      // 3. 테이블 구조 확인
      const { data: tableTest, error: tableError } = await supabase.from("users").select("*").limit(1)

      setTestResult({
        status: "success",
        message: "✅ Supabase 연결 성공!",
        details: {
          connection: "정상",
          auth: "정상",
          usersTable: tableError ? `오류: ${tableError.message}` : "정상",
          userCount: Array.isArray(tableTest) ? tableTest.length : 0,
        },
      })
    } catch (error: any) {
      setTestResult({
        status: "error",
        message: `❌ 연결 실패: ${error.message}`,
        details: error,
      })
    }
  }

  const getIcon = () => {
    switch (testResult.status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "testing":
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          Supabase 연결 테스트
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testResult.status === "testing"} className="w-full">
          {testResult.status === "testing" ? "테스트 중..." : "연결 테스트"}
        </Button>

        {testResult.message && (
          <div
            className={`p-3 rounded-md ${
              testResult.status === "success"
                ? "bg-green-50 text-green-800"
                : testResult.status === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-yellow-50 text-yellow-800"
            }`}
          >
            <p className="text-sm font-medium">{testResult.message}</p>

            {testResult.details && typeof testResult.details === "object" && (
              <div className="mt-2 text-xs">
                <pre className="whitespace-pre-wrap">{JSON.stringify(testResult.details, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
