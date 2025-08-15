import type { Metadata } from "next"
import Link from "next/link"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign Up | PWA Next.js Boilerplate",
  description: "Create a new account",
}

export default function SignupPage() {
  return (
    <AuthPageLayout
      title="Create an account"
      subtitle="Get started with your new account"
      description="Enter your information below to create your account"
    >
      <AuthForm defaultTab="signup" />
      
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign in here
        </Link>
      </div>
    </AuthPageLayout>
  )
}
