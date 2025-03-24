# Troubleshooting Guide

This guide addresses common issues and their solutions to help developers troubleshoot the application.

## Type-Related Issues

### Issue: TypeScript Errors with JSON Properties

**Problem**: TypeScript doesn't recognize properties from JSON objects.

```typescript
// Error: Property 'contractNumber' does not exist on type 'Json'.
const contractNumber = site.contract_details.contractNumber;
```

**Solution**: 
- Use the `getJsonProperty` utility function:
  ```typescript
  import { getJsonProperty } from '@/lib/utils/json';
  
  const contractNumber = getJsonProperty(site.contract_details, 'contractNumber', '');
  ```
- Or use the `asJsonObject` utility for the entire object:
  ```typescript
  import { asJsonObject } from '@/lib/utils/json';
  
  const contractDetails = asJsonObject(site.contract_details, {});
  const contractNumber = contractDetails.contractNumber;
  ```

### Issue: Type Conversion Errors

**Problem**: Errors when converting between database types and application types.

```typescript
// Error: Conversion of type '{ ... }' to type 'ContractorRecord' may be a mistake
const contractor = contractorsResult.data;
```

**Solution**:
- Use type assertion with caution:
  ```typescript
  const contractor = contractorsResult.data as unknown as ContractorRecord;
  ```
- Better: Create and use adapter functions:
  ```typescript
  import { dbToContractor } from '@/lib/api/adapters';
  
  const contractor = dbToContractor(contractorsResult.data);
  ```

## React Query Issues

### Issue: Stale Data

**Problem**: UI doesn't reflect the latest data after updates.

**Solution**:
- Invalidate queries after mutations:
  ```typescript
  const queryClient = useQueryClient();
  
  // After a successful mutation
  queryClient.invalidateQueries(['clients']);
  ```
- Enable automatic refetching:
  ```typescript
  const { data } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  ```

### Issue: Error Handling

**Problem**: Errors from React Query are not properly handled.

**Solution**:
- Handle errors in the component:
  ```typescript
  const { data, error, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  if (isError) {
    return <ErrorMessage error={error} />;
  }
  ```
- Set up a global error handler:
  ```typescript
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(`Something went wrong: ${error.message}`);
      },
    }),
  });
  ```

## Form Issues

### Issue: Form Reset Not Working

**Problem**: Form doesn't reset properly after submission.

**Solution**:
- Use the reset method from React Hook Form:
  ```typescript
  const { reset, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    await createClient(data);
    reset(); // Reset form after successful submission
  };
  ```
- Ensure defaultValues are properly set:
  ```typescript
  const { reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      // other default values
    }
  });
  ```

### Issue: Form Validation Errors

**Problem**: Form validation doesn't work as expected.

**Solution**:
- Check Zod schema definitions:
  ```typescript
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
  });
  ```
- Ensure proper integration with React Hook Form:
  ```typescript
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    }
  });
  ```
- Debug validation by logging errors:
  ```typescript
  console.log(form.formState.errors);
  ```

## JSON Field Issues

### Issue: Cannot Read Properties of Undefined

**Problem**: Attempting to access properties of undefined JSON fields.

**Solution**:
- Check for existence before accessing:
  ```typescript
  const contract = site.contract_details 
    ? site.contract_details.contractNumber 
    : '';
  ```
- Use optional chaining:
  ```typescript
  const contract = site.contract_details?.contractNumber || '';
  ```
- Use utility functions:
  ```typescript
  import { getJsonProperty } from '@/lib/utils/json';
  
  const contract = getJsonProperty(site.contract_details, 'contractNumber', '');
  ```

### Issue: JSON Parse Errors

**Problem**: Errors when parsing JSON strings.

**Solution**:
- Use the safeParseJson utility:
  ```typescript
  import { safeParseJson } from '@/lib/utils/json';
  
  const data = safeParseJson(jsonString, defaultValue);
  ```
- Handle errors explicitly:
  ```typescript
  try {
    const data = JSON.parse(jsonString);
    // Use data
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // Handle error
  }
  ```

## Performance Issues

### Issue: Slow Component Rendering

**Problem**: Components take too long to render.

**Solution**:
- Memoize expensive calculations:
  ```typescript
  const expensiveValue = useMemo(() => {
    return performExpensiveCalculation(value);
  }, [value]);
  ```
- Use React.memo for components:
  ```typescript
  const MyComponent = React.memo(({ value }) => {
    return <div>{value}</div>;
  });
  ```
- Virtualize long lists:
  ```typescript
  import { useVirtualizer } from '@tanstack/react-virtual';
  
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });
  ```

### Issue: Excessive API Calls

**Problem**: Too many API calls causing performance issues.

**Solution**:
- Use React Query's caching:
  ```typescript
  const { data } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  ```
- Debounce user input:
  ```typescript
  import { useDebounce } from '@/hooks/useDebounce';
  
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    // Only fetch when debouncedSearch changes
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
  ```

## Supabase Issues

### Issue: RLS Policies Blocking Access

**Problem**: Unable to access or modify data due to Row Level Security (RLS) policies.

**Solution**:
- Check user authentication status:
  ```typescript
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Handle unauthenticated user
  }
  ```
- Verify RLS policies in Supabase dashboard
- Use service role for admin operations (with caution):
  ```typescript
  // Only use server-side with proper authentication checks
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'user@example.com',
    password: 'password',
    user_metadata: { name: 'User' }
  });
  ```

### Issue: Large JSON Data

**Problem**: Performance issues when working with large JSON objects.

**Solution**:
- Consider normalizing data into separate tables
- Only request needed fields:
  ```typescript
  const { data, error } = await supabase
    .from('sites')
    .select('id, name, client_id')
    .eq('status', 'active');
  ```
- Use pagination:
  ```typescript
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .range(0, 9);
  ```

## Award Calculation Issues

### Issue: Incorrect Rate Calculations

**Problem**: Award rate calculations produce unexpected results.

**Solution**:
- Verify employment type and level inputs:
  ```typescript
  if (employmentType !== 'full_time' && 
      employmentType !== 'part_time' && 
      employmentType !== 'casual') {
    console.error(`Invalid employment type: ${employmentType}`);
    return 0;
  }
  ```
- Check for missing rate definitions:
  ```typescript
  const rate = employeeRate.rates[payCondition];
  if (!rate) {
    console.error(`No rate found for ${payCondition}`);
    return 0;
  }
  ```
- Validate inputs before calculation:
  ```typescript
  if (isNaN(hours) || hours < 0) {
    console.error(`Invalid hours: ${hours}`);
    return 0;
  }
  ```
