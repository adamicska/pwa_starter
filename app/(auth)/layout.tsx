import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | PWA Next.js Boilerplate",
  description: "Sign in or create an account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {children}
    </div>
  )
}
