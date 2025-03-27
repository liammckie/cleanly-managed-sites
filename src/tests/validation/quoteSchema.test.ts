
import { describe, it, expect } from 'vitest';
import { quoteSchema } from '@/lib/validation/quoteSchema';

describe('Quote Schema Validation', () => {
  it('should validate a valid quote object', () => {
    const validQuote = {
      name: 'Office Building Cleaning',
      clientName: 'ABC Corp',
      status: 'draft',
      laborCost: 1000,
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = quoteSchema.safeParse(validQuote);
    expect(result.success).toBe(true);
  });

  it('should reject when required fields are missing', () => {
    const incompleteQuote = {
      name: 'Office Building Cleaning',
      // Missing required fields
    };
    
    const result = quoteSchema.safeParse(incompleteQuote);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.issues.map(issue => issue.path[0]);
      expect(fieldErrors).toContain('clientName');
      expect(fieldErrors).toContain('createdAt');
      expect(fieldErrors).toContain('updatedAt');
    }
  });

  it('should reject negative financial values', () => {
    const quoteWithNegativeValues = {
      name: 'Office Building Cleaning',
      clientName: 'ABC Corp',
      status: 'draft',
      laborCost: -1000, // Negative value
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = quoteSchema.safeParse(quoteWithNegativeValues);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('laborCost'))).toBe(true);
    }
  });

  it('should reject invalid status', () => {
    const quoteWithInvalidStatus = {
      name: 'Office Building Cleaning',
      clientName: 'ABC Corp',
      status: 'not-a-valid-status',
      laborCost: 1000,
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = quoteSchema.safeParse(quoteWithInvalidStatus);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('status'))).toBe(true);
    }
  });

  it('should validate with optional fields', () => {
    const quoteWithOptionalFields = {
      name: 'Office Building Cleaning',
      clientName: 'ABC Corp',
      status: 'draft',
      laborCost: 1000,
      overheadPercentage: 15,
      marginPercentage: 20,
      subcontractorCost: 500,
      totalPrice: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      siteName: 'Main Office',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      notes: 'Additional cleaning required for events',
    };
    
    const result = quoteSchema.safeParse(quoteWithOptionalFields);
    expect(result.success).toBe(true);
  });
});
