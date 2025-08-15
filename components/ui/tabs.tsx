"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted p-1",
        pills: "bg-muted p-1", 
        underline: "border-b border-border",
        ghost: "",
      },
      orientation: {
        horizontal: "h-10 flex-row",
        vertical: "h-auto flex-col w-48",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "horizontal",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills: "rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground hover:text-foreground",
        ghost: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
      },
      orientation: {
        horizontal: "",
        vertical: "w-full justify-start",
      },
    },
    defaultVariants: {
      variant: "default", 
      orientation: "horizontal",
    },
  }
)

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps extends VariantProps<typeof tabsListVariants> {
  tabs: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    tabs,
    value,
    defaultValue,
    onValueChange,
    className,
    variant,
    orientation,
    disabled,
    ...props 
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(
      value || defaultValue || tabs[0]?.value || ""
    )

    // Handle controlled/uncontrolled state
    const currentValue = value !== undefined ? value : selectedValue

    const handleTabChange = (tabValue: string) => {
      if (value === undefined) {
        setSelectedValue(tabValue)
      }
      onValueChange?.(tabValue)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex(tab => tab.value === currentValue)
      let nextIndex = currentIndex

      if (orientation === "horizontal") {
        if (event.key === "ArrowLeft") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
          event.preventDefault()
        } else if (event.key === "ArrowRight") {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
          event.preventDefault()
        }
      } else {
        if (event.key === "ArrowUp") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
          event.preventDefault()
        } else if (event.key === "ArrowDown") {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
          event.preventDefault()
        }
      }

      if (event.key === "Home") {
        nextIndex = 0
        event.preventDefault()
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1
        event.preventDefault()
      }

      if (nextIndex !== currentIndex) {
        const nextTab = tabs[nextIndex]
        if (nextTab && !nextTab.disabled) {
          handleTabChange(nextTab.value)
          // Focus the newly selected tab
          const tabElement = document.querySelector(`[data-tab-value="${nextTab.value}"]`) as HTMLButtonElement
          tabElement?.focus()
        }
      }
    }

    return (
      <div 
        ref={ref} 
        className={cn("w-full", className)}
        {...props}
      >
        <div 
          className={cn(tabsListVariants({ variant, orientation }))}
          role="tablist"
          aria-orientation={orientation || "horizontal"}
        >
          {tabs.map((tab) => {
            const isActive = currentValue === tab.value
            const isDisabled = disabled || tab.disabled

            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                data-tab-value={tab.value}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.value}`}
                id={`tab-${tab.value}`}
                disabled={isDisabled}
                className={cn(
                  tabsTriggerVariants({ variant, orientation }),
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                data-state={isActive ? "active" : "inactive"}
                onClick={() => !isDisabled && handleTabChange(tab.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                tabIndex={isActive ? 0 : -1}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.badge && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tabs.map((tab) => {
            const isActive = currentValue === tab.value

            return (
              <div
                key={tab.value}
                role="tabpanel"
                id={`tabpanel-${tab.value}`}
                aria-labelledby={`tab-${tab.value}`}
                hidden={!isActive}
                className={cn(
                  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  !isActive && "sr-only"
                )}
                tabIndex={0}
              >
                {tab.content}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

Tabs.displayName = "Tabs"

export { Tabs, tabsListVariants, tabsTriggerVariants }
