
import * as React from "react"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "./sidebar-menu"
import { Badge } from "@/components/ui/badge"

export function SidebarMenu({ children, className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-col gap-1", className)}
      data-sidebar="menu"
      {...props}
    >
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("group/menu-item relative", className)}
      data-sidebar="menu-item"
      {...props}
    >
      {children}
    </li>
  )
}

export function SidebarMenuSkeleton() {
  return (
    <div className="flex flex-col gap-1 py-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-full animate-pulse rounded-md bg-sidebar-accent/50"
        />
      ))}
    </div>
  )
}

export function SidebarMenuItemContent({
  item,
  className,
  onClick,
}: {
  item: SidebarNavItem
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-sidebar-accent",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {typeof item.icon === 'function' ? React.createElement(item.icon, { className: "h-4 w-4" }) : item.icon}
        <span>{item.title}</span>
      </div>
      {item.disabled && (
        <Badge variant="secondary" className="ml-auto">
          Coming soon
        </Badge>
      )}
    </div>
  )
}
