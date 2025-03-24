
# Technical Decisions

This document outlines key technical decisions made during the development of the application and their rationales.

## 1. JSON Fields vs. Normalized Tables

### Decision
We chose to use JSON fields for several complex data structures rather than fully normalized database tables.

### Rationale
- **Flexibility**: JSON fields allow for schema evolution without migrations.
- **Performance**: Reduces joins for frequently accessed related data.
- **Complexity Management**: Simplifies the database schema.
- **Practical Use Cases**: Certain data structures (like job specifications) have variable fields that work well in JSON.

### Implementation
We implemented helper functions like `getJsonProperty` and `asJsonObject` to safely work with JSON data in a type-safe manner.

## 2. TypeScript Type Definitions

### Decision
We implemented comprehensive TypeScript interfaces for all domain entities and used them consistently throughout the application.

### Rationale
- **Type Safety**: Catches errors at compile time rather than runtime.
- **Documentation**: Types serve as living documentation of data structures.
- **Developer Experience**: Provides autocomplete and intellisense.
- **Refactoring Support**: Makes it easier to refactor code safely.

### Implementation
- Created detailed interfaces in `lib/types.ts` and domain-specific type files.
- Used generic types where appropriate for reusability.
- Implemented utility types for common patterns.

## 3. React Query for State Management

### Decision
We chose React Query for server state management instead of a general-purpose state management library like Redux.

### Rationale
- **Separation of Concerns**: Clearly separates server state from client state.
- **Caching**: Built-in caching reduces unnecessary network requests.
- **Data Synchronization**: Automatic background updates and refetching.
- **Loading/Error States**: Simplified handling of loading and error states.
- **Optimistic Updates**: Built-in support for optimistic updates.

### Implementation
- Created custom hooks for each domain entity (e.g., `useClients`, `useSites`).
- Implemented query invalidation patterns for data consistency.
- Used mutations with optimistic updates for a responsive UI.

## 4. Multi-step Forms

### Decision
We implemented multi-step forms for complex data entry processes.

### Rationale
- **User Experience**: Breaks complex forms into manageable chunks.
- **Progressive Disclosure**: Shows only relevant fields based on context.
- **Validation**: Allows for step-by-step validation.
- **Performance**: Improves rendering performance for large forms.

### Implementation
- Created a reusable form stepper pattern.
- Implemented progress tracking.
- Used form context for data sharing between steps.

## 5. Version History Tracking

### Decision
We implemented version history tracking for contractors and site contracts.

### Rationale
- **Audit Trail**: Provides a record of changes over time.
- **Compliance**: Helps meet regulatory requirements.
- **Rollback Capability**: Allows for reverting to previous versions if needed.
- **Change Visibility**: Makes it clear what changed, when, and by whom.

### Implementation
- Created history tables in the database.
- Implemented triggers for automatic versioning.
- Built UI components for viewing and comparing versions.

## 6. Award Rate Calculator

### Decision
We built a comprehensive award rate calculator based on the cleaning services industry award.

### Rationale
- **Accuracy**: Ensures compliance with industry award rates.
- **Efficiency**: Automates complex calculations.
- **Consistency**: Provides consistent pricing across quotes and jobs.
- **Transparency**: Makes it clear how costs are calculated.

### Implementation
- Created a data structure representing the award rates.
- Implemented calculation utilities for different scenarios.
- Built UI components for configuring and viewing calculations.

## 7. Component Library Integration

### Decision
We integrated the Shadcn UI component library rather than building custom components from scratch.

### Rationale
- **Consistency**: Provides a consistent look and feel.
- **Accessibility**: Components are built with accessibility in mind.
- **Efficiency**: Reduces development time.
- **Maintainability**: Follows established patterns and best practices.

### Implementation
- Customized components to match our application's style.
- Extended components where needed for specific requirements.
- Created composite components for common patterns.

## 8. API Structure

### Decision
We structured our API by domain entity rather than by functionality.

### Rationale
- **Organization**: Makes it easy to find related functionality.
- **Cohesion**: Keeps related code together.
- **Maintenance**: Simplifies maintenance and extensions.
- **Team Collaboration**: Makes it clear who owns what code.

### Implementation
- Created entity-specific API modules (e.g., `clientsApi`, `sitesApi`).
- Implemented consistent patterns across APIs.
- Used adapters for data transformation where needed.

## 9. JSON Utility Functions

### Decision
We created utility functions for working with JSON data.

### Rationale
- **Safety**: Prevents runtime errors when accessing JSON properties.
- **Type Safety**: Provides TypeScript type safety for JSON data.
- **Consistency**: Ensures consistent handling of JSON data.
- **Readability**: Makes code more readable and self-documenting.

### Implementation
- Implemented `getJsonProperty`, `safeParseJson`, `hasJsonProperty`, and `asJsonObject`.
- Used these functions consistently throughout the application.
- Added appropriate TypeScript type annotations.

## 10. Form Validation with Zod

### Decision
We chose Zod for form validation instead of other validation libraries.

### Rationale
- **TypeScript Integration**: First-class TypeScript support with inference.
- **Runtime Validation**: Validates data at runtime, not just compile time.
- **Schema Definition**: Clear and concise schema definitions.
- **Error Messages**: Customizable error messages.
- **Composability**: Easy to compose and reuse validation schemas.

### Implementation
- Created validation schemas for forms.
- Integrated with React Hook Form.
- Implemented consistent error handling patterns.
