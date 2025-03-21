import React from "react"
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  File,
  Calendar,
  Building2,
  Cable
} from "lucide-react"

import { SidebarClose } from "@/components/ui/sidebar/sidebar-close"
import { SidebarFooter } from "@/components/ui/sidebar/sidebar-footer"
import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header"
import { SidebarItem } from "@/components/ui/sidebar/sidebar-item"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarNav } from "@/components/ui/sidebar/sidebar-nav"
import { SidebarRail } from "@/components/ui/sidebar/sidebar-rail"
import { SidebarSection } from "@/components/ui/sidebar/sidebar-section"
import { SidebarSections } from "@/components/ui/sidebar/sidebar-sections"
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar-trigger"

export function Sidebar() {
  return (
    <SidebarRail>
      <SidebarTrigger />
      
      <SidebarSections>
        <SidebarSection>
          <SidebarHeader>
            CRM
          </SidebarHeader>
          <SidebarNav>
            <SidebarItem to="/settings" icon={Settings}>Settings</SidebarItem>
          </SidebarNav>
        </SidebarSection>
        
        <SidebarMenu>
          <SidebarItem to="/dashboard" icon={Home}>Dashboard</SidebarItem>
          <SidebarItem to="/clients" icon={Users}>Clients</SidebarItem>
          <SidebarItem to="/sites" icon={Building2}>Sites</SidebarItem>
          <SidebarItem to="/integrations" icon={Cable}>Integrations</SidebarItem>
        </SidebarMenu>
        
        <SidebarSection>
          <SidebarHeader>
            More
          </SidebarHeader>
          <SidebarNav>
            <SidebarItem to="/documents" icon={File}>Documents</SidebarItem>
            <SidebarItem to="/calendar" icon={Calendar}>Calendar</SidebarItem>
          </SidebarNav>
        </SidebarSection>
      </SidebarSections>
    </SidebarRail>
  );
}
