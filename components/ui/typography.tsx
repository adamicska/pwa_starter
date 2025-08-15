import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Heading Component
const headingVariants = cva(
  "font-semibold tracking-tight",
  {
    variants: {
      level: {
        h1: "text-3xl lg:text-4xl",
        h2: "text-2xl lg:text-3xl", 
        h3: "text-xl lg:text-2xl",
        h4: "text-lg lg:text-xl",
      },
      gradient: {
        true: "gradient-heading",
        false: "",
      }
    },
    defaultVariants: {
      level: "h1",
      gradient: false,
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h1", gradient = false, as, children, ...props }, ref) => {
    const Component = as || level || "h1"
    const headingLevel = level || as || "h1"
    
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ level: headingLevel, gradient, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Heading.displayName = "Heading"

// Paragraph Component  
const paragraphVariants = cva(
  "text-base leading-7",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        small: "text-sm text-muted-foreground",
        large: "text-lg text-foreground",
        lead: "text-xl text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(paragraphVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Paragraph.displayName = "Paragraph"

// Text Component for inline text
const textVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground", 
        destructive: "text-destructive",
        success: "text-success-600 dark:text-success-400",
        warning: "text-warning-600 dark:text-warning-400",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm", 
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "base",
      weight: "normal",
    },
  }
)

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  as?: "span" | "div" | "p"
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, size, weight, as = "span", ...props }, ref) => {
    const Component = as
    
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(textVariants({ variant, size, weight, className }))}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Heading, Paragraph, Text, headingVariants, paragraphVariants, textVariants }
