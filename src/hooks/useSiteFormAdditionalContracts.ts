
import { useState, useEffect } from 'react';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { fetchAdditionalContracts } from '@/lib/api/sites/additionalContractsApi';

export const useSiteFormAdditionalContracts = (siteId?: string) => {
  const [additionalContracts, setAdditionalContracts] = useState<ContractDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addContract = (contract: ContractDetails) => {
    // Ensure renewalPeriod is a string
    const contractWithStringRenewalPeriod = {
      ...contract,
      renewalPeriod: contract.renewalPeriod ? String(contract.renewalPeriod) : undefined
    };
    
    setAdditionalContracts(prev => [...prev, contractWithStringRenewalPeriod]);
  };

  const updateContract = (contractId: string, updatedContract: Partial<ContractDetails>) => {
    // Ensure renewalPeriod is a string
    const contractWithStringRenewalPeriod = {
      ...updatedContract,
      renewalPeriod: updatedContract.renewalPeriod ? String(updatedContract.renewalPeriod) : undefined
    };
    
    setAdditionalContracts(prev => 
      prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, ...contractWithStringRenewalPeriod } 
          : contract
      )
    );
  };

  const removeContract = (contractId: string) => {
    setAdditionalContracts(prev => prev.filter(contract => contract.id !== contractId));
  };

  useEffect(() => {
    const loadContracts = async () => {
      if (!siteId) {
        setAdditionalContracts([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const contracts = await fetchAdditionalContracts(siteId);
        setAdditionalContracts(contracts);
      } catch (err) {
        console.error('Error loading additional contracts:', err);
        setError(err instanceof Error ? err : new Error('Failed to load contracts'));
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [siteId]);

  return {
    additionalContracts,
    loading,
    error,
    addContract,
    updateContract,
    removeContract
  };
};

export default useSiteFormAdditionalContracts;
