
import { VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "./sidebar-menu-button"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarVariant = "sidebar" | "floating" | "inset"
export type SidebarSide = "left" | "right"
export type SidebarCollapsible = "offcanvas" | "icon" | "none"

export type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<any>
} & VariantProps<typeof sidebarMenuButtonVariants>
