"use client"

import { useState, useEffect, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface PWAInstallState {
  isInstallable: boolean
  isInstalled: boolean
  canInstall: boolean
  promptInstall: () => Promise<void>
  dismissInstall: () => void
}

export function usePWAInstall(): PWAInstallState {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (typeof window !== 'undefined') {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as Navigator & { standalone?: boolean }).standalone ||
                            document.referrer.includes('android-app://');
        setIsInstalled(isStandalone)
      }
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent
      setInstallPromptEvent(promptEvent)
      setIsInstallable(true)
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPromptEvent(null)
      console.log('PWA was installed successfully')
    }

    // Listen for events
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Initial check
    checkInstalled()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!installPromptEvent) return

    try {
      await installPromptEvent.prompt()
      const choiceResult = await installPromptEvent.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setInstallPromptEvent(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during install prompt:', error)
    }
  }, [installPromptEvent])

  const dismissInstall = useCallback(() => {
    setInstallPromptEvent(null)
    setIsInstallable(false)
  }, [])

  return {
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    canInstall: !!installPromptEvent,
    promptInstall,
    dismissInstall
  }
}
