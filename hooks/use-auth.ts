"use client"

import * as React from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { useToast } from "./use-toast"

export interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<void>
  signInWithProvider: (provider: "google" | "apple", options?: { redirectTo?: string }) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

// Mock implementation for development (replace with actual Supabase when configured)
const mockUser: User = {
  id: "mock-user-id",
  email: "demo@example.com",
  name: "Demo User",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function useAuth(): AuthContextType {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const signIn = React.useCallback(async (email: string, password: string) => {
    setLoading(true)
    
    try {
      // Mock authentication - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      if (email === "demo@example.com" && password === "password") {
        setUser(mockUser)
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials and try again."
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  const signUp = React.useCallback(async (
    email: string, 
    password: string, 
    metadata?: { name?: string }
  ) => {
    setLoading(true)
    
    try {
      // Mock registration - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again."
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  const signInWithProvider = React.useCallback(async (
    provider: "google" | "apple",
    options?: { redirectTo?: string }
  ) => {
    setLoading(true)
    
    try {
      // Mock OAuth - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: `${provider === 'google' ? 'Google' : 'Apple'} authentication`,
        description: "This is a demo. In production, this would redirect to the OAuth provider.",
      })
      
      // In a real implementation, this would redirect to the OAuth provider
      // For demo purposes, we'll just show a success message
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Failed to authenticate with ${provider}.`
      toast({
        variant: "destructive",
        title: "OAuth failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  const signOut = React.useCallback(async () => {
    setLoading(true)
    
    try {
      setUser(null)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
      router.push("/")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign out. Please try again."
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  const resetPassword = React.useCallback(async (email: string) => {
    setLoading(true)
    
    try {
      // Mock password reset - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send password reset email."
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  const updatePassword = React.useCallback(async (password: string) => {
    setLoading(true)
    
    try {
      // Mock password update - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update password."
      toast({
        variant: "destructive", 
        title: "Password update failed",
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  const updateProfile = React.useCallback(async (data: Partial<User>) => {
    setLoading(true)
    
    try {
      // Mock profile update - replace with actual Supabase implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser(prev => prev ? { ...prev, ...data } : null)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile."
      toast({
        variant: "destructive",
        title: "Profile update failed", 
        description: errorMessage,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }
}

// Note: This is a mock implementation for development.
// When you configure Supabase, replace this with:
/*
export function useAuth(): AuthContextType {
  const supabase = createClientComponentClient()
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name,
        avatar: session.user.user_metadata?.avatar_url,
      } : null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
        } : null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signIn = React.useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }, [supabase])

  const signUp = React.useCallback(async (
    email: string, 
    password: string, 
    metadata?: { name?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
  }, [supabase])

  const signInWithProvider = React.useCallback(async (
    provider: "google" | "apple",
    options?: { redirectTo?: string }
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: options?.redirectTo || window.location.origin,
      },
    })
    if (error) throw error
  }, [supabase])

  const signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push("/")
  }, [supabase, router])

  const resetPassword = React.useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }, [supabase])

  const updatePassword = React.useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }, [supabase])

  const updateProfile = React.useCallback(async (data: Partial<User>) => {
    const { error } = await supabase.auth.updateUser({
      data,
    })
    if (error) throw error
  }, [supabase])

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }
}
*/
