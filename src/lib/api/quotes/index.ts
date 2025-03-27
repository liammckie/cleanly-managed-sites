
// Re-export all quote-related API functions
export * from './quotesApi';
export * from './quoteShiftsApi';
export * from './quoteSubcontractorsApi';

// Export fetchQuote as both fetchQuoteById and fetchQuote for compatibility
export { fetchQuote as fetchQuoteById, fetchQuote } from './quotesApi';
