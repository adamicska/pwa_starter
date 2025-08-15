"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const accordionVariants = cva(
  "border-b border-border",
  {
    variants: {
      variant: {
        default: "",
        card: "border rounded-md bg-card text-card-foreground shadow-sm",
        ghost: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
  {
    variants: {
      variant: {
        default: "",
        card: "px-4",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const accordionContentVariants = cva(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        default: "",
        card: "px-4",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AccordionItem {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
  defaultOpen?: boolean
}

export interface AccordionProps extends VariantProps<typeof accordionVariants> {
  items: AccordionItem[]
  type?: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  disabled?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({
    items,
    type = "single",
    collapsible = true,
    value,
    defaultValue,
    onValueChange,
    className,
    variant,
    disabled,
    ...props
  }, ref) => {
    // Initialize state based on type and defaultValue
    const getInitialValue = () => {
      if (value !== undefined) return value
      if (defaultValue !== undefined) return defaultValue
      
      if (type === "multiple") {
        const defaultOpenItems = items
          .filter(item => item.defaultOpen && !item.disabled)
          .map(item => item.id)
        return defaultOpenItems
      } else {
        const defaultOpenItem = items.find(item => item.defaultOpen && !item.disabled)
        return defaultOpenItem?.id || ""
      }
    }

    const [openItems, setOpenItems] = React.useState<string | string[]>(getInitialValue())

    // Handle controlled/uncontrolled state
    const currentValue = value !== undefined ? value : openItems

    const isItemOpen = (itemId: string): boolean => {
      if (type === "multiple") {
        return Array.isArray(currentValue) ? currentValue.includes(itemId) : false
      }
      return currentValue === itemId
    }

    const handleItemToggle = (itemId: string) => {
      if (disabled) return

      const item = items.find(i => i.id === itemId)
      if (item?.disabled) return

      let newValue: string | string[]

      if (type === "multiple") {
        const currentArray = Array.isArray(currentValue) ? currentValue : []
        if (currentArray.includes(itemId)) {
          newValue = currentArray.filter(id => id !== itemId)
        } else {
          newValue = [...currentArray, itemId]
        }
      } else {
        // Single mode
        if (currentValue === itemId && collapsible) {
          newValue = ""
        } else {
          newValue = itemId
        }
      }

      if (value === undefined) {
        setOpenItems(newValue)
      }
      onValueChange?.(newValue)
    }

    const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleItemToggle(itemId)
      }
    }

    return (
      <div 
        ref={ref} 
        className={cn("w-full", className)}
        {...props}
      >
        {items.map((item, index) => {
          const isOpen = isItemOpen(item.id)
          const isDisabled = disabled || item.disabled

          return (
            <div
              key={item.id}
              className={cn(
                accordionVariants({ variant }),
                variant === "card" && index < items.length - 1 && "mb-2"
              )}
            >
              <h3>
                <button
                  type="button"
                  className={cn(
                    accordionTriggerVariants({ variant }),
                    "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isDisabled && "opacity-50 cursor-not-allowed hover:no-underline"
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-content-${item.id}`}
                  id={`accordion-trigger-${item.id}`}
                  disabled={isDisabled}
                  onClick={() => handleItemToggle(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  data-state={isOpen ? "open" : "closed"}
                >
                  {item.trigger}
                  <ChevronDown 
                    className="h-4 w-4 shrink-0 transition-transform duration-200" 
                  />
                </button>
              </h3>
              <div
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
                className={cn(
                  accordionContentVariants({ variant }),
                  !isOpen && "hidden"
                )}
                data-state={isOpen ? "open" : "closed"}
              >
                <div className={cn(
                  "pb-4 pt-0",
                  variant === "card" && "pb-4"
                )}>
                  {item.content}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

Accordion.displayName = "Accordion"

export { Accordion, accordionVariants, accordionTriggerVariants, accordionContentVariants }
