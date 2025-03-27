
# Code Structure & Type System

This document explains the code structure and types system for the application.

## JSON Utilities

The `src/lib/utils/json.ts` file provides utilities for working with JSON data:

- `parseJson<T>`: Safely parses a JSON string into a typed object
- `convertJsonToType<T>`: Converts a JSON object to a specific type
- `jsonToString`: Converts a JSON object or string to a string representation
- `getJsonProperty<T>`: Safely accesses a property from a JSON object
- `asJsonObject<T>`: Converts JSON to a typed object with default values
- `safeJsonStringify`: Safely stringifies a value to JSON

## Type Definitions

### Contract Types

Located in `src/components/sites/forms/types/contractTypes.d.ts`, these define contract-related data:

- `ContractTerm`: Individual terms in a contract 
- `ContractDetails`: Details of a site contract
- `ContractHistoryEntry`: An entry in a contract's version history
- `ContractForecast`: Monthly forecast data for contract revenue

### Billing Types

Located in `src/components/sites/forms/types/billingTypes.ts`, these define billing-related data:

- `BillingAddress`: Address information for billing
- `BillingContact`: Contact person for billing
- `BillingLine`: Individual line item for billing
- `BillingDetails`: Complete billing information

### Award Types

Located in `src/lib/award/types.ts`, these define award and quoting-related data:

- Various types like `Day`, `EmploymentType`, `EmployeeLevel`, etc.
- `QuoteShift`: A shift in a quote
- `Subcontractor`: Information about a subcontractor
- `Quote`: Complete quote information
- `RateDefinition`: Definition of a rate for a specific time/condition
- `AwardSettings`: Settings for an award
- `AwardData`: Complete data for an award

## Utility Functions

### Format Utilities

Located in `src/lib/utils/format.ts`, these provide formatting functions:

- `formatCurrency`: Format a number as a currency string
- `formatNumber`: Format a number with commas
- `formatDate`: Format a date as a string
- `formatPercentage`: Format a percentage value
- `formatFileSize`: Format file size in bytes to a readable string

### Quote Type Adapters

Located in `src/lib/utils/quoteTypeAdapter.ts`, these adapt data between formats:

- `adaptQuote`: Adapts a quote from database to application format
- `adaptModelsToQuotes`: Adapts a list of quotes
- `adaptQuoteShift`: Adapts a quote shift
- Functions for converting between snake_case and camelCase

## Import/Export Utilities

Located in `src/lib/import-export/index.ts`, these handle data import/export:

- Functions to parse CSV data
- Functions to import different types of data (clients, sites, contractors)
- Functions to convert between data formats

## Components

Several components have been created or updated to show contract and quote information:

- `ClientSelector`: For selecting a client
- `ContractDashboard`: Overview of contracts
- `ContractForecastChart`: Chart showing contract forecasts
- `ContractMetricsList`: List of contract metrics

## Hooks

These hooks manage application state and data:

- `useContractForecast`: Manages forecast data for contracts
- `useSiteFormStepper`: Manages multi-step forms for sites
