"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form-field"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AuthFormProps {
  defaultTab?: "login" | "signup"
  redirectTo?: string
  className?: string
}

export function AuthForm({ defaultTab = "login", redirectTo, className }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { signIn, signUp, signInWithProvider } = useAuth()

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn(loginForm.email, loginForm.password)
      setSuccess("Successfully signed in!")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await signUp(signupForm.email, signupForm.password, {
        name: signupForm.name,
      })
      setSuccess("Account created! Please check your email to confirm your account.")
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "apple") => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithProvider(provider, { redirectTo })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Failed to sign in with ${provider}`
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  // Login form content
  const loginContent = (
    <form onSubmit={handleLogin} className="space-y-4">
      <FormField
        label="Email"
        type="email"
        placeholder="Enter your email"
        startIcon={<Mail className="h-4 w-4" />}
        value={loginForm.email}
        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
        required
        disabled={isLoading}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        startIcon={<Lock className="h-4 w-4" />}
        value={loginForm.password}
        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
        required
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="px-0 text-sm"
          onClick={() => {
            // For now, show an alert. In production, this would open a forgot password modal
            // or navigate to a forgot password page
            alert('Forgot password functionality would be implemented here. This would typically open a modal or navigate to a password reset page.');
          }}
        >
          Forgot password?
        </Button>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        loading={isLoading}
      >
        Sign In
      </Button>
    </form>
  )

  // Signup form content
  const signupContent = (
    <form onSubmit={handleSignup} className="space-y-4">
      <FormField
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        startIcon={<User className="h-4 w-4" />}
        value={signupForm.name}
        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
        required
        disabled={isLoading}
      />

      <FormField
        label="Email"
        type="email"
        placeholder="Enter your email"
        startIcon={<Mail className="h-4 w-4" />}
        value={signupForm.email}
        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
        required
        disabled={isLoading}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Create a password"
        startIcon={<Lock className="h-4 w-4" />}
        value={signupForm.password}
        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
        required
        disabled={isLoading}
        minLength={6}
      />

      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        startIcon={<Lock className="h-4 w-4" />}
        value={signupForm.confirmPassword}
        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
        required
        disabled={isLoading}
        minLength={6}
      />

      <Button 
        type="submit" 
        className="w-full" 
        loading={isLoading}
      >
        Create Account
      </Button>
    </form>
  )

  // Tabs configuration
  const tabs = [
    {
      value: "login",
      label: "Sign In",
      content: loginContent,
    },
    {
      value: "signup", 
      label: "Sign Up",
      content: signupContent,
    },
  ]

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome
        </CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Auth Buttons */}
        <SocialAuthButtons
          onGoogleClick={() => handleSocialAuth("google")}
          onAppleClick={() => handleSocialAuth("apple")}
          isLoading={isLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Auth Tabs */}
        <Tabs
          tabs={tabs}
          defaultValue={defaultTab}
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  )
}
