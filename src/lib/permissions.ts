
/**
 * Permission constants for the application
 */

// System permissions
export const SYSTEM_ADMIN = "system.admin";
export const SYSTEM_USER_MANAGE = "system.users.manage";
export const SYSTEM_ROLES_MANAGE = "system.roles.manage";
export const SYSTEM_SETTINGS = "system.settings";

// Client permissions
export const CLIENTS_VIEW = "clients.view";
export const CLIENTS_CREATE = "clients.create";
export const CLIENTS_EDIT = "clients.edit";
export const CLIENTS_DELETE = "clients.delete";

// Site permissions
export const SITES_VIEW = "sites.view";
export const SITES_CREATE = "sites.create";
export const SITES_EDIT = "sites.edit";
export const SITES_DELETE = "sites.delete";

// Contract permissions
export const CONTRACTS_VIEW = "contracts.view";
export const CONTRACTS_CREATE = "contracts.create";
export const CONTRACTS_EDIT = "contracts.edit";
export const CONTRACTS_DELETE = "contracts.delete";

// Work order permissions
export const WORK_ORDERS_VIEW = "work_orders.view";
export const WORK_ORDERS_CREATE = "work_orders.create";
export const WORK_ORDERS_EDIT = "work_orders.edit";
export const WORK_ORDERS_DELETE = "work_orders.delete";
export const WORK_ORDERS_ASSIGN = "work_orders.assign";

// Invoice permissions
export const INVOICES_VIEW = "invoices.view";
export const INVOICES_CREATE = "invoices.create";
export const INVOICES_EDIT = "invoices.edit";
export const INVOICES_DELETE = "invoices.delete";
export const INVOICES_APPROVE = "invoices.approve";

// Reports permissions
export const REPORTS_VIEW = "reports.view";
export const REPORTS_CREATE = "reports.create";
export const REPORTS_EXPORT = "reports.export";

// Dashboard permissions
export const DASHBOARD_VIEW = "dashboard.view";
export const DASHBOARD_SALES = "dashboard.sales.view";
export const DASHBOARD_OPERATIONS = "dashboard.operations.view";
export const DASHBOARD_FINANCE = "dashboard.finance.view";

// Group permissions for common roles
export const adminPermissions = [
  SYSTEM_ADMIN,
  SYSTEM_USER_MANAGE,
  SYSTEM_ROLES_MANAGE,
  SYSTEM_SETTINGS,
  CLIENTS_VIEW,
  CLIENTS_CREATE,
  CLIENTS_EDIT,
  CLIENTS_DELETE,
  SITES_VIEW,
  SITES_CREATE,
  SITES_EDIT,
  SITES_DELETE,
  CONTRACTS_VIEW,
  CONTRACTS_CREATE,
  CONTRACTS_EDIT,
  CONTRACTS_DELETE,
  WORK_ORDERS_VIEW,
  WORK_ORDERS_CREATE,
  WORK_ORDERS_EDIT,
  WORK_ORDERS_DELETE,
  WORK_ORDERS_ASSIGN,
  INVOICES_VIEW,
  INVOICES_CREATE,
  INVOICES_EDIT,
  INVOICES_DELETE,
  INVOICES_APPROVE,
  REPORTS_VIEW,
  REPORTS_CREATE,
  REPORTS_EXPORT,
  DASHBOARD_VIEW,
  DASHBOARD_SALES,
  DASHBOARD_OPERATIONS,
  DASHBOARD_FINANCE
];

export const operationsManagerPermissions = [
  CLIENTS_VIEW,
  SITES_VIEW,
  SITES_CREATE,
  SITES_EDIT,
  CONTRACTS_VIEW,
  WORK_ORDERS_VIEW,
  WORK_ORDERS_CREATE,
  WORK_ORDERS_EDIT,
  WORK_ORDERS_ASSIGN,
  INVOICES_VIEW,
  INVOICES_CREATE,
  REPORTS_VIEW,
  REPORTS_EXPORT,
  DASHBOARD_VIEW,
  DASHBOARD_OPERATIONS
];

export const salesUserPermissions = [
  CLIENTS_VIEW,
  CLIENTS_CREATE,
  CLIENTS_EDIT,
  SITES_VIEW,
  SITES_CREATE,
  CONTRACTS_VIEW,
  CONTRACTS_CREATE,
  CONTRACTS_EDIT,
  DASHBOARD_VIEW,
  DASHBOARD_SALES
];

export const financeUserPermissions = [
  CLIENTS_VIEW,
  SITES_VIEW,
  CONTRACTS_VIEW,
  WORK_ORDERS_VIEW,
  INVOICES_VIEW,
  INVOICES_CREATE,
  INVOICES_EDIT,
  INVOICES_APPROVE,
  REPORTS_VIEW,
  REPORTS_CREATE,
  REPORTS_EXPORT,
  DASHBOARD_VIEW,
  DASHBOARD_FINANCE
];

export const standardUserPermissions = [
  CLIENTS_VIEW,
  SITES_VIEW,
  WORK_ORDERS_VIEW,
  DASHBOARD_VIEW
];

// Permission descriptions for UI
export const permissionDescriptions = {
  [SYSTEM_ADMIN]: "Full system administration access",
  [SYSTEM_USER_MANAGE]: "Manage system users",
  [SYSTEM_ROLES_MANAGE]: "Manage user roles and permissions",
  [SYSTEM_SETTINGS]: "Manage system settings",
  [CLIENTS_VIEW]: "View client information",
  [CLIENTS_CREATE]: "Create new clients",
  [CLIENTS_EDIT]: "Edit client information",
  [CLIENTS_DELETE]: "Delete clients",
  [SITES_VIEW]: "View site information",
  [SITES_CREATE]: "Create new sites",
  [SITES_EDIT]: "Edit site information",
  [SITES_DELETE]: "Delete sites",
  [CONTRACTS_VIEW]: "View contract information",
  [CONTRACTS_CREATE]: "Create new contracts",
  [CONTRACTS_EDIT]: "Edit contract information",
  [CONTRACTS_DELETE]: "Delete contracts",
  [WORK_ORDERS_VIEW]: "View work orders",
  [WORK_ORDERS_CREATE]: "Create new work orders",
  [WORK_ORDERS_EDIT]: "Edit work orders",
  [WORK_ORDERS_DELETE]: "Delete work orders",
  [WORK_ORDERS_ASSIGN]: "Assign work orders to staff or contractors",
  [INVOICES_VIEW]: "View invoices",
  [INVOICES_CREATE]: "Create new invoices",
  [INVOICES_EDIT]: "Edit invoices",
  [INVOICES_DELETE]: "Delete invoices",
  [INVOICES_APPROVE]: "Approve invoices for payment",
  [REPORTS_VIEW]: "View reports",
  [REPORTS_CREATE]: "Create new reports",
  [REPORTS_EXPORT]: "Export reports to external formats",
  [DASHBOARD_VIEW]: "View dashboards",
  [DASHBOARD_SALES]: "View sales dashboard",
  [DASHBOARD_OPERATIONS]: "View operations dashboard",
  [DASHBOARD_FINANCE]: "View finance dashboard"
};

// Group permission categories for the UI
export const permissionCategories = [
  {
    name: "System",
    permissions: [SYSTEM_ADMIN, SYSTEM_USER_MANAGE, SYSTEM_ROLES_MANAGE, SYSTEM_SETTINGS]
  },
  {
    name: "Clients",
    permissions: [CLIENTS_VIEW, CLIENTS_CREATE, CLIENTS_EDIT, CLIENTS_DELETE]
  },
  {
    name: "Sites",
    permissions: [SITES_VIEW, SITES_CREATE, SITES_EDIT, SITES_DELETE]
  },
  {
    name: "Contracts",
    permissions: [CONTRACTS_VIEW, CONTRACTS_CREATE, CONTRACTS_EDIT, CONTRACTS_DELETE]
  },
  {
    name: "Work Orders",
    permissions: [WORK_ORDERS_VIEW, WORK_ORDERS_CREATE, WORK_ORDERS_EDIT, WORK_ORDERS_DELETE, WORK_ORDERS_ASSIGN]
  },
  {
    name: "Invoices",
    permissions: [INVOICES_VIEW, INVOICES_CREATE, INVOICES_EDIT, INVOICES_DELETE, INVOICES_APPROVE]
  },
  {
    name: "Reports",
    permissions: [REPORTS_VIEW, REPORTS_CREATE, REPORTS_EXPORT]
  },
  {
    name: "Dashboards",
    permissions: [DASHBOARD_VIEW, DASHBOARD_SALES, DASHBOARD_OPERATIONS, DASHBOARD_FINANCE]
  }
];

// Helper function to check if a user has a specific permission
export function hasPermission(userPermissions: Record<string, boolean>, permission: string): boolean {
  return userPermissions?.[permission] === true || userPermissions?.[SYSTEM_ADMIN] === true;
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(userPermissions: Record<string, boolean>, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission));
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(userPermissions: Record<string, boolean>, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userPermissions, permission));
}
