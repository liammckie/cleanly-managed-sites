
// Re-export all quote-related API functions
export * from './quotesApi';
export * from './quoteShiftsApi';
export * from './quoteSubcontractorsApi';

// Export fetchQuote as both fetchQuoteById and fetchQuote for compatibility
export { fetchQuote as fetchQuoteById, fetchQuote } from './quotesApi';

// Export createQuote as both createQuoteMutation and createQuote for compatibility
export { createQuote as createQuoteMutation, createQuote } from './quotesApi';

// Export updateQuote as both updateQuoteMutation and updateQuote for compatibility
export { updateQuote as updateQuoteMutation, updateQuote } from './quotesApi';
