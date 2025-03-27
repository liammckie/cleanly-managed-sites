
import { describe, it, expect } from 'vitest';
import { userSchema, userProfileSchema } from '@/lib/validation/userSchema';

describe('User Schema Validation', () => {
  it('validates a complete user profile', () => {
    const validUserData = {
      email: 'test@example.com',
      full_name: 'John Doe',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const result = userSchema.safeParse(validUserData);
    expect(result.success).toBe(true);
  });

  it('catches invalid email', () => {
    const invalidEmailData = {
      email: 'invalid-email',
      full_name: 'John Doe',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const result = userSchema.safeParse(invalidEmailData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors).toHaveValidationError('Invalid email address');
    }
  });

  it('validates user profile with optional fields', () => {
    const fullUserProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'complete@example.com',
      full_name: 'Jane Smith',
      first_name: 'Jane',
      last_name: 'Smith',
      status: 'active',
      role_id: '123e4567-e89b-12d3-a456-426614174000',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '+1234567890',
      title: 'Software Engineer',
      created_at: new Date().toISOString(),
    };

    const result = userProfileSchema.safeParse(fullUserProfile);
    expect(result.success).toBe(true);
  });
});
