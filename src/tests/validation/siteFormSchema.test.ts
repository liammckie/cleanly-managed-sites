
import { describe, it, expect } from 'vitest';
import { siteFormSchema } from '@/lib/validation/siteSchema';

describe('Site Form Schema Validation', () => {
  it('should validate a valid site form object', () => {
    const validSite = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
      client_id: '123e4567-e89b-12d3-a456-426614174000',
      status: 'active',
    };
    
    const result = siteFormSchema.safeParse(validSite);
    expect(result.success).toBe(true);
  });

  it('should reject when required fields are missing', () => {
    const incompleteSite = {
      name: 'Test Site',
      // Missing required fields
    };
    
    const result = siteFormSchema.safeParse(incompleteSite);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.issues.map(issue => issue.path[0]);
      expect(fieldErrors).toContain('address');
      expect(fieldErrors).toContain('city');
      expect(fieldErrors).toContain('state');
      expect(fieldErrors).toContain('postalCode');
    }
  });

  it('should accept a site with billingDetails', () => {
    const siteWithBilling = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
      client_id: '123e4567-e89b-12d3-a456-426614174000',
      status: 'active',
      billingDetails: {
        billingMethod: 'invoice',
        paymentTerms: 'net30',
        billingEmail: 'billing@example.com',
        billingLines: [
          {
            id: '123',
            description: 'Cleaning Service',
            amount: 100,
            frequency: 'monthly',
            isRecurring: true,
            onHold: false
          }
        ]
      }
    };
    
    const result = siteFormSchema.safeParse(siteWithBilling);
    expect(result.success).toBe(true);
  });

  it('should validate with alias fields', () => {
    const siteWithAliasFields = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postcode: '2000', // using postcode instead of postalCode
      country: 'Australia',
      clientId: '123e4567-e89b-12d3-a456-426614174000', // using clientId instead of client_id
      status: 'active',
    };
    
    const result = siteFormSchema.safeParse(siteWithAliasFields);
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const siteWithInvalidStatus = {
      name: 'Test Site',
      address: '123 Main St',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
      client_id: '123e4567-e89b-12d3-a456-426614174000',
      status: 'not-a-valid-status',
    };
    
    const result = siteFormSchema.safeParse(siteWithInvalidStatus);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('status'))).toBe(true);
    }
  });
});
