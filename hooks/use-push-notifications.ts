"use client"

import { useState, useEffect, useCallback } from "react"

export interface PushNotificationState {
  permission: NotificationPermission
  isSupported: boolean
  isSubscribed: boolean
  subscription: PushSubscription | null
  subscribe: (vapidKey?: string) => Promise<PushSubscription | null>
  unsubscribe: () => Promise<boolean>
  requestPermission: () => Promise<NotificationPermission>
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>
}

export function usePushNotifications(vapidKey?: string): PushNotificationState {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkSupport = () => {
      const supported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
      }
    }

    const checkSubscription = async () => {
      if (!isSupported) return

      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const sub = await registration.pushManager.getSubscription()
          setSubscription(sub)
          setIsSubscribed(!!sub)
        }
      } catch (error) {
        console.error('Error checking push subscription:', error)
      }
    }

    checkSupport()
    checkSubscription()
  }, [isSupported])

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied'

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }, [isSupported])

  const subscribe = useCallback(async (customVapidKey?: string): Promise<PushSubscription | null> => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return null

      const key = customVapidKey || vapidKey
      if (!key) {
        console.warn('VAPID key is required for push subscriptions')
        return null
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      })

      setSubscription(sub)
      setIsSubscribed(true)
      
      // You would typically send this subscription to your server
      console.log('Push subscription created:', sub)
      
      return sub
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }, [isSupported, permission, vapidKey])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return false

    try {
      const result = await subscription.unsubscribe()
      if (result) {
        setSubscription(null)
        setIsSubscribed(false)
        console.log('Push subscription cancelled')
      }
      return result
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return false
    }
  }, [subscription])

  const showNotification = useCallback(async (title: string, options?: NotificationOptions): Promise<void> => {
    if (!isSupported || permission !== 'granted') return

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options
        })
      }
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }, [isSupported, permission])

  return {
    permission,
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
    requestPermission,
    showNotification
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
}
