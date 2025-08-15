"use client"

import { useAuth } from "@/hooks/use-auth"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"
import { User, LogOut, Shield, Zap } from "lucide-react"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container className="py-8">
        <ErrorDisplay
          title="Access Denied"
          description="You need to be signed in to view this page."
          variant="warning"
          showRetry
          retryLabel="Sign In"
          onRetry={() => window.location.href = '/login'}
        />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut()}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="success" className="text-xs">
                  Active
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Your account is active and verified
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">{user.name || "No name set"}</div>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PWA Features</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  Offline Ready
                </Badge>
                <p className="text-xs text-muted-foreground">
                  This app works offline and can be installed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Content */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              This is a demo dashboard showing the PWA Next.js boilerplate in action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>✅ Authentication with Supabase (mock implementation)</p>
              <p>✅ Responsive design with Tailwind CSS</p>
              <p>✅ Dark/light theme support</p>
              <p>✅ Offline indicator</p>
              <p>✅ Toast notifications</p>
              <p>✅ Reusable UI components</p>
              <p>✅ TypeScript throughout</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
