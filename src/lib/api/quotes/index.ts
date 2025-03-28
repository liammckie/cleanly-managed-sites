
// Re-export all quote-related API functions
export * from './quotesApi';
export * from './quoteShiftsApi';
export * from './quoteSubcontractorsApi';
export * from './overheadProfilesApi';
export * from './allowancesApi';

// Export fetchQuote as both fetchQuoteById and fetchQuote for compatibility
export { fetchQuote as fetchQuoteById, fetchQuote } from './quotesApi';

// Export createQuote as both createQuoteMutation and createQuote for compatibility
export { createQuote as createQuoteMutation, createQuote } from './quotesApi';

// Export updateQuote as both updateQuoteMutation and updateQuote for compatibility
export { updateQuote as updateQuoteMutation, updateQuote } from './quotesApi';

// Export deleteQuote as both deleteQuoteMutation and deleteQuote for compatibility
export { deleteQuote as deleteQuoteMutation, deleteQuote } from './quotesApi';
