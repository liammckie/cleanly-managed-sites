
import { PermissionId } from '@/types/permissions';

// Permission definitions
export const PERMISSIONS: Record<PermissionId, {
  label: string;
  description: string;
}> = {
  data_admin: {
    label: 'Data Administration',
    description: 'Full access to create, edit, and delete data across the system.'
  },
  places: {
    label: 'Places',
    description: 'Manage locations, sites, and related geographic data.'
  },
  products: {
    label: 'Products',
    description: 'View and manage product catalog and inventory.'
  },
  files: {
    label: 'Files',
    description: 'Upload, download, and manage system files and documents.'
  },
  pricelists: {
    label: 'Pricelists',
    description: 'Create and manage product pricing and price lists.'
  },
  forms: {
    label: 'Forms',
    description: 'Create, edit, and manage custom forms and templates.'
  },
  schedule: {
    label: 'Schedule',
    description: 'View and manage calendars and scheduling.'
  },
  statuses: {
    label: 'Statuses',
    description: 'Configure and manage status workflows for various entities.'
  },
  audits: {
    label: 'Audits',
    description: 'View and manage audit logs and system changes.'
  },
  tags: {
    label: 'Tags',
    description: 'Create and manage tags for categorizing data.'
  },
  app_settings: {
    label: 'Application settings',
    description: 'Configure system-wide settings and preferences.'
  },
  data_analysis: {
    label: 'Data analysis',
    description: 'Access to analytics, reports, and business intelligence.'
  },
  exports: {
    label: 'Exports',
    description: 'Export data from the system in various formats.'
  },
  public_link: {
    label: 'Public link',
    description: 'Create and manage public-facing links and pages.'
  },
  manage_org: {
    label: 'Manage Organization',
    description: 'Configure organization-wide settings and structure.'
  },
  representatives: {
    label: 'Representatives',
    description: 'Manage sales reps and their territories.'
  },
  home_address: {
    label: 'Home address',
    description: 'Access and modify home address information for users.'
  },
  admins: {
    label: 'Admins',
    description: 'Manage administrator accounts and permissions.'
  },
  territories: {
    label: 'Territories',
    description: 'Define and manage geographic territories and assignments.'
  },
  company_info: {
    label: 'Company info',
    description: 'View and update company information and branding.'
  },
  third_party: {
    label: 'Third party users',
    description: 'Manage external users and third-party access.'
  }
};

// Group permissions by category
export const PERMISSION_GROUPS = {
  data: {
    label: 'Data Management',
    permissions: ['data_admin', 'places', 'products', 'files', 'pricelists', 'forms', 'schedule', 'statuses', 'audits', 'tags']
  },
  management: {
    label: 'Business Management',
    permissions: ['data_analysis', 'exports', 'public_link', 'representatives', 'territories']
  },
  admin: {
    label: 'Administration',
    permissions: ['app_settings', 'manage_org', 'home_address', 'admins', 'company_info', 'third_party']
  }
};
