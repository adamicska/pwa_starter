"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-2",
        default: "h-3", 
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success-600 dark:bg-success-400",
        warning: "bg-warning-600 dark:bg-warning-400", 
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {
  showPercentage?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, showPercentage = false, ...props }, ref) => (
  <div className="relative">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showPercentage && (
      <div className="mt-1 flex justify-between text-sm text-muted-foreground">
        <span>{Math.round(value || 0)}%</span>
        <span>100%</span>
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular Progress component
const CircularProgress = React.forwardRef<
  SVGSVGElement,
  {
    value?: number
    size?: number
    strokeWidth?: number
    className?: string
    variant?: "default" | "success" | "warning" | "destructive"
    showPercentage?: boolean
  }
>(({ 
  value = 0, 
  size = 40, 
  strokeWidth = 4, 
  className,
  variant = "default",
  showPercentage = false,
  ...props 
}, ref) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  const variantColors = {
    default: "stroke-primary",
    success: "stroke-success-600 dark:stroke-success-400",
    warning: "stroke-warning-600 dark:stroke-warning-400",
    destructive: "stroke-destructive",
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        ref={ref}
        width={size}
        height={size}
        className={cn("transform -rotate-90", className)}
        {...props}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-in-out", variantColors[variant])}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-foreground">
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  )
})
CircularProgress.displayName = "CircularProgress"

// Indeterminate Progress (for unknown loading times)
const IndeterminateProgress = React.forwardRef<
  HTMLDivElement,
  {
    size?: "sm" | "default" | "lg"
    variant?: "default" | "success" | "warning" | "destructive"
    className?: string
  }
>(({ size = "default", variant = "default", className }, ref) => {
  const sizeClasses = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-success-600 dark:bg-success-400",
    warning: "bg-warning-600 dark:bg-warning-400", 
    destructive: "bg-destructive",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-full bg-secondary",
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full animate-[indeterminate_1.5s_infinite_linear] rounded-full",
          variantClasses[variant]
        )}
        style={{
          background: `linear-gradient(90deg, transparent, currentColor, transparent)`,
          animation: "indeterminate 1.5s infinite linear"
        }}
      />
    </div>
  )
})
IndeterminateProgress.displayName = "IndeterminateProgress"

export { Progress, CircularProgress, IndeterminateProgress, progressVariants }
