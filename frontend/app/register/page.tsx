import Link from "next/link"
import { RegisterForm } from "@/components/register/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">註冊帳號</h1>
        </div>
        <RegisterForm />
        <div className="text-center text-sm">
          已經有帳號了？
          <Link href="/login" className="font-medium text-primary underline underline-offset-4">
            登入
          </Link>
        </div>
      </div>
    </div>
  )
}

