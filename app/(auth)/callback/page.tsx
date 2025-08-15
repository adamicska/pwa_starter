"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthPageLayout } from "@/components/auth/auth-page-layout"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Loader2 } from "lucide-react"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params (OAuth error)
        const urlError = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (urlError) {
          throw new Error(errorDescription || 'Authentication failed')
        }

        // Simulate OAuth callback processing
        // In a real implementation, this would:
        // 1. Exchange the auth code for tokens
        // 2. Create or update the user session
        // 3. Redirect to the intended destination
        
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
        
        setSuccess(true)
        
        // Redirect after success
        setTimeout(() => {
          const returnTo = searchParams.get('returnTo') || '/dashboard'
          router.push(returnTo)
        }, 1500)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (loading) {
    return (
      <AuthPageLayout
        title="Authenticating..."
        subtitle="Please wait while we complete your sign in"
        maxWidth="md"
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </AuthPageLayout>
    )
  }

  if (error) {
    return (
      <AuthPageLayout
        title="Authentication Failed"
        subtitle="There was a problem completing your sign in"
        maxWidth="md"
        showBackButton
        backButtonLabel="Back to Sign In"
        onBack={() => router.push('/login')}
      >
        <ErrorDisplay
          error={error}
          title="Authentication Error"
          showRetry
          onRetry={() => router.push('/login')}
          retryLabel="Try signing in again"
        />
      </AuthPageLayout>
    )
  }

  if (success) {
    return (
      <AuthPageLayout
        title="Success!"
        subtitle="You have been successfully authenticated"
        maxWidth="md"
      >
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <div className="text-center text-sm text-muted-foreground">
            Redirecting you to your dashboard...
          </div>
        </div>
      </AuthPageLayout>
    )
  }

  return null
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthPageLayout
          title="Loading..."
          subtitle="Please wait while we process your request"
          maxWidth="md"
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </div>
        </AuthPageLayout>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
