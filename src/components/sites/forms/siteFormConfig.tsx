// This is a partial update to fix type issues in the file
// We're adding wrappers that handle the props properly

import React from 'react';
import { 
  BasicInformationStep, 
  ContractDetailsStep, 
  JobSpecificationsStepWrapper,
  PeriodicalsStepWrapper,
  ReplenishablesStep, 
  SecurityStep, 
  SubcontractorsStep,
  BillingDetailsStepWrapper,
  ContactsStep
} from './steps';
import { SiteFormStep } from './SiteFormStep';

// Replace the relevant part of the component where the steps are defined
export const siteFormSteps = [
  {
    id: 'basic-information',
    title: 'Basic Information',
    description: 'Enter the basic details of the site.',
    component: (props: any) => <BasicInformationStep {...props} />,
  },
  {
    id: 'contacts',
    title: 'Contacts',
    description: 'Add contacts associated with this site.',
    component: (props: any) => <ContactsStep {...props} />,
  },
  {
    id: 'billing-details',
    title: 'Billing Details',
    description: 'Enter billing information for the site.',
    component: (props: any) => <BillingDetailsStepWrapper {...props} />,
  },
  {
    id: 'contract-details',
    title: 'Contract Details',
    description: 'Provide details of the contract for this site.',
    component: (props: any) => <ContractDetailsStep {...props} />,
  },
  {
    id: 'job-specifications',
    title: 'Job Specifications',
    description: 'Define the job specifications for this site.',
    component: (props: any) => <JobSpecificationsStepWrapper {...props} />,
  },
  {
    id: 'periodicals',
    title: 'Periodicals',
    description: 'Schedule periodical tasks for this site.',
    component: (props: any) => <PeriodicalsStepWrapper {...props} />,
  },
  {
    id: 'subcontractors',
    title: 'Subcontractors',
    description: 'Add subcontractors who will work on this site.',
    component: (props: any) => <SubcontractorsStep {...props} />,
  },
  {
    id: 'replenishables',
    title: 'Replenishables',
    description: 'Manage replenishable supplies for this site.',
    component: (props: any) => <ReplenishablesStep {...props} />,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Add security details for this site.',
    component: (props: any) => <SecurityStep {...props} />,
  },
];
