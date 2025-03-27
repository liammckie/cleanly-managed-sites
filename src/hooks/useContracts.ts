
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord } from '@/lib/types';
import { toast } from 'sonner';

interface ContractSummary {
  activeCount: number;
  totalCount: number;
  totalValue: number;
  averageValue: number;
  expiringCount: number;
}

export function useContracts() {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractSummary, setContractSummary] = useState<ContractSummary>({
    activeCount: 0,
    totalCount: 0,
    totalValue: 0,
    averageValue: 0,
    expiringCount: 0
  });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('sites')
          .select('*, client:clients(name)')
          .order('name', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Transform and enrich the data
        const transformedData: SiteRecord[] = data.map(site => {
          return {
            ...site,
            client_name: site.client?.name || 'Unknown Client',
            status: site.status as SiteRecord['status'] // Ensure status is the correct type
          };
        });

        setSites(transformedData);

        // Calculate contract summary statistics
        const now = new Date();
        const in30Days = new Date();
        in30Days.setDate(now.getDate() + 30);

        const activeSites = transformedData.filter(site => site.status === 'active');
        const totalMonthlyRevenue = activeSites.reduce((sum, site) => sum + (site.monthly_revenue || 0), 0);
        
        // Count contracts expiring soon
        let expiringCount = 0;
        activeSites.forEach(site => {
          // Safely check for contract_details and parse end date
          if (site.contract_details) {
            // Handle different formats of contract_details
            const contractDetails = typeof site.contract_details === 'string' 
              ? JSON.parse(site.contract_details) 
              : site.contract_details;
            
            if (contractDetails && 'endDate' in contractDetails) {
              const endDateStr = contractDetails.endDate as string;
              if (endDateStr) {
                const endDate = new Date(endDateStr);
                if (endDate > now && endDate <= in30Days) {
                  expiringCount++;
                }
              }
            }
          }
        });

        setContractSummary({
          activeCount: activeSites.length,
          totalCount: transformedData.length,
          totalValue: totalMonthlyRevenue,
          averageValue: activeSites.length > 0 ? totalMonthlyRevenue / activeSites.length : 0,
          expiringCount
        });
      } catch (err: any) {
        console.error('Error fetching contracts:', err);
        setError(err.message || 'Failed to load contracts');
        toast.error('Failed to load contracts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return { sites, isLoading, error, contractSummary };
}
