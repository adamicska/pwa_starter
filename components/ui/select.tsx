"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent shadow-none",
        filled: "bg-surface-100 border-transparent dark:bg-surface-800",
      },
      selectSize: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus:ring-destructive",
        success: "border-success focus:ring-success",
      },
    },
    defaultVariants: {
      variant: "default",
      selectSize: "default",
      state: "default",
    },
  }
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  error?: string
  helperText?: string
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({
    options,
    value,
    defaultValue,
    placeholder = "Select an option...",
    onValueChange,
    disabled,
    className,
    variant,
    selectSize,
    state,
    error,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find(option => option.value === selectedValue)
    const selectState = error ? "error" : state

    // Handle controlled/uncontrolled state
    const currentValue = value !== undefined ? value : selectedValue
    
    const handleSelect = (optionValue: string) => {
      if (value === undefined) {
        setSelectedValue(optionValue)
      }
      onValueChange?.(optionValue)
      setIsOpen(false)
    }

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={ref}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={cn(
            selectTriggerVariants({ variant, selectSize, state: selectState }),
            className
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...props}
        >
          <span className={cn(
            "block truncate",
            !selectedOption && "text-muted-foreground"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
            <ul role="listbox" className="py-1">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      option.disabled && "opacity-50 cursor-not-allowed",
                      currentValue === option.value && "bg-accent text-accent-foreground"
                    )}
                    role="option"
                    aria-selected={currentValue === option.value}
                  >
                    <span className="block truncate">{option.label}</span>
                    {currentValue === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select, selectTriggerVariants }
