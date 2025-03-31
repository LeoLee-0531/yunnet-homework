import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/Yunnet-light.svg"
              alt="logo"
              width={200}
              priority
            />
          </Link>
          <div className="flex gap-4">
            <Button asChild variant="secondary">
              <Link href="/login">登入</Link>
            </Button>
            <Button asChild>
              <Link href="/register">註冊</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 py-12 flex items-center">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">雲科大網路管理小組</h2>
          <p className="text-xl text-muted-foreground">查看你的個人信息、網路狀態等等</p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">開始使用</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">登入</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Dormitory Network Management Team. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

