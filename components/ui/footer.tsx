"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { NetworkStatus } from "../pwa/network-status"
import { InstallPrompt } from "../pwa/install-prompt"
import { Github, Twitter, Linkedin, Mail, Zap, Heart, ExternalLink } from "lucide-react"

interface SocialLink {
  href: string
  icon: React.ReactNode
  label: string
  external?: boolean
}

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  className?: string
  companyName?: string
  description?: string
  sections?: FooterSection[]
  socialLinks?: SocialLink[]
  showPwaFeatures?: boolean
  showNetworkStatus?: boolean
  copyright?: string
}

const defaultSections: FooterSection[] = [
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
  },
  {
    title: "Resources",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/status", label: "Status", external: true },
    ]
  },
]

const defaultSocialLinks: SocialLink[] = [
  {
    href: "https://github.com",
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    external: true
  },
  {
    href: "https://twitter.com",
    icon: <Twitter className="w-5 h-5" />,
    label: "Twitter",
    external: true
  },
  {
    href: "https://linkedin.com",
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    external: true
  },
  {
    href: "mailto:hello@example.com",
    icon: <Mail className="w-5 h-5" />,
    label: "Email"
  },
]

const Footer = React.forwardRef<HTMLElement, FooterProps>(({
  className,
  companyName = "PWA Boilerplate",
  description = "A modern Progressive Web App boilerplate built with Next.js, TypeScript, and Tailwind CSS.",
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  showPwaFeatures = true,
  showNetworkStatus = true,
  copyright,
  ...props
}, ref) => {
  const currentYear = new Date().getFullYear()
  const copyrightText = copyright || `© ${currentYear} ${companyName}. All rights reserved.`

  return (
    <footer
      ref={ref}
      className={cn(
        "border-t bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {description}
            </p>
            
            {/* PWA Features */}
            {showPwaFeatures && (
              <div className="space-y-3">
                <InstallPrompt variant="card" className="max-w-xs" />
                {showNetworkStatus && (
                  <NetworkStatus variant="detailed" showSpeed className="max-w-xs" />
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <React.Fragment key={social.href}>
                  {social.external ? (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      {social.icon}
                    </a>
                  ) : (
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      {social.icon}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-4">
              <h4 className="font-semibold text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / CTA */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-semibold text-sm">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Get the latest updates and news about new features.
            </p>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Button size="sm" className="px-4">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {copyrightText}
              </p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>using Next.js</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-xs text-muted-foreground">
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = "Footer"

export { Footer, type FooterProps, type FooterSection, type FooterLink, type SocialLink }
