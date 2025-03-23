
export type Permission = {
  id: PermissionId;
  label: string;
  description: string;
  category: 'data' | 'management' | 'admin';
};

export type PermissionId = 
  | 'data_admin'
  | 'places'
  | 'products'
  | 'files'
  | 'pricelists'
  | 'forms'
  | 'schedule'
  | 'statuses'
  | 'audits'
  | 'tags'
  | 'app_settings'
  | 'data_analysis'
  | 'exports'
  | 'public_link'
  | 'manage_org'
  | 'representatives'
  | 'home_address'
  | 'admins'
  | 'territories'
  | 'company_info'
  | 'third_party';

export type PermissionsMap = {
  [key in PermissionId]: boolean;
};

export const PERMISSIONS: Permission[] = [
  {
    id: 'data_admin',
    label: 'Data Administration',
    description: 'Full access to create, edit, and delete data across the system.',
    category: 'data'
  },
  {
    id: 'places',
    label: 'Places',
    description: 'Manage locations, sites, and related geographic data.',
    category: 'data'
  },
  {
    id: 'products',
    label: 'Products',
    description: 'View and manage product catalog and inventory.',
    category: 'data'
  },
  {
    id: 'files',
    label: 'Files',
    description: 'Upload, download, and manage system files and documents.',
    category: 'data'
  },
  {
    id: 'pricelists',
    label: 'Pricelists',
    description: 'Create and manage product pricing and price lists.',
    category: 'data'
  },
  {
    id: 'forms',
    label: 'Forms',
    description: 'Create, edit, and manage custom forms and templates.',
    category: 'data'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    description: 'View and manage calendars and scheduling.',
    category: 'data'
  },
  {
    id: 'statuses',
    label: 'Statuses',
    description: 'Configure and manage status workflows for various entities.',
    category: 'data'
  },
  {
    id: 'audits',
    label: 'Audits',
    description: 'View and manage audit logs and system changes.',
    category: 'data'
  },
  {
    id: 'tags',
    label: 'Tags',
    description: 'Create and manage tags for categorizing data.',
    category: 'data'
  },
  {
    id: 'app_settings',
    label: 'Application settings',
    description: 'Configure system-wide settings and preferences.',
    category: 'admin'
  },
  {
    id: 'data_analysis',
    label: 'Data analysis',
    description: 'Access to analytics, reports, and business intelligence.',
    category: 'management'
  },
  {
    id: 'exports',
    label: 'Exports',
    description: 'Export data from the system in various formats.',
    category: 'management'
  },
  {
    id: 'public_link',
    label: 'Public link',
    description: 'Create and manage public-facing links and pages.',
    category: 'management'
  },
  {
    id: 'manage_org',
    label: 'Manage Organization',
    description: 'Configure organization-wide settings and structure.',
    category: 'admin'
  },
  {
    id: 'representatives',
    label: 'Representatives',
    description: 'Manage sales reps and their territories.',
    category: 'management'
  },
  {
    id: 'home_address',
    label: 'Home address',
    description: 'Access and modify home address information for users.',
    category: 'admin'
  },
  {
    id: 'admins',
    label: 'Admins',
    description: 'Manage administrator accounts and permissions.',
    category: 'admin'
  },
  {
    id: 'territories',
    label: 'Territories',
    description: 'Define and manage geographic territories and assignments.',
    category: 'management'
  },
  {
    id: 'company_info',
    label: 'Company info',
    description: 'View and update company information and branding.',
    category: 'admin'
  },
  {
    id: 'third_party',
    label: '3rd party users',
    description: 'Manage external users and third-party access.',
    category: 'admin'
  }
];

// Helper function to get permissions by category
export const getPermissionsByCategory = (category: 'data' | 'management' | 'admin'): Permission[] => {
  return PERMISSIONS.filter(permission => permission.category === category);
};
