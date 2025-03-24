# API Reference

This document provides a comprehensive reference for the application's API structure and usage patterns.

## Client APIs

### Core Client Operations

```typescript
// Get all clients
const clients = await clientsApi.getClients();

// Get a specific client by ID
const client = await clientsApi.getClientById(clientId);

// Create a new client
const newClient = await clientsApi.createClient({
  name: 'Client Name',
  contact_name: 'Contact Person',
  email: 'contact@example.com',
  // other fields
});

// Update an existing client
const updatedClient = await clientsApi.updateClient({
  id: clientId,
  data: {
    name: 'Updated Name',
    // other fields to update
  }
});

// Delete a client
await clientsApi.deleteClient(clientId);
```

### Client Contacts

```typescript
// Get contacts for a specific client
const contacts = await clientsApi.getClientContacts(clientId);

// Add a contact to a client
const newContact = await clientsApi.addClientContact(clientId, {
  name: 'Contact Name',
  role: 'Manager',
  email: 'contact@example.com',
  // other fields
});

// Set a contact as primary
await clientsApi.setPrimaryContact(contactId, 'client', clientId);
```

### Client Sites

```typescript
// Get sites for a specific client
const sites = await clientsApi.getClientSites(clientId);
```

## Site APIs

### Core Site Operations

```typescript
// Get all sites
const sites = await sitesApi.getSites();

// Get a specific site by ID
const site = await sitesApi.getSiteById(siteId);

// Create a new site
const newSite = await sitesApi.createSite({
  name: 'Site Name',
  address: '123 Main St',
  city: 'Sydney',
  state: 'NSW',
  postcode: '2000',
  client_id: clientId,
  // other fields
});

// Update an existing site
const updatedSite = await sitesApi.updateSite(siteId, {
  name: 'Updated Site Name',
  // other fields to update
});

// Delete a site
await sitesApi.deleteSite(siteId);
```

### Site Contacts

```typescript
// Get contacts for a specific site
const contacts = await sitesApi.getSiteContacts(siteId);

// Add a contact to a site
const newContact = await sitesApi.createSiteContact(siteId, {
  name: 'Contact Name',
  role: 'Site Manager',
  email: 'manager@example.com',
  // other fields
});
```

### Site Contract History

```typescript
// Get contract history for a site
const history = await contractHistoryApi.getSiteContractHistory(siteId);

// Save a new version of a contract
await contractHistoryApi.saveContractVersion(
  siteId,
  contractDetails,
  'Updated contract terms'
);
```

### Site Billing

```typescript
// Get billing lines for a site
const billingLines = await billingLinesApi.getSiteBillingLines(siteId);

// Add a billing line
const newBillingLine = await billingLinesApi.createBillingLine({
  site_id: siteId,
  description: 'Monthly Cleaning',
  amount: 1000,
  frequency: 'monthly',
  is_recurring: true
});

// Update a billing line
const updatedBillingLine = await billingLinesApi.updateBillingLine(
  billingLineId,
  {
    amount: 1200,
    // other fields to update
  }
);

// Delete a billing line
await billingLinesApi.deleteBillingLine(billingLineId);
```

## Contact APIs

### Core Contact Operations

```typescript
// Get all contacts
const contacts = await contactsApi.getContacts();

// Get a specific contact by ID
const contact = await contactsApi.getContactById(contactId);

// Get contacts for a specific entity
const entityContacts = await contactsApi.getContactsByEntityId(entityId, entityType);

// Create a new contact
const newContact = await contactsApi.createContact({
  name: 'Contact Name',
  role: 'Manager',
  entity_id: entityId,
  entity_type: 'client', // or 'site', 'contractor', etc.
  // other fields
});

// Update an existing contact
const updatedContact = await contactsApi.updateContact({
  id: contactId,
  data: {
    name: 'Updated Name',
    // other fields to update
  }
});

// Delete a contact
await contactsApi.deleteContact(contactId);

// Set a contact as primary
await contactsApi.setPrimaryContact(contactId, entityType, entityId);
```

### Contact Search

```typescript
// Search for entities to associate with contacts
const searchResults = await contactsApi.searchEntities(
  searchTerm,
  entityType
);
```

## Contractor APIs

### Core Contractor Operations

```typescript
// Get all contractors
const contractors = await contractorsApi.getContractors();

// Get a specific contractor by ID
const contractor = await contractorsApi.getContractorById(contractorId);

// Create a new contractor
const newContractor = await contractorsApi.createContractor({
  business_name: 'Contractor Company',
  contact_name: 'Contact Person',
  contractor_type: 'Cleaning',
  // other fields
});

// Update an existing contractor
const updatedContractor = await contractorsApi.updateContractor({
  id: contractorId,
  data: {
    business_name: 'Updated Company Name',
    // other fields to update
  }
});

// Delete a contractor
await contractorsApi.deleteContractor(contractorId);
```

### Contractor History

```typescript
// Get history for a contractor
const history = await contractorHistoryApi.getContractorHistory(contractorId);

// Get a specific version
const version = await contractorHistoryApi.getContractorVersion(versionId);

// Save a new version
await contractorHistoryApi.saveContractorVersion(
  contractorId,
  contractorData,
  'Updated contractor details'
);
```

## Quote APIs

### Core Quote Operations

```typescript
// Get all quotes
const quotes = await quotesApi.getQuotes();

// Get a specific quote by ID
const quote = await quotesApi.getQuoteById(quoteId);

// Create a new quote
const newQuote = await quotesApi.createQuote({
  title: 'Office Cleaning Quote',
  clientName: 'Client Company',
  // other fields
});

// Update an existing quote
const updatedQuote = await quotesApi.updateQuote(quoteId, {
  title: 'Updated Quote Title',
  // other fields to update
});

// Delete a quote
await quotesApi.deleteQuote(quoteId);
```

### Quote Shifts

```typescript
// Get shifts for a quote
const shifts = await quoteShiftsApi.getQuoteShifts(quoteId);

// Add a shift to a quote
const newShift = await quoteShiftsApi.createQuoteShift({
  quoteId: quoteId,
  day: 'monday',
  startTime: '09:00',
  endTime: '17:00',
  employmentType: 'full_time',
  level: 1,
  // other fields
});

// Update a shift
const updatedShift = await quoteShiftsApi.updateQuoteShift(
  shiftId,
  {
    startTime: '08:00',
    // other fields to update
  }
);

// Delete a shift
await quoteShiftsApi.deleteQuoteShift(shiftId);
```

### Quote Subcontractors

```typescript
// Get subcontractors for a quote
const subcontractors = await quoteSubcontractorsApi.getQuoteSubcontractors(quoteId);

// Add a subcontractor to a quote
const newSubcontractor = await quoteSubcontractorsApi.createQuoteSubcontractor({
  quoteId: quoteId,
  name: 'Subcontractor Name',
  cost: 500,
  frequency: 'monthly',
  // other fields
});

// Update a subcontractor
const updatedSubcontractor = await quoteSubcontractorsApi.updateQuoteSubcontractor(
  subcontractorId,
  {
    cost: 600,
    // other fields to update
  }
);

// Delete a subcontractor
await quoteSubcontractorsApi.deleteQuoteSubcontractor(subcontractorId);
```

## Overhead Profile APIs

```typescript
// Get all overhead profiles
const profiles = await overheadProfilesApi.getOverheadProfiles();

// Get a specific profile by ID
const profile = await overheadProfilesApi.getOverheadProfileById(profileId);

// Create a new profile
const newProfile = await overheadProfilesApi.createOverheadProfile({
  name: 'Standard Overhead',
  laborPercentage: 15,
  description: 'Standard overhead rate for most clients',
});

// Update an existing profile
const updatedProfile = await overheadProfilesApi.updateOverheadProfile(
  profileId,
  {
    laborPercentage: 18,
    // other fields to update
  }
);

// Delete a profile
await overheadProfilesApi.deleteOverheadProfile(profileId);
```

## Work Order APIs

```typescript
// Get all work orders
const workOrders = await workOrdersApi.getWorkOrders();

// Get a specific work order by ID
const workOrder = await workOrdersApi.getWorkOrderById(workOrderId);

// Create a new work order
const newWorkOrder = await workOrdersApi.createWorkOrder({
  title: 'Emergency Cleaning',
  description: 'Water damage cleanup required',
  status: 'pending',
  priority: 'high',
  site_id: siteId,
  // other fields
});

// Update an existing work order
const updatedWorkOrder = await workOrdersApi.updateWorkOrder(
  workOrderId,
  {
    status: 'in-progress',
    // other fields to update
  }
);

// Delete a work order
await workOrdersApi.deleteWorkOrder(workOrderId);
```

## Authentication APIs

```typescript
// Get the current user
const user = await authApi.getCurrentUser();

// Check if a user is authenticated
const isAuthenticated = await authApi.isAuthenticated();

// Sign out the current user
await authApi.signOut();

// Create a new user (admin only)
const newUser = await authApi.createUser(
  'user@example.com',
  'password',
  'First',
  'Last',
  '0412345678',
  'Manager',
  roleId
);
```

## User APIs

```typescript
// Get all users
const users = await userApi.getUsers();

// Get a specific user by ID
const user = await userApi.getUserById(userId);

// Update a user
const updatedUser = await userApi.updateUser(userId, {
  first_name: 'Updated First Name',
  // other fields to update
});

// Delete a user
await userApi.deleteUser(userId);
```

## JSON Utilities

```typescript
import { 
  getJsonProperty, 
  safeParseJson, 
  hasJsonProperty, 
  asJsonObject 
} from '@/lib/utils/json';

// Get a property from a JSON object with a fallback
const value = getJsonProperty(jsonObject, 'path.to.property', 'default');

// Safely parse a JSON string
const parsedJson = safeParseJson(jsonString, defaultObject);

// Check if a JSON object has a property
const hasProperty = hasJsonProperty(jsonObject, 'propertyName');

// Convert a JSON value to a typed object
const typedObject = asJsonObject<MyInterface>(jsonValue, defaultObject);
```

## Award Rate Utilities

```typescript
import { 
  calculateTotalCosts,
  calculateLaborCost,
  hasEarlyLateHours,
  calculateHourDifference,
  detectOvertimeHours
} from '@/lib/award/utils';

// Calculate total costs including labor, overhead, and margin
const costs = calculateTotalCosts(
  'full_time',  // employment type
  2,             // employee level
  { weekday: 8 }, // hours by condition
  15,            // overhead percentage
  20             // margin percentage
);

// Calculate labor cost
const laborCost = calculateLaborCost(
  'full_time',   // employment type
  2,              // employee level
  { weekday: 8 }  // hours by condition
);

// Check if a shift has early or late hours
const hasEarlyLate = hasEarlyLateHours('06:00', '18:00');

// Calculate hours between two times
const hours = calculateHourDifference('09:00', '17:00', 30); // with 30 min break

// Detect overtime hours for a set of shifts
const overtimeHours = detectOvertimeHours(shifts, 'monday');
```

## Best Practices

### Error Handling

```typescript
try {
  const result = await clientsApi.createClient(clientData);
  // Handle success
} catch (error) {
  if (error.code === 'P2002') {
    // Handle duplicate key error
  } else if (error.code === '42501') {
    // Handle permission error
  } else {
    // Handle generic error
    console.error('Error creating client:', error);
  }
}
```

### Query Invalidation

```typescript
const queryClient = useQueryClient();

// After a successful mutation
queryClient.invalidateQueries(['clients']);

// Invalidate a specific client
queryClient.invalidateQueries(['client', clientId]);

// Invalidate related entities
queryClient.invalidateQueries(['clients']);
queryClient.invalidateQueries(['client-sites', clientId]);
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: (data) => clientsApi.updateClient(data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['client', newData.id]);
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData(['client', newData.id]);
    
    // Optimistically update
    queryClient.setQueryData(['client', newData.id], (old) => ({
      ...old,
      ...newData.data
    }));
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Revert to previous value on error
    queryClient.setQueryData(
      ['client', newData.id],
      context.previousData
    );
  },
  onSettled: (data, error, variables) => {
    // Refetch to ensure server state
    queryClient.invalidateQueries(['client', variables.id]);
  }
});
```
