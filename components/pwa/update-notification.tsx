'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when a new service worker takes control
        window.location.reload()
      })

      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  setWaitingWorker(newWorker)
                  setShowUpdate(true)
                }
              })
            }
          })

          // Check if there's already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting)
            setShowUpdate(true)
          }
        }
      })
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting and become active
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowUpdate(false)
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
  }

  if (!showUpdate) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 shadow-lg border-2 border-blue-500/20 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">Update Available</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          A new version of the app is available. Update now to get the latest features and improvements.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button onClick={handleUpdate} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Update Now
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
