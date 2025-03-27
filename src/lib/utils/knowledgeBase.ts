
/**
 * Knowledge Base
 * 
 * This file serves as a central repository for documenting type mappings,
 * API conventions, and other important application-wide knowledge.
 */

// Type mappings between frontend and backend
export const typeMapping = {
  // Site status mapping
  siteStatus: {
    frontend: ['active', 'pending', 'inactive', 'on-hold', 'lost'],
    database: ['active', 'pending', 'inactive', 'on-hold', 'lost']
  },
  
  // User status mapping
  userStatus: {
    frontend: ['active', 'pending', 'inactive'],
    database: ['active', 'pending', 'inactive']
  },
  
  // Quote status mapping
  quoteStatus: {
    frontend: ['draft', 'pending', 'sent', 'approved', 'accepted', 'rejected', 'expired'],
    database: ['draft', 'pending', 'sent', 'approved', 'accepted', 'rejected', 'expired']
  },
  
  // Employment type mapping
  employmentType: {
    frontend: ['full_time', 'part_time', 'casual'],
    database: ['full_time', 'part_time', 'casual']
  },
  
  // Employee level mapping
  employeeLevel: {
    frontend: [1, 2, 3, 4, 5],
    database: [1, 2, 3, 4, 5]
  }
};

// Field name mappings between frontend and backend
export const fieldMapping = {
  // Sites
  sites: {
    database: {
      'postcode': 'postcode',
      'client_id': 'client_id',
      'contract_details': 'contract_details'
    },
    frontend: {
      'postalCode': 'postcode',
      'clientId': 'client_id',
      'contractDetails': 'contract_details'
    }
  },
  
  // Users
  users: {
    database: {
      'full_name': 'full_name',
      'first_name': 'first_name',
      'last_name': 'last_name',
      'role_id': 'role_id',
      'daily_summary': 'daily_summary'
    },
    frontend: {
      'fullName': 'full_name',
      'firstName': 'first_name',
      'lastName': 'last_name',
      'roleId': 'role_id',
      'dailySummary': 'daily_summary'
    }
  },
  
  // Quotes
  quotes: {
    database: {
      'user_id': 'user_id',
      'overhead_profile': 'overhead_profile',
      'created_by': 'created_by'
    },
    frontend: {
      'userId': 'user_id',
      'overheadProfile': 'overhead_profile',
      'createdBy': 'created_by'
    }
  }
};

// API endpoint paths for reference
export const apiEndpoints = {
  sites: '/sites',
  clients: '/clients',
  users: '/users',
  quotes: '/quotes',
  contractors: '/contractors'
};

// Common validation functions
export const validation = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  // Validate phone number format (basic)
  isValidPhone: (phone: string): boolean => {
    return /^\+?[0-9\s\-()]{8,20}$/.test(phone);
  },
  
  // Validate postcode format for Australia
  isValidAustralianPostcode: (postcode: string): boolean => {
    return /^\d{4}$/.test(postcode);
  }
};

// This knowledge base can be expanded as the application grows
