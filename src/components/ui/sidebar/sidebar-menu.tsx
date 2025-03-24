
import {
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  ListChecks,
  Settings,
  User2,
  Calculator,
  LucideIcon,
  FileText
} from "lucide-react"

export interface SidebarNavItem {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: LucideIcon | React.ReactElement
  path?: string
  group?: "general" | "admin" | "operations"
}

export interface SidebarMenuSection {
  title?: string
  items: SidebarNavItem[]
}

export const SIDEBAR_MENU_SECTIONS: SidebarMenuSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        group: "general",
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        title: "Sites",
        icon: Building2,
        path: "/sites",
        group: "admin",
      },
      {
        title: "Clients",
        icon: User2,
        path: "/clients",
        group: "admin",
      },
      {
        title: "Settings",
        icon: Settings,
        path: "/settings",
        group: "admin",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Work Orders",
        icon: ListChecks,
        path: "/workorders",
        group: "operations",
      },
      {
        title: "Quoting Tool",
        icon: Calculator,
        path: "/quoting",
        group: "operations"
      },
      {
        title: "Award Calculator",
        icon: FileText,
        path: "/award-calculator",
        group: "operations"
      },
    ],
  },
]

export const DEFAULT_SIDEBAR_ITEMS: SidebarNavItem[] = SIDEBAR_MENU_SECTIONS.reduce<SidebarNavItem[]>(
  (acc, section) => {
    return [...acc, ...section.items]
  },
  []
)
