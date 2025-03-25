
# Error Handling System

This document describes the error handling system implemented throughout the application.

## Components

### Error Boundary

The application uses React Error Boundary pattern to catch and handle errors in the component tree. 

- `ErrorBoundary`: A class component that catches JavaScript errors in its child component tree and displays a fallback UI.
- `ErrorFallback`: A fallback component that displays when an error is caught.
- `useErrorBoundary`: A hook that allows functional components to trigger error boundaries programmatically.

### API Error Handling

The application has standardized API error handling through utility functions:

- `handleApiError`: A function that processes errors from API calls and can display toasts, log errors, and either rethrow or return null.
- `withErrorHandling`: A higher-order function that wraps API functions with standardized error handling.
- `parseError`: A utility function that converts various error formats into a standardized ApiError format.

### Query Error Handling

The application leverages React Query with custom error handling:

- `useErrorHandledQuery`: A custom hook that wraps useQuery with standardized error handling.

## Usage

### Wrapping Components with Error Boundaries

```tsx
<ErrorBoundary fallback={<MyErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### Using the Error Boundary Hook

```tsx
const { showBoundary, clearError } = useErrorBoundary();

try {
  // Risky operation
} catch (error) {
  showBoundary(error);
}
```

### Handling API Errors

```tsx
// Wrap individual API calls
const result = await handleApiError(
  myApiFunction(args),
  { errorMessage: 'Failed to fetch data' }
);

// Or wrap an entire API function
const safeApiFunction = withErrorHandling(
  myApiFunction,
  'Failed to fetch data'
);
```

### Using Error-Handled Queries

```tsx
const { data, isLoading, isError, error } = useErrorHandledQuery(
  ['myQueryKey'],
  fetchMyData,
  {
    errorMessage: 'Failed to load data',
    showErrorToast: true,
  }
);
```

### Loading Error State Pattern

```tsx
<LoadingErrorState
  isLoading={isLoading}
  isError={isError}
  error={error}
  onRetry={refetch}
>
  {/* Content when loaded successfully */}
  <MyContent data={data} />
</LoadingErrorState>
```

## Best Practices

1. **Use Error Boundaries at Strategic Points**
   Place error boundaries at key points in your component tree, especially around complex components or those that make API calls.

2. **Don't Swallow Errors**
   Log errors and ensure they are visible to the user when appropriate.

3. **Provide Meaningful Error Messages**
   Always present clear error messages that guide the user on what went wrong and how to recover.

4. **Use Toast Notifications for Transient Errors**
   Use toast notifications for errors that don't prevent the application from functioning.

5. **Provide Recovery Options**
   Always give users a way to recover from errors, such as retry buttons or navigation options.
