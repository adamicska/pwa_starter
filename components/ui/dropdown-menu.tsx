"use client"

import * as React from "react"
import { ChevronRight, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const dropdownMenuVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
  {
    variants: {
      size: {
        sm: "min-w-[6rem] text-xs",
        default: "min-w-[8rem] text-sm",
        lg: "min-w-[12rem] text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const dropdownMenuItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        destructive: "text-destructive focus:bg-destructive focus:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface DropdownMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
  variant?: "default" | "destructive"
  shortcut?: string
  checked?: boolean
  children?: DropdownMenuItem[]
  onClick?: () => void
}

export interface DropdownMenuProps extends VariantProps<typeof dropdownMenuVariants> {
  items: DropdownMenuItem[]
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  disabled?: boolean
  className?: string
}

interface MenuPosition {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({
    items,
    trigger,
    open,
    onOpenChange,
    align = "start",
    side = "bottom",
    sideOffset = 4,
    disabled,
    className,
    size,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null)
    const [focusedItem, setFocusedItem] = React.useState<string | null>(null)
    const [menuPosition, setMenuPosition] = React.useState<MenuPosition>({})

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const submenuTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    // Handle controlled/uncontrolled state
    const currentOpen = open !== undefined ? open : isOpen

    const handleOpenChange = React.useCallback((newOpen: boolean) => {
      if (disabled) return
      
      if (open === undefined) {
        setIsOpen(newOpen)
      }
      onOpenChange?.(newOpen)

      if (!newOpen) {
        setActiveSubmenu(null)
        setFocusedItem(null)
      }
    }, [disabled, open, onOpenChange])

    // Calculate menu position with collision detection
    const calculatePosition = React.useCallback(() => {
      if (!triggerRef.current || !menuRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      const position: MenuPosition = {}

      // Calculate horizontal position
      if (side === "left" || side === "right") {
        if (side === "right") {
          position.left = triggerRect.right + sideOffset
          // Check if menu would overflow
          if (position.left + menuRect.width > viewport.width) {
            position.left = triggerRect.left - menuRect.width - sideOffset
          }
        } else {
          position.right = viewport.width - triggerRect.left + sideOffset
          if (position.right + menuRect.width > viewport.width) {
            position.left = triggerRect.right + sideOffset
            delete position.right
          }
        }

        // Vertical alignment for side placement
        if (align === "start") {
          position.top = triggerRect.top
        } else if (align === "end") {
          position.top = triggerRect.bottom - menuRect.height
        } else {
          position.top = triggerRect.top + (triggerRect.height - menuRect.height) / 2
        }
      } else {
        // Top or bottom placement
        if (align === "start") {
          position.left = triggerRect.left
        } else if (align === "end") {
          position.left = triggerRect.right - menuRect.width
        } else {
          position.left = triggerRect.left + (triggerRect.width - menuRect.width) / 2
        }

        // Check horizontal overflow
        if (position.left < 0) {
          position.left = 8
        } else if (position.left + menuRect.width > viewport.width) {
          position.left = viewport.width - menuRect.width - 8
        }

        // Vertical position
        if (side === "bottom") {
          position.top = triggerRect.bottom + sideOffset
          if (position.top + menuRect.height > viewport.height) {
            position.top = triggerRect.top - menuRect.height - sideOffset
          }
        } else {
          position.top = triggerRect.top - menuRect.height - sideOffset
          if (position.top < 0) {
            position.top = triggerRect.bottom + sideOffset
          }
        }
      }

      setMenuPosition(position)
    }, [side, align, sideOffset])

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!currentOpen) return

      const flatItems = items.filter(item => !item.disabled)
      const currentIndex = flatItems.findIndex(item => item.id === focusedItem)

      switch (event.key) {
        case "Escape":
          event.preventDefault()
          handleOpenChange(false)
          triggerRef.current?.focus()
          break

        case "ArrowDown":
          event.preventDefault()
          const nextIndex = currentIndex < flatItems.length - 1 ? currentIndex + 1 : 0
          setFocusedItem(flatItems[nextIndex]?.id || null)
          break

        case "ArrowUp":
          event.preventDefault()
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : flatItems.length - 1
          setFocusedItem(flatItems[prevIndex]?.id || null)
          break

        case "ArrowRight":
          event.preventDefault()
          const focusedItemData = flatItems.find(item => item.id === focusedItem)
          if (focusedItemData?.children?.length) {
            setActiveSubmenu(focusedItem)
          }
          break

        case "ArrowLeft":
          event.preventDefault()
          if (activeSubmenu) {
            setActiveSubmenu(null)
          }
          break

        case "Enter":
        case " ":
          event.preventDefault()
          const item = flatItems.find(item => item.id === focusedItem)
          if (item && !item.disabled) {
            if (item.children?.length) {
              setActiveSubmenu(item.id === activeSubmenu ? null : item.id)
            } else {
              item.onClick?.()
              handleOpenChange(false)
            }
          }
          break
      }
    }

    // Handle submenu hover
    const handleItemHover = (itemId: string) => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current)
      }

      const item = items.find(i => i.id === itemId)
      if (item?.children?.length) {
        submenuTimeoutRef.current = setTimeout(() => {
          setActiveSubmenu(itemId)
        }, 150)
      } else {
        submenuTimeoutRef.current = setTimeout(() => {
          setActiveSubmenu(null)
        }, 150)
      }
    }

    // Position calculation effect
    React.useEffect(() => {
      if (currentOpen) {
        const timer = setTimeout(() => calculatePosition(), 0)
        const handleResize = () => calculatePosition()
        window.addEventListener("resize", handleResize)
        return () => {
          clearTimeout(timer)
          window.removeEventListener("resize", handleResize)
        }
      }
    }, [currentOpen, calculatePosition])

    // Click outside to close
    React.useEffect(() => {
      if (!currentOpen) return

      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          triggerRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [currentOpen, handleOpenChange])

    const renderMenuItem = (item: DropdownMenuItem) => (
      <div
        key={item.id}
        className={cn(
          dropdownMenuItemVariants({ variant: item.variant }),
          focusedItem === item.id && "bg-accent text-accent-foreground",
          "group"
        )}
        data-disabled={item.disabled}
        onClick={(e) => {
          e.stopPropagation()
          if (item.disabled) return

          if (item.children?.length) {
            setActiveSubmenu(activeSubmenu === item.id ? null : item.id)
          } else {
            item.onClick?.()
            handleOpenChange(false)
          }
        }}
        onMouseEnter={() => !item.disabled && handleItemHover(item.id)}
        onFocus={() => setFocusedItem(item.id)}
        tabIndex={-1}
      >
        <div className="flex items-center gap-2 flex-1">
          {item.icon && (
            <span className="flex-shrink-0 w-4 h-4">
              {item.icon}
            </span>
          )}
          <div className="flex-1">
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground">{item.description}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.checked !== undefined && (
            <Check className={cn(
              "w-4 h-4",
              item.checked ? "opacity-100" : "opacity-0"
            )} />
          )}
          {item.shortcut && (
            <span className="text-xs text-muted-foreground">{item.shortcut}</span>
          )}
          {item.children?.length && (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </div>
    )

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => handleOpenChange(!currentOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-expanded={currentOpen}
          aria-haspopup="menu"
        >
          {trigger}
        </button>

        {currentOpen && (
          <>
            <div
              ref={menuRef}
              className={cn(
                dropdownMenuVariants({ size }),
                "fixed animate-in fade-in-0 zoom-in-95",
                side === "bottom" && "slide-in-from-top-2",
                side === "top" && "slide-in-from-bottom-2",
                side === "left" && "slide-in-from-right-2",
                side === "right" && "slide-in-from-left-2"
              )}
              style={menuPosition}
              role="menu"
              onKeyDown={handleKeyDown}
            >
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  {item.id === "separator" ? (
                    <div className="h-px bg-border my-1" role="separator" />
                  ) : (
                    renderMenuItem(item)
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Submenu */}
            {activeSubmenu && (
              <div className="fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                {items
                  .find(item => item.id === activeSubmenu)
                  ?.children?.map((item) => renderMenuItem(item))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }
)

DropdownMenu.displayName = "DropdownMenu"

export { DropdownMenu, dropdownMenuVariants, dropdownMenuItemVariants }
