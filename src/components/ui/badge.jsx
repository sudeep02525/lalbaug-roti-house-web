import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none"
  
  const variants = {
    default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]",
    secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]",
    accent: "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
    outline: "text-[var(--foreground)] border-[var(--border)]",
  }

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />
}

export { Badge }
