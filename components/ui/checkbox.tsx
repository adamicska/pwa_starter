"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        destructive: "data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground border-destructive focus-visible:ring-destructive",
        success: "data-[state=checked]:bg-success data-[state=checked]:text-success-foreground border-success focus-visible:ring-success",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4", 
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean
  label?: string
  description?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    variant, 
    size, 
    indeterminate = false,
    label,
    description,
    error,
    id,
    ...props 
  }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || props.defaultChecked || false)
    const checkboxRef = React.useRef<HTMLInputElement>(null)
    const generatedId = React.useId()
    const fieldId = id || generatedId

    // Handle controlled/uncontrolled state
    const isControlled = props.checked !== undefined
    const currentChecked = isControlled ? props.checked : checked

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setChecked(e.target.checked)
      }
      props.onChange?.(e)
    }

    const getState = () => {
      if (indeterminate) return "indeterminate"
      if (currentChecked) return "checked"
      return "unchecked"
    }

    const getIcon = () => {
      if (indeterminate) return <Minus className="h-3 w-3" />
      if (currentChecked) return <Check className="h-3 w-3" />
      return null
    }

    const checkboxElement = (
      <div className="relative">
        <input
          ref={(node) => {
            checkboxRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          type="checkbox"
          id={fieldId}
          className="sr-only"
          onChange={handleChange}
          aria-describedby={description || error ? `${fieldId}-description` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        <div
          className={cn(
            checkboxVariants({ variant, size }),
            className
          )}
          data-state={getState()}
        >
          {getIcon()}
        </div>
      </div>
    )

    if (label || description || error) {
      return (
        <div className="flex items-start space-x-3">
          {checkboxElement}
          <div className="space-y-1 leading-none">
            {label && (
              <label
                htmlFor={fieldId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {label}
              </label>
            )}
            {(description || error) && (
              <p
                id={`${fieldId}-description`}
                className={cn(
                  "text-sm",
                  error ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {error || description}
              </p>
            )}
          </div>
        </div>
      )
    }

    return checkboxElement
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
