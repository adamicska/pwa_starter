import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent shadow-none",
        filled: "bg-surface-100 border-transparent dark:bg-surface-800",
      },
      textareaSize: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "default",
      state: "default",
      resize: "vertical",
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  error?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    textareaSize, 
    state, 
    resize,
    error,
    ...props
  }, ref) => {
    const textareaState = error ? "error" : state

    return (
      <textarea
        className={cn(
          textareaVariants({ 
            variant, 
            textareaSize, 
            state: textareaState, 
            resize 
          }), 
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
