
// Main components
export { Sidebar } from "./sidebar"
export { SidebarProvider, useSidebar } from "./sidebar-context"
export { SidebarTrigger } from "./sidebar-trigger"
export { SidebarRail } from "./sidebar-rail"
export { SidebarInset } from "./sidebar-inset"
export { SidebarInput } from "./sidebar-input"

// Section components
export {
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
} from "./sidebar-sections"

// Group components
export {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar-group"

// Menu components
export { SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from "./sidebar-menu-components"
export {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
} from "./sidebar-menu-button"
export {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar-menu-sub"

// Export sidebar menu data
export { SIDEBAR_MENU_SECTIONS, DEFAULT_SIDEBAR_ITEMS } from "./sidebar-menu"
export type { SidebarNavItem, SidebarMenuSection } from "./sidebar-menu"

// Types
export type { SidebarContext } from "./types"
