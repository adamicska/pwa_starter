export { cn } from "./cn"

/**
 * Format a date using date-fns
 */
export { format, formatDistance, formatRelative } from "date-fns"

/**
 * Lodash utilities
 */
export { 
  debounce, 
  throttle, 
  isEqual, 
  omit, 
  pick, 
  merge, 
  cloneDeep 
} from "lodash"

/**
 * Utility to generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Utility to format file sizes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Utility to truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}
