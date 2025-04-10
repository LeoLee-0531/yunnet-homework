"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface UserData {
  studentId: string
  name: string
  department: string
  bed: string
  tags: string[]
}

export default function ProfileClient() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user")
    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr)
        setUserData(parsedData)
      } catch (error) {
        console.error("Failed to parse user data", error)
        toast("載入用戶資料失敗")
      }
    }

    setIsLoading(false)
  }, [router]) // 添加 router 作為依賴項

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
    toast("登出成功！")
  }

  if (isLoading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="text-center">載入中...</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">找不到使用者資料</h1>
          <p className="mt-2 text-muted-foreground">請重新登入</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            登入
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">個人資訊</h1>
        <Button variant="outline" onClick={handleLogout}>
          登出
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userData.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">系級</h3>
              <p>{userData.studentId}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">系級</h3>
              <p>{userData.department}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">床位</h3>
              <p>{userData.bed}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">標籤</h3>
            <div className="flex flex-wrap gap-2">
              {userData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
