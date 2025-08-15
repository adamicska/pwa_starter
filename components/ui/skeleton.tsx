import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
        pulse: "animate-pulse bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Convenient skeleton patterns for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'className'> & {
    lines?: number
    className?: string
  }
>(({ lines = 1, className, ...props }, ref) => {
  if (lines === 1) {
    return (
      <Skeleton
        ref={ref}
        className={cn("h-4 w-full", className)}
        {...props}
      />
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full", // Last line is shorter
            className
          )}
          {...props}
        />
      ))}
    </div>
  )
})
SkeletonText.displayName = "SkeletonText"

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'className'> & {
    size?: "sm" | "default" | "lg"
    className?: string
  }
>(({ size = "default", className, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  return (
    <Skeleton
      ref={ref}
      className={cn("rounded-full", sizeClasses[size], className)}
      {...props}
    />
  )
})
SkeletonAvatar.displayName = "SkeletonAvatar"

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'className'> & {
    size?: "sm" | "default" | "lg"
    className?: string
  }
>(({ size = "default", className, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-9 w-20",
    default: "h-10 w-24",
    lg: "h-11 w-28"
  }

  return (
    <Skeleton
      ref={ref}
      className={cn("rounded-md", sizeClasses[size], className)}
      {...props}
    />
  )
})
SkeletonButton.displayName = "SkeletonButton"

const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'className'> & {
    className?: string
  }
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-3 p-6 rounded-lg border", className)} {...props}>
      <div className="space-y-2">
        <SkeletonText lines={1} className="h-6 w-1/3" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex space-x-2">
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </div>
    </div>
  )
})
SkeletonCard.displayName = "SkeletonCard"

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard,
  skeletonVariants 
}
