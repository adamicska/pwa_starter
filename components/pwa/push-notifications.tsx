"use client"

import * as React from "react"
import { Bell, BellOff, Settings } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PushNotificationsProps {
  className?: string
  variant?: "button" | "card" | "settings"
  vapidKey?: string
  autoRequest?: boolean
  title?: string
  description?: string
  enableButtonText?: string
  disableButtonText?: string
  onSubscribe?: (subscription: PushSubscription) => void
  onUnsubscribe?: () => void
  onError?: (error: Error) => void
}

export function PushNotifications({
  className,
  variant = "button",
  vapidKey,
  autoRequest = false,
  title = "Push Notifications",
  description = "Get notified about important updates and messages.",
  enableButtonText = "Enable Notifications",
  disableButtonText = "Disable Notifications",
  onSubscribe,
  onUnsubscribe,
  onError,
}: PushNotificationsProps) {
  const {
    permission,
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    requestPermission,
  } = usePushNotifications(vapidKey)

  const [showDialog, setShowDialog] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (autoRequest && isSupported && permission === 'default') {
      // Auto-request with a delay for better UX
      const timer = setTimeout(() => {
        setShowDialog(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [autoRequest, isSupported, permission])

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      let currentPermission = permission
      
      if (currentPermission === 'default') {
        currentPermission = await requestPermission()
      }
      
      if (currentPermission === 'granted') {
        const sub = await subscribe()
        if (sub) {
          onSubscribe?.(sub)
        }
      } else {
        throw new Error('Permission denied for notifications')
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
      setShowDialog(false)
    }
  }

  const handleDisable = async () => {
    setIsLoading(true)
    try {
      const success = await unsubscribe()
      if (success) {
        onUnsubscribe?.()
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error)
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestNotification = async () => {
    if (permission === 'granted') {
      try {
        // Show a test notification
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          await registration.showNotification('Test Notification', {
            body: 'This is a test notification from your PWA!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'test-notification',
            requireInteraction: false,
          })
        }
      } catch (error) {
        console.error('Failed to show test notification:', error)
        onError?.(error as Error)
      }
    }
  }

  if (!isSupported) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Push notifications are not supported in this browser.
      </div>
    )
  }

  if (variant === "settings") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {isSubscribed ? (
                <Bell className="w-5 h-5 text-primary" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
              
              <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full",
                  permission === 'granted' 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    : permission === 'denied'
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                )}>
                  Permission: {permission}
                </span>
                
                {isSubscribed && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    Subscribed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isSubscribed ? (
              <Button
                size="sm"
                onClick={handleEnable}
                disabled={isLoading || permission === 'denied'}
                className="h-8"
              >
                {isLoading ? "Enabling..." : enableButtonText}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisable}
                disabled={isLoading}
                className="h-8"
              >
                {isLoading ? "Disabling..." : disableButtonText}
              </Button>
            )}

            {isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="h-8"
              >
                Test
              </Button>
            )}
          </div>

          {permission === 'denied' && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  if (variant === "card") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>

          <Button
            size="sm"
            variant={isSubscribed ? "outline" : "primary"}
            onClick={isSubscribed ? handleDisable : handleEnable}
            disabled={isLoading || permission === 'denied'}
            className="h-8"
          >
            {isLoading ? "..." : isSubscribed ? disableButtonText : enableButtonText}
          </Button>
        </div>
      </Card>
    )
  }

  // Default button variant
  return (
    <>
      <Button
        variant={isSubscribed ? "outline" : "primary"}
        size="sm"
        onClick={isSubscribed ? handleDisable : () => setShowDialog(true)}
        disabled={isLoading || permission === 'denied'}
        className={cn("gap-2", className)}
      >
        {isSubscribed ? (
          <Bell className="w-4 h-4" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        {isLoading ? "..." : isSubscribed ? disableButtonText : enableButtonText}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Stay updated</p>
                <p className="text-muted-foreground text-xs">
                  Get instant notifications for important updates and messages.
                </p>
              </div>
            </div>

            {permission === 'denied' && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Notifications are currently blocked. Please enable them in your browser settings.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isLoading}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleEnable}
              disabled={isLoading || permission === 'denied'}
            >
              {isLoading ? "Enabling..." : enableButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Notification permission status indicator
export function NotificationPermissionStatus({ className }: { className?: string }) {
  const { permission, isSupported } = usePushNotifications()

  if (!isSupported) return null

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        permission === 'granted' ? "bg-green-500" :
        permission === 'denied' ? "bg-red-500" :
        "bg-yellow-500"
      )} />
      <span className="text-xs text-muted-foreground capitalize">
        {permission}
      </span>
    </div>
  )
}
