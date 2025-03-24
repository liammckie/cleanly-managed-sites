
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

### 5. Quotes

Quotes represent service proposals to clients:
- Pricing information
- Labor calculations based on award rates
- Shift planning
- Subcontractor costs
- Contract terms
- Margin and overhead calculations

### 6. Work Orders

Work orders represent specific jobs to be performed:
- Site association
- Status tracking
- Cost estimation
- Assignment to staff or contractors

## Key Features

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

## Data Types and Structures

### JSON Fields

The application makes extensive use of JSON fields in the database to store structured data. These include:
- `contract_details`: Contract-related information
- `job_specifications`: Job-related details
- `security_details`: Security information for sites
- `billing_details`: Billing configuration
- `periodicals`: Recurring service schedules
- `replenishables`: Supply management

### Helper Functions

Several utility functions have been implemented to safely work with JSON data:
- `getJsonProperty`: Safely access nested properties
- `safeParseJson`: Parse JSON strings with fallbacks
- `hasJsonProperty`: Check for property existence
- `asJsonObject`: Type-safe conversion to objects

## Version History

The system tracks version history for several entity types:
- Contractor version history
- Site contract history
- Quote version comparison

## Business Rules

### Billing Variations

Billing variations follow these rules:
- Must have an effective date
- Can affect client billing, contractor payment, or both
- May extend contract terms
- Require reason documentation
- Create contract history entries

### Award Rate Calculations

The award rate calculator follows cleaning service award rules:
- Different rates for different employment types
- Penalty rates for non-standard hours
- Allowances for special circumstances
- Level-based pay scales

## Key Components

### Form Management

The application uses a consistent pattern for forms:
- Form data abstraction with TypeScript interfaces
- Multi-step forms with progress tracking
- Validation schema with Zod
- Form submission handling with optimistic updates

### Tabs and Cards

UI organization follows these patterns:
- Entity details displayed in cards
- Related information in tabbed interfaces
- Action buttons in consistent locations
- Status indicators with consistent color coding

## API Structure

The API is structured by domain entity:
- `/clients` - Client management
- `/sites` - Site management
- `/contacts` - Contact management
- `/contractors` - Contractor management
- `/quotes` - Quote management
- `/workorders` - Work order management

Each entity typically supports:
- Get all entities
- Get entity by ID
- Create entity
- Update entity
- Delete entity
- Specialized operations (e.g., set primary contact)

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

