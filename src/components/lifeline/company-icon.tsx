import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export type CompanyIconId = string

export interface CompanyIconEntry {
  icon: ComponentType<{ className?: string }>
  /** Tailwind size for the mark — wordmarks want a wide box. */
  sizeClassName?: string
}

const registry: Record<string, CompanyIconEntry> = {}

/**
 * Map your organization ids to icon components. Call once at module
 * scope, from a module that loads before the timeline renders:
 *
 *   registerCompanyIcons({
 *     acme: { icon: AcmeIcon, sizeClassName: "h-4 w-4" },
 *   })
 *
 */
export function registerCompanyIcons(
  entries: Record<string, CompanyIconEntry>,
) {
  Object.assign(registry, entries)
}

export function getCompanyIcon(id: CompanyIconId) {
  return registry[id]
}

export function CompanyIcon({
  entry,
  label,
  className,
}: {
  entry: CompanyIconEntry
  label: string
  className?: string
}) {
  const Icon = entry.icon
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-black transition-colors duration-300 dark:text-white",
        entry.sizeClassName ?? "h-4 w-4",
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="h-full w-full" />
    </span>
  )
}
