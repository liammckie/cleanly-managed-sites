
import { useState, useEffect } from 'react';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export function useSiteFormAdditionalContracts() {
  const [additionalContracts, setAdditionalContracts] = useState<ContractDetails[]>([]);

  const addContract = () => {
    setAdditionalContracts(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 11),
        contractNumber: '',
        startDate: '',
        endDate: '',
        contractType: 'service',
        value: 0,
        billingCycle: 'monthly',
        autoRenewal: false,
        renewalTerms: '',
        terminationPeriod: '',
        renewalPeriod: '12', // Store as string to match ContractDetails type
        contractLength: 12,
        contractLengthUnit: 'months',
        notes: ''
      }
    ]);
  };

  const updateContract = (id: string, field: keyof ContractDetails, value: any) => {
    setAdditionalContracts(prev => 
      prev.map(contract => 
        contract.id === id ? { ...contract, [field]: value } : contract
      )
    );
  };

  const removeContract = (id: string) => {
    setAdditionalContracts(prev => prev.filter(contract => contract.id !== id));
  };

  return {
    additionalContracts,
    addContract,
    updateContract,
    removeContract,
    setAdditionalContracts
  };
}
