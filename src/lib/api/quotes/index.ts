
// Re-export all quote-related API functions
export * from './quotesApi';
export * from './quoteShiftsApi';
export * from './quoteSubcontractorsApi';

// Export fetchQuote as an alias to getQuoteById
export { getQuoteById as fetchQuote } from './quotesApi';
