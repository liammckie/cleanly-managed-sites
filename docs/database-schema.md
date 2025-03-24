
# Database Schema Documentation

This document provides an overview of the database schema used in the application, including table structures, relationships, and key considerations.

## Core Tables

### Clients

The `clients` table stores information about the businesses that hire our services.

```sql
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  custom_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);
```

Key fields:
- `id`: Primary key
- `name`: Client business name
- `contact_name`: Primary contact person
- `status`: Client status (active, inactive, prospect)
- `custom_id`: External reference ID

### Sites

The `sites` table stores information about service locations.

```sql
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  status TEXT NOT NULL DEFAULT 'active',
  representative TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  contract_details JSONB,
  security_details JSONB,
  job_specifications JSONB,
  billing_details JSONB,
  periodicals JSONB,
  replenishables JSONB,
  monthly_revenue NUMERIC,
  monthly_cost NUMERIC,
  weekly_revenue NUMERIC,
  annual_revenue NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  custom_id TEXT
);
```

Key fields:
- `id`: Primary key
- `client_id`: Foreign key to clients table
- `status`: Site status (active, inactive, pending, on-hold)
- `contract_details`: JSON field for contract information
- `job_specifications`: JSON field for job details
- Several other JSON fields for different aspects of site management

### Contacts

The `contacts` table stores information about people associated with clients, sites, and other entities.

```sql
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  monthly_cost NUMERIC,
  is_flat_rate BOOLEAN DEFAULT true,
  services JSONB,
  user_id UUID
);
```

Key fields:
- `id`: Primary key
- `entity_id`: ID of the associated entity (client, site, etc.)
- `entity_type`: Type of entity (client, site, etc.)
- `is_primary`: Whether this is the primary contact for the entity

### Contractors

The `contractors` table stores information about external service providers.

```sql
CREATE TABLE public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  contractor_type TEXT NOT NULL,
  abn TEXT,
  tax_id TEXT,
  hourly_rate NUMERIC,
  day_rate NUMERIC,
  specialty TEXT[],
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);
```

Key fields:
- `id`: Primary key
- `business_name`: Contractor's business name
- `contact_name`: Primary contact
- `contractor_type`: Type of contractor
- `specialty`: Array of specialties
- `hourly_rate` and `day_rate`: Payment rates

### Quotes

The `quotes` table stores service proposal information.

```sql
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  site_name TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  overhead_percentage NUMERIC DEFAULT 15,
  margin_percentage NUMERIC DEFAULT 20,
  total_price NUMERIC NOT NULL DEFAULT 0,
  labor_cost NUMERIC DEFAULT 0,
  supplies_cost NUMERIC DEFAULT 0,
  equipment_cost NUMERIC DEFAULT 0,
  subcontractor_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_date DATE,
  end_date DATE,
  expiry_date DATE,
  contract_length INTEGER,
  contract_length_unit TEXT,
  overhead_profile TEXT,
  created_by UUID,
  user_id UUID
);
```

Key fields:
- `id`: Primary key
- `status`: Quote status (draft, sent, accepted, rejected, expired)
- `overhead_percentage` and `margin_percentage`: Pricing variables
- Various cost fields for different aspects of the quote

### Work Orders

The `work_orders` table stores information about specific jobs to be performed.

```sql
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  site_id UUID NOT NULL,
  assigned_to UUID,
  created_by UUID NOT NULL,
  due_date DATE,
  completion_date DATE,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  billing_amount NUMERIC,
  requires_purchase_order BOOLEAN NOT NULL DEFAULT false,
  purchase_order_number TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

Key fields:
- `id`: Primary key
- `site_id`: Foreign key to sites table
- `status`: Work order status
- `assigned_to`: User assigned to the work order
- `estimated_cost` and `actual_cost`: Cost tracking

## History and Versioning Tables

### Contractor History

```sql
CREATE TABLE public.contractor_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL,
  contractor_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  notes TEXT,
  version_number INTEGER NOT NULL
);
```

### Site Contract History

```sql
CREATE TABLE public.site_contract_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL,
  contract_details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  notes TEXT,
  version_number INTEGER NOT NULL
);
```

## Supporting Tables

### Quote Shifts

```sql
CREATE TABLE public.quote_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  break_duration INTEGER DEFAULT 30,
  number_of_cleaners INTEGER DEFAULT 1,
  employment_type TEXT NOT NULL,
  level INTEGER NOT NULL,
  allowances JSONB DEFAULT '[]'::jsonb,
  estimated_cost NUMERIC DEFAULT 0,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Quote Subcontractors

```sql
CREATE TABLE public.quote_subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  cost NUMERIC NOT NULL DEFAULT 0,
  frequency TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Site Billing Lines

```sql
CREATE TABLE public.site_billing_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  frequency TEXT DEFAULT 'monthly',
  is_recurring BOOLEAN DEFAULT true,
  on_hold BOOLEAN DEFAULT false,
  weekly_amount NUMERIC,
  monthly_amount NUMERIC,
  annual_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Additional Contracts

```sql
CREATE TABLE public.site_additional_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID,
  contract_type TEXT NOT NULL,
  contract_number TEXT,
  start_date DATE,
  end_date DATE,
  value NUMERIC,
  renewal_terms TEXT,
  termination_period TEXT,
  auto_renew BOOLEAN DEFAULT false,
  billing_cycle TEXT DEFAULT 'monthly',
  notes TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Database Design Considerations

### JSON Fields

Many tables use JSON fields to store complex, flexible data structures. This approach offers:

1. **Flexibility**: Schema can evolve without migrations
2. **Reduced Complexity**: Fewer tables and joins
3. **Performance**: Faster reads for related data

However, it comes with these considerations:

1. **Query Complexity**: More complex queries for JSON data
2. **Validation**: Less enforcement of data integrity
3. **Type Safety**: Requires careful handling in application code

We've mitigated these concerns with:
- Helper functions for JSON access
- Type definitions in the application
- Consistent patterns for JSON field usage

### Triggers and Functions

Several database triggers and functions are used to automate operations:

1. **update_timestamp()**: Updates timestamps on record changes
2. **set_contractor_version()**: Manages versioning for contractor history
3. **set_site_contract_version()**: Manages versioning for site contract history
4. **update_site_contract_on_change()**: Creates history entries when contracts change

### Row Level Security

Row Level Security (RLS) policies control access to data based on the authenticated user:

- Most tables are restricted to rows where `user_id` matches the current user
- Some data may be accessible across the organization based on role
- Admin users typically have broader access

### Indexing Strategy

Key indexes include:

1. Primary key indexes on all tables
2. Foreign key indexes for relationship columns
3. Indexes on frequently queried fields like `status`
4. Partial indexes for filtered queries

### Data Types

Careful consideration has been given to data types:

1. **UUID** for IDs: Provides global uniqueness without coordination
2. **TEXT** for string data: Flexible length without arbitrary limits
3. **NUMERIC** for financial values: Precise decimal representation
4. **JSONB** for complex structures: Efficient storage and querying
5. **TIMESTAMP WITH TIME ZONE** for dates: Handles timezone differences

## Backup and Recovery

The database should be backed up regularly:

1. **Full Backups**: Complete database dumps (daily)
2. **Transaction Log Backups**: Continuous backup of changes
3. **Point-in-Time Recovery**: Ability to restore to specific moments

## Migration Strategy

Database changes follow this process:

1. **Development**: Changes are first applied in development
2. **Testing**: Migrations are tested in a staging environment
3. **Review**: Changes are reviewed for performance and compatibility
4. **Deployment**: Migrations are applied in production during maintenance windows
