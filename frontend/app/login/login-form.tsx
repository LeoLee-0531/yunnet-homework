"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const formSchema = z.object({
  studentId: z.string().min(1, {
    message: "請填入學號",
  }),
  password: z.string().min(1, {
    message: "請填入密碼",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)  // 密碼可視狀態

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // In a real app, you would validate credentials with your backend
      console.log(values)

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll just set a flag in localStorage
      // In a real app, this would involve proper authentication
      localStorage.setItem("isLoggedIn", "true")

      // If no user data exists yet, create some demo data
      if (!localStorage.getItem("user")) {
        const demoUser = {
          studentId: values.studentId,
          name: "李宥丞",
          department: "四電機三B",
          bed: "B3309-1",
          tags: ["住宿生", "已註冊"],
        }
        localStorage.setItem("user", JSON.stringify(demoUser))
      }

      toast("登入成功！")

      router.push("/profile")
    } catch {
      toast("登入失敗")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>學號</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            忘記密碼?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "登入中..." : "登入"}
        </Button>
      </form>
    </Form>
  )
}

