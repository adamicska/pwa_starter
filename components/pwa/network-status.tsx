"use client"

import * as React from "react"
import { Wifi, WifiOff, Signal, SignalLow, SignalMedium, SignalHigh } from "lucide-react"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { cn } from "@/lib/utils"

interface NetworkStatusProps {
  className?: string
  variant?: "indicator" | "badge" | "detailed"
  showText?: boolean
  showSpeed?: boolean
  onlineText?: string
  offlineText?: string
}

export function NetworkStatus({
  className,
  variant = "indicator",
  showText = false,
  showSpeed = false,
  onlineText = "Online",
  offlineText = "Offline",
}: NetworkStatusProps) {
  const {
    isOnline,
    isOffline,
    downlink,
    effectiveType,
    rtt,
    wasOffline,
    lastOfflineAt,
  } = useNetworkStatus()

  const [showReconnectedMessage, setShowReconnectedMessage] = React.useState(false)

  React.useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnectedMessage(true)
      const timer = setTimeout(() => setShowReconnectedMessage(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  const getSignalIcon = () => {
    if (isOffline) return <WifiOff className="w-4 h-4" />
    
    if (!effectiveType) return <Wifi className="w-4 h-4" />
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return <SignalLow className="w-4 h-4" />
      case '3g':
        return <SignalMedium className="w-4 h-4" />
      case '4g':
      case '5g':
        return <SignalHigh className="w-4 h-4" />
      default:
        return <Signal className="w-4 h-4" />
    }
  }

  const getSpeedText = () => {
    if (isOffline || !downlink) return null
    
    if (downlink >= 10) return "Fast"
    if (downlink >= 1.5) return "Good"
    if (downlink >= 0.5) return "Slow"
    return "Very Slow"
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            isOnline 
              ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          )}>
            {getSignalIcon()}
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-sm">
              {isOnline ? onlineText : offlineText}
            </div>
            
            {showSpeed && isOnline && (
              <div className="text-xs text-muted-foreground">
                {effectiveType && (
                  <span className="capitalize">{effectiveType}</span>
                )}
                {downlink && (
                  <span className="ml-2">{downlink} Mbps</span>
                )}
                {rtt && (
                  <span className="ml-2">{rtt}ms</span>
                )}
              </div>
            )}
          </div>
        </div>

        {showReconnectedMessage && (
          <div className="text-xs text-green-600 dark:text-green-400 animate-in fade-in-0">
            ✓ Connection restored
          </div>
        )}

        {isOffline && lastOfflineAt && (
          <div className="text-xs text-muted-foreground">
            Offline since {lastOfflineAt.toLocaleTimeString()}
          </div>
        )}
      </div>
    )
  }

  if (variant === "badge") {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        isOnline 
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
        className
      )}>
        {getSignalIcon()}
        {showText && (
          <span>{isOnline ? onlineText : offlineText}</span>
        )}
        {showSpeed && isOnline && getSpeedText() && (
          <span className="ml-1">({getSpeedText()})</span>
        )}
      </div>
    )
  }

  // Default indicator variant
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        isOnline 
          ? "bg-green-500 animate-pulse" 
          : "bg-red-500"
      )} />
      
      {showText && (
        <span className={cn(
          "text-sm font-medium",
          isOnline ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          {isOnline ? onlineText : offlineText}
        </span>
      )}
      
      {showReconnectedMessage && (
        <span className="text-xs text-green-600 dark:text-green-400 animate-in fade-in-0">
          ✓ Reconnected
        </span>
      )}
    </div>
  )
}

// Toast-like notification for network status changes
export function NetworkStatusToast() {
  const { isOnline, isOffline, wasOffline } = useNetworkStatus()
  const [show, setShow] = React.useState(false)
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (isOffline) {
      setMessage("You're offline. Some features may not work.")
      setShow(true)
    } else if (isOnline && wasOffline) {
      setMessage("You're back online!")
      setShow(true)
      // Auto-hide the "back online" message
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, isOffline, wasOffline])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in-0">
      <div className={cn(
        "px-4 py-3 rounded-lg shadow-lg border max-w-sm",
        isOffline 
          ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          : "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
      )}>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <WifiOff className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Wifi className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={() => setShow(false)}
            className="ml-2 hover:opacity-70"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
