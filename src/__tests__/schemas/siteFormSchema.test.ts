
import { z } from 'zod';
import { describe, it, expect } from 'vitest';
import { siteFormSchema } from '@/lib/validation/siteSchema';

describe('Site Form Schema Validation', () => {
  it('validates a complete site form submission', () => {
    const validSiteData = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
      client_id: 'valid-client-uuid',
      status: 'active',
    };

    const result = siteFormSchema.safeParse(validSiteData);
    expect(result.success).toBe(true);
  });

  it('catches missing required fields', () => {
    const incompleteData = {
      name: '', // Missing required field
      address: '123 Main St',
    };

    const result = siteFormSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors).toHaveValidationError('Site name is required');
      expect(result.error.errors).toHaveValidationError('Client is required');
    }
  });

  it('validates postal code format', () => {
    const invalidPostalCode = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postalCode: 'invalid', // Invalid postal code
      country: 'Australia',
      client_id: 'valid-client-uuid',
      status: 'active',
    };

    const result = siteFormSchema.safeParse(invalidPostalCode);
    expect(result.success).toBe(false);
  });

  it('handles optional fields', () => {
    const optionalFieldsSite = {
      name: 'Minimal Site',
      address: '456 Secondary St',
      city: 'Melbourne',
      state: 'VIC',
      postalCode: '3000',
      country: 'Australia',
      client_id: 'valid-client-uuid',
      status: 'active',
      notes: 'Optional description', // Optional field
    };

    const result = siteFormSchema.safeParse(optionalFieldsSite);
    expect(result.success).toBe(true);
  });
});
