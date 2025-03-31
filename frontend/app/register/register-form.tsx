"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"  // 眼睛圖示

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const formSchema = z
  .object({
    studentId: z.string()
      .min(8, { message: "學號輸入錯誤" })
      .regex(/^[A-Za-z][0-9]+$/, { message: "學號輸入錯誤" }),
    bed: z.string()
      .regex(/^[a-zA-Z]\d{4}-\d$/, { message: "床位輸入錯誤" }),
    password: z.string()
      .min(1, { message: "請輸入密碼" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "與密碼不相符",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)  // 密碼可視狀態

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      bed: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 確認用戶提交
    if (!confirm("確定提交?")) {
      return;
    }

    setIsLoading(true)

    try {
      // TODO 將結果傳置後端
      console.log(values)

      // Simulate API call
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     // 檢查是否有重複的學生ID (模擬可能的後端錯誤)
      //     const existingUser = localStorage.getItem("user");
      //     if (existingUser && JSON.parse(existingUser).studentId === values.studentId) {
      //       reject(new Error("Student ID already registered"));
      //     } else {
      //       resolve(true);
      //     }
      //   }, 1000);
      // });

      // Store user data in localStorage for demo purposes
      // In a real app, this would be handled by your backend
      // const userData = {
      //   studentId: values.studentId,
      //   bedAssignment: "B3309-1", // Example data
      //   class: "Year 2, Class A", // Example data
      //   tags: ["Dormitory Resident", "Registered"], // Example data
      // }

      // localStorage.setItem("user", JSON.stringify(userData))
      // localStorage.setItem("isLoggedIn", "true")

      toast.success("註冊成功", {
        description: "帳號已建立，請登入",
      })

      router.push("/login")
    } catch (error: any) {
      toast.error("註冊失敗", {
        description: error.message || "請稍後再試"
      })
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
                <Input placeholder="B11112159" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>床位</FormLabel>
              <FormControl>
                <Input placeholder="A1203-4" {...field} />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼確認</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "註冊中..." : "註冊"}
        </Button>
      </form>
    </Form>
  )
}

