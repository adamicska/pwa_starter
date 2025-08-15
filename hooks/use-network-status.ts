"use client"

import { useState, useEffect } from "react"

export interface NetworkStatus {
  isOnline: boolean
  isOffline: boolean
  downlink?: number
  effectiveType?: string
  rtt?: number
  saveData?: boolean
  connectionType?: string
}

export interface NetworkState extends NetworkStatus {
  wasOffline: boolean
  lastOnlineAt?: Date
  lastOfflineAt?: Date
}

export function useNetworkStatus(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    wasOffline: false,
  }))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine
      const now = new Date()
      
      setNetworkState(prev => ({
        ...prev,
        isOnline,
        isOffline: !isOnline,
        wasOffline: prev.wasOffline || (!isOnline && prev.isOnline),
        lastOnlineAt: isOnline && !prev.isOnline ? now : prev.lastOnlineAt,
        lastOfflineAt: !isOnline && prev.isOnline ? now : prev.lastOfflineAt,
      }))

      // Dispatch custom events
      window.dispatchEvent(new CustomEvent(isOnline ? 'app-online' : 'app-offline', {
        detail: { timestamp: now }
      }))
    }

    type ConnectionInfo = {
      downlink: number
      effectiveType: string
      rtt: number
      saveData: boolean
      type: string
      addEventListener?: (event: string, listener: () => void) => void
      removeEventListener?: (event: string, listener: () => void) => void
    }

    const updateConnectionInfo = () => {
      const navWithConnection = navigator as Navigator & {
        connection?: ConnectionInfo
        mozConnection?: ConnectionInfo
        webkitConnection?: ConnectionInfo
      }

      const connection = navWithConnection.connection || 
                        navWithConnection.mozConnection || 
                        navWithConnection.webkitConnection

      if (connection) {
        setNetworkState(prev => ({
          ...prev,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          saveData: connection.saveData,
          connectionType: connection.type,
        }))
      }
    }

    // Initial setup
    updateNetworkStatus()
    updateConnectionInfo()

    // Event listeners
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Connection change listener
    const navWithConnection = navigator as Navigator & { connection?: ConnectionInfo }
    const connection = navWithConnection.connection
    if (connection && connection.addEventListener) {
      connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      if (connection && connection.removeEventListener) {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return networkState
}
