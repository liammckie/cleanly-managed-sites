
import { describe, it, expect } from 'vitest';
import { userSchema } from '@/lib/validation/userSchema';
import { siteFormSchema } from '@/lib/validation/siteSchema';
import { quoteSchema } from '@/lib/validation/quoteSchema';
import { validateWithZod } from '@/utils/zodValidation';

// This file can be run directly to test validation functionality

console.log('Running validation tests...');

// Test user schema
const validUser = {
  email: 'test@example.com',
  full_name: 'John Doe',
  status: 'active',
  role_id: '123e4567-e89b-12d3-a456-426614174000',
};

const userResult = validateWithZod(userSchema, validUser);
console.log('User validation result:', userResult.success ? 'PASS' : 'FAIL');

// Test site schema
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

const siteResult = validateWithZod(siteFormSchema, validSite);
console.log('Site validation result:', siteResult.success ? 'PASS' : 'FAIL');

// Test quote schema
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

const quoteResult = validateWithZod(quoteSchema, validQuote);
console.log('Quote validation result:', quoteResult.success ? 'PASS' : 'FAIL');

console.log('Validation tests complete!');
