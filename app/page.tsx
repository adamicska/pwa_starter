'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NetworkStatus } from '@/components/pwa/network-status'
import { PushNotifications } from '@/components/pwa/push-notifications'
import { 
  Smartphone, 
  Wifi, 
  Bell, 
  Zap, 
  Shield, 
  Palette,
  Code,
  Rocket,
  ExternalLink
} from 'lucide-react'

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check if PWA is installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Progressive Web App",
      description: "Install this app on your device for a native-like experience with offline support and push notifications.",
      status: isInstalled ? "Installed" : "Available",
      color: isInstalled ? "text-green-600" : "text-blue-600"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Offline Support",
      description: "Works seamlessly offline with service worker caching and background sync capabilities.",
      status: isOnline ? "Online" : "Offline",
      color: isOnline ? "text-green-600" : "text-orange-600"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Push Notifications",
      description: "Receive real-time notifications even when the app is closed or in the background.",
      status: "Available",
      color: "text-purple-600"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Performance",
      description: "Optimized with Next.js App Router, TypeScript, and modern web technologies for lightning-fast performance.",
      status: "Optimized",
      color: "text-yellow-600"
    }
  ]

  const techStack = [
    { name: "Next.js 15", description: "App Router with React Server Components" },
    { name: "TypeScript", description: "Strict mode for type safety" },
    { name: "Tailwind CSS v4", description: "Modern utility-first CSS framework" },
    { name: "Skeleton UI", description: "Beautiful component design system" },
    { name: "Radix UI", description: "Unstyled, accessible components" },
    { name: "Supabase", description: "Backend-as-a-Service with auth" },
    { name: "Service Workers", description: "Offline functionality and caching" },
    { name: "Web Push API", description: "Native push notifications" }
  ]

  return (
    <Container className="py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">PWA Next.js Boilerplate</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern Progressive Web App boilerplate built with Next.js, TypeScript, Tailwind CSS v4, and Skeleton UI design system.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary" className="space-x-1">
            <Code className="w-3 h-3" />
            <span>Production Ready</span>
          </Badge>
          <Badge variant="secondary" className="space-x-1">
            <Shield className="w-3 h-3" />
            <span>Type Safe</span>
          </Badge>
          <Badge variant="secondary" className="space-x-1">
            <Palette className="w-3 h-3" />
            <span>Beautiful Design</span>
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/login">
          <Button size="lg" className="w-full sm:w-auto">
            Get Started
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View Dashboard
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>

      {/* PWA Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">PWA Features</h2>
          <p className="text-muted-foreground">
            Experience the power of modern web technologies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="outline" className={feature.color}>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Network Status Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="w-5 h-5" />
            <span>Network Status Demo</span>
          </CardTitle>
          <CardDescription>
            Try disconnecting your internet to see the offline functionality in action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkStatus />
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Current status: <strong className={isOnline ? "text-green-600" : "text-orange-600"}>
              {isOnline ? "Online" : "Offline"}
            </strong>
          </p>
        </CardContent>
      </Card>

      {/* Push Notifications Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Push Notifications Demo</span>
          </CardTitle>
          <CardDescription>
            Test push notifications to see how they work in your PWA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushNotifications />
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Tech Stack</h2>
          <p className="text-muted-foreground">
            Built with modern, production-ready technologies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  {tech.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5" />
            <span>Ready to Build?</span>
          </CardTitle>
          <CardDescription>
            This boilerplate includes everything you need to build a modern Progressive Web App.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="flex-1">
              <Button className="w-full">
                Try Authentication
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                View Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/offline" className="flex-1">
              <Button variant="outline" className="w-full">
                Test Offline Mode
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <Separator />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Check the <strong>README.md</strong> for setup instructions and customization guide.
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
