import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",  // ~640px
        md: "max-w-screen-md",  // ~768px
        lg: "max-w-screen-lg",  // ~1024px
        xl: "max-w-screen-xl",  // ~1280px
        "2xl": "max-w-screen-2xl", // ~1536px
        full: "max-w-full",
        prose: "max-w-prose",    // ~65ch for reading
      },
      padding: {
        none: "",
        sm: "px-4",
        default: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "default",
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding }), className)}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground", 
        muted: "bg-muted text-muted-foreground",
        accent: "bg-accent text-accent-foreground",
      },
      padding: {
        none: "",
        sm: "py-8",
        default: "py-12 lg:py-16",
        lg: "py-16 lg:py-24",
        xl: "py-24 lg:py-32",
      },
      spacing: {
        normal: "",
        tight: "space-y-4",
        default: "space-y-6", 
        loose: "space-y-8",
        relaxed: "space-y-12",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      spacing: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
  containerProps?: ContainerProps
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    variant, 
    padding, 
    spacing, 
    as: Component = "section", 
    children,
    containerProps,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ variant, padding }), className)}
        {...props}
      >
        {containerProps !== null ? (
          <Container {...containerProps} className={cn(spacing && sectionVariants({ spacing }), containerProps?.className)}>
            {children}
          </Container>
        ) : (
          <div className={cn(spacing && sectionVariants({ spacing }))}>
            {children}
          </div>
        )}
      </Component>
    )
  }
)
Section.displayName = "Section"

export { Container, Section, containerVariants, sectionVariants }
