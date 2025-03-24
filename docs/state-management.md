
# State Management Guide

This document outlines the state management patterns used in the application, including both client-side and server-side state.

## React Query

[React Query](https://tanstack.com/query/latest) is the primary tool for managing server state in the application. It provides a powerful API for fetching, caching, synchronizing, and updating server state.

### Basic Query Pattern

```typescript
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';

// In a component
function ClientsList() {
  const {
    data: clients,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay error={error} />;

  return (
    <div>
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

### Dependent Queries

```typescript
// Get a specific client first
const { data: client } = useQuery({
  queryKey: ['client', clientId],
  queryFn: () => clientsApi.getClientById(clientId),
  enabled: !!clientId,
});

// Then get sites for that client
const { data: sites } = useQuery({
  queryKey: ['client-sites', clientId],
  queryFn: () => clientsApi.getClientSites(clientId),
  enabled: !!clientId && !!client,
});
```

### Query Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

// In a component
const queryClient = useQueryClient();

// After creating a new client
await clientsApi.createClient(newClient);
queryClient.invalidateQueries({ queryKey: ['clients'] });

// After updating a specific client
await clientsApi.updateClient(clientId, updatedData);
queryClient.invalidateQueries({ queryKey: ['client', clientId] });
queryClient.invalidateQueries({ queryKey: ['clients'] });
```

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';
import { toast } from 'sonner';

function ClientForm() {
  const queryClient = useQueryClient();
  
  const createClientMutation = useMutation({
    mutationFn: (data) => clientsApi.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });
  
  const handleSubmit = (data) => {
    createClientMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button 
        type="submit" 
        disabled={createClientMutation.isPending}
      >
        {createClientMutation.isPending ? 'Creating...' : 'Create Client'}
      </Button>
    </form>
  );
}
```

### Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';
import { toast } from 'sonner';

function UpdateClientForm({ client }) {
  const queryClient = useQueryClient();
  
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }) => clientsApi.updateClient({ id, data }),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['client', id] });
      
      // Snapshot the previous value
      const previousClient = queryClient.getQueryData(['client', id]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['client', id], old => ({
        ...old,
        ...data
      }));
      
      // Return a context object with the snapshotted value
      return { previousClient };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, revert to the previous value
      queryClient.setQueryData(['client', id], context.previousClient);
      toast.error(`Failed to update client: ${err.message}`);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onSuccess: () => {
      toast.success('Client updated successfully');
    }
  });
  
  const handleSubmit = (data) => {
    updateClientMutation.mutate({ id: client.id, data });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button 
        type="submit" 
        disabled={updateClientMutation.isPending}
      >
        {updateClientMutation.isPending ? 'Updating...' : 'Update Client'}
      </Button>
    </form>
  );
}
```

### Query Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';

function ClientsTable({ clients }) {
  const queryClient = useQueryClient();
  
  const prefetchClient = (clientId) => {
    queryClient.prefetchQuery({
      queryKey: ['client', clientId],
      queryFn: () => clientsApi.getClientById(clientId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
  
  return (
    <table>
      <tbody>
        {clients.map(client => (
          <tr 
            key={client.id} 
            onMouseEnter={() => prefetchClient(client.id)}
          >
            <td>{client.name}</td>
            <td>{client.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Custom Hooks Pattern

The application uses custom hooks to encapsulate React Query logic:

```typescript
// hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api';
import { toast } from 'sonner';

export function useClients() {
  const queryClient = useQueryClient();
  
  // Query for all clients
  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });
  
  // Mutation for creating a client
  const createClientMutation = useMutation({
    mutationFn: (data) => clientsApi.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });
  
  // Mutation for updating a client
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }) => clientsApi.updateClient({ id, data }),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      toast.success('Client updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
  
  // Mutation for deleting a client
  const deleteClientMutation = useMutation({
    mutationFn: (id) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete client: ${error.message}`);
    },
  });
  
  return {
    clients: clientsQuery.data || [],
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}

// Example usage in a component
function ClientsPage() {
  const { 
    clients, 
    isLoading, 
    createClient, 
    isCreating 
  } = useClients();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <ClientForm onSubmit={createClient} isSubmitting={isCreating} />
      <ClientsList clients={clients} />
    </div>
  );
}
```

## React State Hooks

For client-side state management, the application uses React's built-in state hooks.

### useState

Used for simple component-level state:

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useReducer

Used for more complex state logic:

```typescript
import { useReducer } from 'react';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

function ItemsList() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const fetchItems = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const items = await api.getItems();
      dispatch({ type: 'FETCH_SUCCESS', payload: items });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
  
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  return (
    <div>
      {state.loading && <LoadingSpinner />}
      {state.error && <ErrorMessage error={state.error} />}
      <ItemList items={state.items} />
      <button onClick={fetchItems}>Refresh</button>
    </div>
  );
}
```

### useContext

Used for sharing state between components without prop drilling:

```typescript
import { createContext, useContext, useState } from 'react';

// Create a context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for using the context
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Usage in components
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'}
    >
      Toggle Theme
    </button>
  );
}

// App structure
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

## Form State Management

The application uses [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod) for form state management and validation.

### Basic Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

// Form component
function UserForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 18,
    },
  });
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p>{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...form.register('email')} />
        {form.formState.errors.email && (
          <p>{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...form.register('age', { valueAsNumber: true })}
        />
        {form.formState.errors.age && (
          <p>{form.formState.errors.age.message}</p>
        )}
      </div>
      
      <button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### Multi-step Form Pattern

```typescript
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Validation schema for each step
const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const step2Schema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),
});

// Combined schema
const formSchema = step1Schema.merge(step2Schema);

function MultiStepForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    mode: 'onChange',
  });
  
  const nextStep = async () => {
    let validationSchema = step === 1 ? step1Schema : step2Schema;
    
    // Get field names from the schema
    const fields = Object.keys(validationSchema.shape);
    
    // Validate only the fields for the current step
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });
  
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        
        <div>
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Previous
            </button>
          )}
          
          {step < 2 ? (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

// Step 1 component
function Step1() {
  const { register, formState } = useFormContext();
  
  return (
    <div>
      <h2>Step 1: Personal Information</h2>
      
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {formState.errors.name && (
          <p>{formState.errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {formState.errors.email && (
          <p>{formState.errors.email.message}</p>
        )}
      </div>
    </div>
  );
}

// Step 2 component
function Step2() {
  const { register, formState } = useFormContext();
  
  return (
    <div>
      <h2>Step 2: Address Information</h2>
      
      <div>
        <label htmlFor="address">Address</label>
        <input id="address" {...register('address')} />
        {formState.errors.address && (
          <p>{formState.errors.address.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="city">City</label>
        <input id="city" {...register('city')} />
        {formState.errors.city && (
          <p>{formState.errors.city.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="state">State</label>
        <input id="state" {...register('state')} />
        {formState.errors.state && (
          <p>{formState.errors.state.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="zipCode">Zip Code</label>
        <input id="zipCode" {...register('zipCode')} />
        {formState.errors.zipCode && (
          <p>{formState.errors.zipCode.message}</p>
        )}
      </div>
    </div>
  );
}
```

## State Management Best Practices

1. **Co-locate State**: Keep state as close as possible to where it's used.
2. **Derive State**: Calculate derived state on the fly instead of storing it.
3. **Separate Server State**: Use React Query for server state, React hooks for client state.
4. **Type Everything**: Use TypeScript for type safety in state management.
5. **Use Custom Hooks**: Encapsulate state logic in custom hooks for reusability.
6. **Normalize Data**: Keep data normalized to avoid duplication.
7. **Immutable Updates**: Always update state immutably.
8. **Optimistic Updates**: Use optimistic updates for better UX.
9. **Error Handling**: Handle errors consistently throughout the application.
10. **Loading States**: Provide feedback during async operations.
