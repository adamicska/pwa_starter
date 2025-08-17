import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In | PWA Next.js Boilerplate",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <AuthForm defaultTab="login" />
    </AuthPageLayout>
  );
}
