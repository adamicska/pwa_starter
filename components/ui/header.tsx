"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, Zap } from "lucide-react"

interface NavItem {
  href: string
  label: string
  external?: boolean
}

interface HeaderProps {
  className?: string
  logo?: React.ReactNode
  navItems?: NavItem[]
  showThemeToggle?: boolean
  sticky?: boolean
}

const defaultNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Documentation" },
  { href: "/examples", label: "Examples" },
  { href: "https://github.com", label: "GitHub", external: true },
]

const Header = React.forwardRef<HTMLElement, HeaderProps>(({
  className,
  logo,
  navItems = defaultNavItems,
  showThemeToggle = true,
  sticky = true,
  ...props
}, ref) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      ref={ref}
      className={cn(
        "w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60",
        sticky && "sticky top-0 z-50",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              {logo || (
                <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-semibold">PWA Boilerplate</span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <React.Fragment key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {showThemeToggle && <ThemeToggle />}
            <Button size="sm" className="ml-2">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {showThemeToggle && <ThemeToggle />}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex flex-col space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <React.Fragment key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              <div className="pt-4 border-t">
                <Button size="sm" className="w-full" onClick={closeMobileMenu}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
})

Header.displayName = "Header"

export { Header, type HeaderProps, type NavItem }
