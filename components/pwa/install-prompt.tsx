"use client"

import * as React from "react"
import { Download, X, Smartphone } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InstallPromptProps {
  className?: string
  variant?: "banner" | "card" | "floating"
  autoShow?: boolean
  showIcon?: boolean
  title?: string
  description?: string
  installButtonText?: string
  dismissButtonText?: string
  onInstall?: () => void
  onDismiss?: () => void
}

export function InstallPrompt({
  className,
  variant = "banner",
  autoShow = true,
  showIcon = true,
  title = "Install App",
  description = "Install this app for a better experience with offline access and faster loading.",
  installButtonText = "Install",
  dismissButtonText = "Maybe later",
  onInstall,
  onDismiss,
}: InstallPromptProps) {
  const { isInstallable, canInstall, promptInstall, dismissInstall } = usePWAInstall()
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (autoShow && isInstallable && canInstall && !isDismissed) {
      // Show with a slight delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [autoShow, isInstallable, canInstall, isDismissed])

  const handleInstall = async () => {
    try {
      await promptInstall()
      setIsVisible(false)
      onInstall?.()
    } catch (error) {
      console.error('Install failed:', error)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    dismissInstall()
    onDismiss?.()
  }

  if (!isInstallable || !canInstall || isDismissed || !isVisible) {
    return null
  }

  const content = (
    <>
      {showIcon && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          onClick={handleInstall}
          className="h-8 px-3"
        >
          <Download className="w-3 h-3 mr-1" />
          {installButtonText}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-8 w-8 p-0"
        >
          <X className="w-3 h-3" />
          <span className="sr-only">{dismissButtonText}</span>
        </Button>
      </div>
    </>
  )

  if (variant === "card") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          {content}
        </div>
      </Card>
    )
  }

  if (variant === "floating") {
    return (
      <div className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50",
        "bg-background border rounded-lg shadow-lg p-4",
        "animate-in slide-in-from-bottom-2 fade-in-0 duration-300",
        className
      )}>
        <div className="flex items-center gap-3">
          {content}
        </div>
      </div>
    )
  }

  // Default banner variant
  return (
    <div className={cn(
      "bg-primary text-primary-foreground px-4 py-3",
      "border-b",
      className
    )}>
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        {content}
      </div>
    </div>
  )
}

// Higher-order component for automatic install prompts
export function withInstallPrompt<P extends object>(
  Component: React.ComponentType<P>,
  promptProps?: Partial<InstallPromptProps>
) {
  return function WithInstallPromptComponent(props: P) {
    return (
      <>
        <InstallPrompt {...promptProps} />
        <Component {...props} />
      </>
    )
  }
}
