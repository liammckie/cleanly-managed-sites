
// Re-export all quote-related API functions
export * from './quotesApi';
export * from './quoteShiftsApi';
export * from './quoteSubcontractorsApi';

// Export fetchQuoteById as an alias to getQuoteById
export { fetchQuoteById as getQuoteById } from './quotesApi';
