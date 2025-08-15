import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Input, type InputProps } from "./input"

export interface FormFieldProps extends Omit<InputProps, "id"> {
  label?: string
  id?: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label,
    id,
    required,
    error,
    helperText,
    className,
    labelClassName,
    inputClassName,
    ...inputProps
  }, ref) => {
    const generatedId = React.useId()
    const fieldId = id || generatedId
    const hasError = !!error
    const description = error || helperText

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            required={required}
            variant={hasError ? "error" : "default"}
            className={labelClassName}
          >
            {label}
          </Label>
        )}
        <Input
          id={fieldId}
          ref={ref}
          state={hasError ? "error" : "default"}
          className={inputClassName}
          aria-describedby={description ? `${fieldId}-description` : undefined}
          aria-invalid={hasError}
          {...inputProps}
        />
        {description && (
          <p
            id={`${fieldId}-description`}
            className={cn(
              "text-sm",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }
