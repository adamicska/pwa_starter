"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const radioVariants = cva(
  "aspect-square h-4 w-4 rounded-full border border-input text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        destructive: "data-[state=checked]:bg-destructive data-[state=checked]:border-destructive border-destructive focus-visible:ring-destructive",
        success: "data-[state=checked]:bg-success data-[state=checked]:border-success border-success focus-visible:ring-success",
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

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps extends VariantProps<typeof radioVariants> {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  name?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  orientation?: "horizontal" | "vertical"
  error?: string
  helperText?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    options,
    value,
    defaultValue,
    name,
    onValueChange,
    disabled,
    className,
    variant,
    size,
    orientation = "vertical",
    error,
    helperText,
    ...props
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
    const generatedName = React.useId()
    const groupName = name || generatedName

    // Handle controlled/uncontrolled state
    const currentValue = value !== undefined ? value : selectedValue

    const handleChange = (optionValue: string) => {
      if (value === undefined) {
        setSelectedValue(optionValue)
      }
      onValueChange?.(optionValue)
    }

    return (
      <div 
        ref={ref} 
        className={cn("space-y-2", className)} 
        role="radiogroup"
        {...props}
      >
        <div className={cn(
          orientation === "horizontal" 
            ? "flex flex-wrap gap-6" 
            : "flex flex-col space-y-3"
        )}>
          {options.map((option) => {
            const isSelected = currentValue === option.value
            const isDisabled = disabled || option.disabled
            const radioId = `${groupName}-${option.value}`

            return (
              <div key={option.value} className="flex items-start space-x-3">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    id={radioId}
                    name={groupName}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleChange(option.value)}
                    disabled={isDisabled}
                    className="sr-only"
                    aria-describedby={option.description ? `${radioId}-description` : undefined}
                  />
                  <div
                    className={cn(
                      radioVariants({ variant, size }),
                      isDisabled && "cursor-not-allowed opacity-50"
                    )}
                    data-state={isSelected ? "checked" : "unchecked"}
                  >
                    {isSelected && (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="w-2 h-2 bg-current rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor={radioId}
                    className={cn(
                      "text-sm font-medium leading-none cursor-pointer",
                      isDisabled && "cursor-not-allowed opacity-70"
                    )}
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p
                      id={`${radioId}-description`}
                      className="text-sm text-muted-foreground"
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = "RadioGroup"

export { RadioGroup, radioVariants }
