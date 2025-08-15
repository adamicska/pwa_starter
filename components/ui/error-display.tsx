"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, XCircle, Info, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ErrorDisplayProps {
  error?: string | Error | null
  title?: string
  description?: string
  variant?: "destructive" | "warning" | "default" | "success"
  showIcon?: boolean
  showRetry?: boolean
  retryLabel?: string
  onRetry?: () => void
  className?: string
  children?: React.ReactNode
}

const variantIcons = {
  destructive: XCircle,
  warning: AlertTriangle,
  default: Info,
  success: CheckCircle,
}

export function ErrorDisplay({
  error,
  title,
  description,
  variant = "destructive",
  showIcon = true,
  showRetry = false,
  retryLabel = "Try again",
  onRetry,
  className,
  children,
}: ErrorDisplayProps) {
  // Don't render if no error and no custom content
  if (!error && !title && !description && !children) {
    return null
  }

  const Icon = variantIcons[variant]
  
  // Extract error message if error is an Error object
  const errorMessage = error instanceof Error ? error.message : error

  const displayTitle = title || (
    variant === "destructive" ? "Something went wrong" :
    variant === "warning" ? "Warning" :
    variant === "success" ? "Success" :
    "Information"
  )

  const displayDescription = description || errorMessage

  return (
    <Alert variant={variant} className={cn("", className)}>
      {showIcon && <Icon className="h-4 w-4" />}
      <AlertTitle>{displayTitle}</AlertTitle>
      {displayDescription && (
        <AlertDescription className="mt-2">
          {displayDescription}
        </AlertDescription>
      )}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
      {showRetry && onRetry && (
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </Alert>
  )
}

// Convenience components for specific use cases
export function ErrorMessage({ error, onRetry, ...props }: Omit<ErrorDisplayProps, 'variant'>) {
  return (
    <ErrorDisplay
      variant="destructive"
      error={error}
      showRetry={!!onRetry}
      onRetry={onRetry}
      {...props}
    />
  )
}

export function WarningMessage({ error, ...props }: Omit<ErrorDisplayProps, 'variant'>) {
  return (
    <ErrorDisplay
      variant="warning"
      error={error}
      {...props}
    />
  )
}

export function SuccessMessage({ error, ...props }: Omit<ErrorDisplayProps, 'variant'>) {
  return (
    <ErrorDisplay
      variant="success"
      error={error}
      {...props}
    />
  )
}

export function InfoMessage({ error, ...props }: Omit<ErrorDisplayProps, 'variant'>) {
  return (
    <ErrorDisplay
      variant="default"
      error={error}
      {...props}
    />
  )
}
