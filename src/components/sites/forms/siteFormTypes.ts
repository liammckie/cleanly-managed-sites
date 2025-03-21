
// This file is maintained for backward compatibility
// It re-exports all types from the new structure
import { SiteStatus } from '../SiteCard';
import { ContactRecord } from '@/lib/types';
import {
  WindowCleaning,
  SteamCleaning,
  Periodicals,
  JobSpecifications,
  Replenishables,
  SecurityDetails,
  Subcontractor,
  ContractDetails,
  BillingContact,
  BillingDetails,
  AdHocWorkAuthorization,
  SiteFormData,
  getInitialFormData,
  isValidEmail,
  isValidPhone,
  requiredFields
} from './types';

export type {
  WindowCleaning,
  SteamCleaning,
  Periodicals,
  JobSpecifications,
  Replenishables,
  SecurityDetails,
  Subcontractor,
  ContractDetails,
  BillingContact,
  BillingDetails,
  AdHocWorkAuthorization,
  SiteFormData
};

export {
  getInitialFormData,
  isValidEmail,
  isValidPhone,
  requiredFields
};
