"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export interface AuthPageLayoutProps {
  title?: string
  subtitle?: string
  description?: string
  children: React.ReactNode
  showBackButton?: boolean
  backButtonLabel?: string
  onBack?: () => void
  className?: string
  contentClassName?: string
  maxWidth?: "sm" | "md" | "lg"
}

export function AuthPageLayout({
  title,
  subtitle,
  description,
  children,
  showBackButton = false,
  backButtonLabel = "Back",
  onBack,
  className,
  contentClassName,
  maxWidth = "sm",
}: AuthPageLayoutProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
  }

  return (
    <Container className={cn("min-h-screen flex items-center justify-center py-12", className)}>
      <div className={cn("w-full", maxWidthClasses[maxWidth])}>
        {showBackButton && (
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="pl-0 text-muted-foreground hover:text-foreground"
            >
              {backButtonLabel}
            </Button>
          </div>
        )}

        {children}
        
        {/* <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="text-base">
                {subtitle}
              </CardDescription>
            )}
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className={cn("space-y-4", contentClassName)}>
            
          </CardContent>
        </Card> */}
      </div>
    </Container>
  )
}
