"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Header, type HeaderProps } from "./header"
import { Footer, type FooterProps } from "./footer"
import { NetworkStatusToast } from "../pwa/network-status"
import { InstallPrompt } from "../pwa/install-prompt"

interface LayoutProps {
  children: React.ReactNode
  className?: string
  headerProps?: Partial<HeaderProps>
  footerProps?: Partial<FooterProps>
  showNetworkToasts?: boolean
  showInstallPrompt?: boolean
  installPromptVariant?: "banner" | "card" | "floating"
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  paddingY?: "none" | "sm" | "md" | "lg" | "xl"
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(({
  children,
  className,
  headerProps,
  footerProps,
  showNetworkToasts = true,
  showInstallPrompt = true,
  installPromptVariant = "banner",
  maxWidth = "full",
  paddingY = "md",
  ...props
}, ref) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md", 
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "w-full"
  }

  const paddingClasses = {
    none: "",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16"
  }

  return (
    <div
      ref={ref}
      className={cn("min-h-screen flex flex-col", className)}
      {...props}
    >
      {/* Install Prompt Banner */}
      {showInstallPrompt && installPromptVariant === "banner" && (
        <InstallPrompt variant="banner" />
      )}

      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className={cn(
          "flex-1 mx-auto w-full",
          maxWidthClasses[maxWidth],
          paddingClasses[paddingY]
        )}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer {...footerProps} />

      {/* Floating Install Prompt */}
      {showInstallPrompt && installPromptVariant === "floating" && (
        <InstallPrompt variant="floating" />
      )}

      {/* Network Status Toasts */}
      {showNetworkToasts && <NetworkStatusToast />}
    </div>
  )
})

Layout.displayName = "Layout"

// Layout variants for common use cases
const AppLayout = React.forwardRef<HTMLDivElement, Omit<LayoutProps, 'headerProps' | 'footerProps'>>((props, ref) => (
  <Layout
    ref={ref}
    headerProps={{
      navItems: [
        { href: "/", label: "Dashboard" },
        { href: "/features", label: "Features" },
        { href: "/settings", label: "Settings" },
      ]
    }}
    footerProps={{
      showPwaFeatures: true,
      showNetworkStatus: true
    }}
    {...props}
  />
))

const MarketingLayout = React.forwardRef<HTMLDivElement, Omit<LayoutProps, 'headerProps' | 'footerProps'>>((props, ref) => (
  <Layout
    ref={ref}
    headerProps={{
      navItems: [
        { href: "/", label: "Home" },
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/docs", label: "Docs" },
        { href: "/blog", label: "Blog" },
        { href: "https://github.com", label: "GitHub", external: true },
      ]
    }}
    footerProps={{
      sections: [
        {
          title: "Product",
          links: [
            { href: "/features", label: "Features" },
            { href: "/pricing", label: "Pricing" },
            { href: "/docs", label: "Documentation" },
            { href: "/changelog", label: "Changelog" },
          ]
        },
        {
          title: "Company", 
          links: [
            { href: "/about", label: "About" },
            { href: "/blog", label: "Blog" },
            { href: "/careers", label: "Careers" },
            { href: "/contact", label: "Contact" },
          ]
        }
      ]
    }}
    installPromptVariant="floating"
    {...props}
  />
))

const DocsLayout = React.forwardRef<HTMLDivElement, Omit<LayoutProps, 'headerProps' | 'footerProps'>>((props, ref) => (
  <Layout
    ref={ref}
    headerProps={{
      navItems: [
        { href: "/docs", label: "Documentation" },
        { href: "/components", label: "Components" },
        { href: "/examples", label: "Examples" },
        { href: "/playground", label: "Playground" },
      ]
    }}
    footerProps={{
      showPwaFeatures: false,
      showNetworkStatus: false
    }}
    maxWidth="2xl"
    {...props}
  />
))

AppLayout.displayName = "AppLayout"
MarketingLayout.displayName = "MarketingLayout"
DocsLayout.displayName = "DocsLayout"

export { 
  Layout, 
  AppLayout, 
  MarketingLayout, 
  DocsLayout,
  type LayoutProps 
}
