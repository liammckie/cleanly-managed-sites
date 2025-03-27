
import { describe, it, expect } from 'vitest';
import { userSchema } from '@/lib/validation/userSchema';

describe('User Schema Validation', () => {
  it('should validate a valid user object', () => {
    const validUser = {
      email: 'test@example.com',
      full_name: 'John Doe',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    
    const result = userSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      email: 'not-an-email',
      full_name: 'John Doe',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    
    const result = userSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
    }
  });

  it('should reject when required fields are missing', () => {
    const incompleteUser = {
      email: 'test@example.com',
      // Missing full_name and other required fields
    };
    
    const result = userSchema.safeParse(incompleteUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('full_name'))).toBe(true);
    }
  });

  it('should validate with optional fields', () => {
    const userWithOptionalFields = {
      email: 'test@example.com',
      full_name: 'John Doe',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '123-456-7890',
      title: 'Manager',
    };
    
    const result = userSchema.safeParse(userWithOptionalFields);
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const userWithInvalidStatus = {
      email: 'test@example.com',
      full_name: 'John Doe',
      status: 'not-a-valid-status',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    
    const result = userSchema.safeParse(userWithInvalidStatus);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('status'))).toBe(true);
    }
  });
});
