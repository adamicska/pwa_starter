'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Set initial state
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/'
    } else {
      window.location.reload()
    }
  }

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You&apos;re Offline</CardTitle>
          <CardDescription>
            {isOnline 
              ? "You&apos;re back online! You can now continue using the app."
              : "It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still browse some content that was cached."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOnline && (
            <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm">
              ✓ Connection restored
            </div>
          )}
          
          <Button 
            onClick={handleRetry}
            className="w-full"
            variant={isOnline ? "primary" : "outline"}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isOnline ? 'Continue to App' : 'Try Again'}
          </Button>
          
          {!isOnline && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Available offline:</p>
              <ul className="space-y-1">
                <li>• Previously visited pages</li>
                <li>• Cached content</li>
                <li>• Basic functionality</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
