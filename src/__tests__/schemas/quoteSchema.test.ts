
import { describe, it, expect } from 'vitest';
import { quoteSchema } from '@/lib/validation/quoteSchema';

describe('Quote Schema Validation', () => {
  it('validates a complete quote', () => {
    const validQuoteData = {
      name: 'Office Cleaning Quote',
      clientName: 'ABC Corporation',
      status: 'draft',
      laborCost: 1000,
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = quoteSchema.safeParse(validQuoteData);
    expect(result.success).toBe(true);
  });

  it('catches invalid quote status', () => {
    const invalidStatusQuote = {
      name: 'Invalid Quote',
      clientName: 'XYZ Inc',
      status: 'invalid-status', // Not an allowed status
      laborCost: 1000,
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = quoteSchema.safeParse(invalidStatusQuote);
    expect(result.success).toBe(false);
  });

  it('validates quote with optional fields', () => {
    const partialQuote = {
      name: 'Partial Quote',
      clientName: 'Minimal Client',
      status: 'draft',
      laborCost: 750,
      overheadPercentage: 10,
      marginPercentage: 15,
      subcontractorCost: 300,
      totalPrice: 1200,
      description: 'Optional description',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = quoteSchema.safeParse(partialQuote);
    expect(result.success).toBe(true);
  });
});
