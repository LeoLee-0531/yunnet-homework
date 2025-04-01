import Link from "next/link";
import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">登入</h1>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          還沒有帳號嗎？{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline underline-offset-4"
          >
            註冊
          </Link>
        </div>
      </div>
    </div>
  );
}
