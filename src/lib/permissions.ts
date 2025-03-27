
// Define permission categories for UI organization
export const permissionCategories = [
  {
    name: 'General',
    permissions: ['view_dashboard', 'manage_settings']
  },
  {
    name: 'Clients',
    permissions: ['view_clients', 'create_clients', 'edit_clients', 'delete_clients']
  },
  {
    name: 'Sites',
    permissions: ['view_sites', 'create_sites', 'edit_sites', 'delete_sites']
  },
  {
    name: 'Work Orders',
    permissions: ['view_work_orders', 'create_work_orders', 'edit_work_orders', 'delete_work_orders']
  },
  {
    name: 'Contractors',
    permissions: ['view_contractors', 'create_contractors', 'edit_contractors', 'delete_contractors']
  },
  {
    name: 'Users',
    permissions: ['view_users', 'create_users', 'edit_users', 'delete_users', 'manage_users']
  },
  {
    name: 'Finance',
    permissions: ['view_invoices', 'create_invoices', 'edit_invoices', 'delete_invoices', 'approve_payments']
  }
];

// Flatten permissions array for checking permission existence
export const allPermissions = permissionCategories.flatMap(category => category.permissions);

// Define descriptions for each permission
export const permissionDescriptions: Record<string, string> = {
  // General
  'view_dashboard': 'Access to view the main dashboard and analytics',
  'manage_settings': 'Configure system-wide settings',
  
  // Clients
  'view_clients': 'View client information and details',
  'create_clients': 'Create new client records',
  'edit_clients': 'Modify existing client information',
  'delete_clients': 'Remove client records from the system',
  
  // Sites
  'view_sites': 'View information about client sites',
  'create_sites': 'Create new site records',
  'edit_sites': 'Modify existing site information',
  'delete_sites': 'Remove site records from the system',
  
  // Work Orders
  'view_work_orders': 'View work orders and their details',
  'create_work_orders': 'Create new work orders',
  'edit_work_orders': 'Modify existing work orders',
  'delete_work_orders': 'Remove work orders from the system',
  
  // Contractors
  'view_contractors': 'View contractor information',
  'create_contractors': 'Create new contractor records',
  'edit_contractors': 'Modify existing contractor information',
  'delete_contractors': 'Remove contractor records from the system',
  
  // Users
  'view_users': 'View user accounts',
  'create_users': 'Create new user accounts',
  'edit_users': 'Modify existing user information',
  'delete_users': 'Remove user accounts',
  'manage_users': 'Manage user roles and permissions',
  
  // Finance
  'view_invoices': 'View invoice information',
  'create_invoices': 'Create new invoices',
  'edit_invoices': 'Modify existing invoices',
  'delete_invoices': 'Remove invoices from the system',
  'approve_payments': 'Approve payments and financial transactions'
};

// Helper function to check if a user has a specific permission
export function hasPermission(userPermissions: Record<string, boolean>, permission: string): boolean {
  return Boolean(userPermissions && userPermissions[permission]);
}

// Helper function to check if a user has any permission in a list
export function hasAnyPermission(userPermissions: Record<string, boolean>, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission));
}
