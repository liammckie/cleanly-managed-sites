
# Project Knowledge Base

## Project Overview

This is a business management application focused on cleaning service management. It helps users manage their clients, sites, contractors, quotes, and other business aspects. The application uses a modern tech stack and implements various business logic features.

## Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with Shadcn/UI components
- **State Management**: React Query for server state
- **Backend**: Supabase for database, authentication, and storage
- **Other Libraries**: 
  - Lucide React for icons
  - React Hook Form for form management
  - Zod for validation

## Recent Progress Updates

- **Fixed TypeScript Errors**: Resolved type issues in UserRoles, ImportExport hooks, and API functions
- **Improved Data Import/Export**: Enhanced CSV parsing to handle File objects
- **Refactored Site APIs**: Organized site-related API functions for better maintainability
- **Enhanced User Role Management**: Fixed user count tracking and permission handling

## Key Domain Concepts

### 1. Clients

Clients represent the businesses that hire our services. They have:
- Basic information (name, contact details)
- Multiple sites
- Contacts
- Status (active, inactive, prospect)
- Custom IDs for external reference

### 2. Sites

Sites are physical locations where services are performed. They include:
- Location information
- Client association
- Contract details
- Security information
- Job specifications
- Billing details
- Contacts

### 3. Contractors

Contractors are external service providers who may perform work at sites:
- Business and contact information
- Specialties and rates
- Document management
- Version history tracking

### 4. Contacts

Contacts represent people associated with various entities:
- Can be linked to clients, sites, or contractors
- Role and department information
- Contact details
- Primary contact designation

### 5. User Management

The system includes comprehensive user management features:
- Role-based access control
- Custom permissions
- User profiles
- Status tracking (active, inactive, pending)

### 6. Quotes

Quotes represent service proposals to clients:
- Pricing information
- Labor calculations based on award rates
- Shift planning
- Subcontractor costs
- Contract terms
- Margin and overhead calculations

### 7. Work Orders

Work orders represent specific jobs to be performed:
- Site association
- Status tracking
- Cost estimation
- Assignment to staff or contractors

## Key Features

### User Roles and Permissions

The system uses a comprehensive role-based access control system:
- User roles with custom permissions
- Role management interface for administrators
- User count tracking per role
- Version history for role modifications

### Import/Export Functionality

The application supports importing and exporting data:
- CSV parsing and generation
- Import operations for clients, contractors, sites, and contracts
- Test data generation capabilities
- Proper error handling and validation

### Award Rate Calculations

The system includes a comprehensive award rate calculator that:
- Supports different employment types (full-time, part-time, casual)
- Calculates rates based on day and time
- Handles penalty rates for weekends, evenings, and public holidays
- Supports different employee levels

### Contract Management

Contract management features include:
- Contract creation and tracking
- Version history
- Expiry notifications
- Renewal management
- Billing variations
- Contract extensions

### Quoting System

The quoting system allows for:
- Creating detailed service quotes
- Shift planning with labor costs
- Subcontractor inclusion
- Overhead and margin calculations
- Quote status tracking
- Quote comparison

### Billing Management

Billing features include:
- Recurring billing setup
- Multiple billing lines
- Frequency management
- Billing variations
- On-hold functionality
- Credit management

## Architecture and Code Organization

### API Structure

The API is organized by domain entity:
- `/clients` - Client management
- `/sites` - Site management
- `/contacts` - Contact management
- `/contractors` - Contractor management
- `/quotes` - Quote management
- `/workorders` - Work order management
- `/users` - User and role management

### Component Structure

UI components follow a domain-driven structure:
- `/components/clients` - Client-related components
- `/components/sites` - Site-related components
- `/components/users` - User management components
- `/components/ui` - Shared UI components

### Hook Organization

Custom hooks are structured to match their domain:
- `useClients` - Client data management
- `useSites` - Site data management
- `useUserRoles` - User role management
- Various import/export hooks for data operations

## Best Practices

1. **Type Safety**: Use TypeScript interfaces for all data structures.
2. **Error Handling**: Implement consistent error handling patterns.
3. **JSON Management**: Use helper functions for safe JSON operations.
4. **Form Management**: Follow consistent form patterns.
5. **State Management**: Use React Query for server state.
6. **UI Consistency**: Maintain consistent UI patterns.
7. **Code Organization**: Keep related functionality together.
8. **Validation**: Use Zod for validation schemas.
9. **Database Usage**: Follow Supabase best practices.
10. **Modularity**: Create focused components and utilities.

## Known Issues and Fixes

1. **Type Errors**: Fixed issues with UserRole interface and permission handling.
2. **CSV Parsing**: Enhanced to handle both string and File inputs.
3. **API Structure**: Improved organization of site-related API functions.
4. **User Count Tracking**: Fixed user count tracking in user role management.
