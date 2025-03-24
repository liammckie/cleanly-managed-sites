
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Quote } from '@/lib/award/types';

// Mock data for development
const mockQuotes: Quote[] = [
  {
    id: '1',
    name: 'XYZ Office Building',
    clientName: 'XYZ Corporation',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user1',
    shifts: [],
    subcontractors: [],
    overheadProfile: 'standard',
    overheadPercentage: 15,
    marginPercentage: 20,
    laborCost: 1200,
    overheadCost: 180,
    subcontractorCost: 0,
    totalCost: 1380,
    marginAmount: 276,
    totalPrice: 1656,
    version: 1
  }
];

// Fetch all quotes
export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      // In a real app, this would be an API call
      // return await fetch('/api/quotes').then(res => res.json());
      
      // For now, return mock data
      return mockQuotes;
    }
  });
}

// Fetch a single quote by ID
export function useQuote(quoteId: string) {
  return useQuery({
    queryKey: ['quotes', quoteId],
    queryFn: async () => {
      // In a real app, this would be an API call
      // return await fetch(`/api/quotes/${quoteId}`).then(res => res.json());
      
      // For now, return from mock data
      const quote = mockQuotes.find(q => q.id === quoteId);
      if (!quote) {
        throw new Error('Quote not found');
      }
      return quote;
    },
    enabled: !!quoteId
  });
}

// Create a new quote
export function useCreateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
      // In a real app, this would be an API call
      // return await fetch('/api/quotes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quoteData)
      // }).then(res => res.json());
      
      // For now, simulate by adding to mock data
      const newQuote: Quote = {
        ...quoteData,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      
      mockQuotes.push(newQuote);
      return newQuote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote created successfully');
    },
    onError: (error) => {
      toast.error(`Error creating quote: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

// Update an existing quote
export function useUpdateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quoteData: Quote) => {
      // In a real app, this would be an API call
      // return await fetch(`/api/quotes/${quoteData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quoteData)
      // }).then(res => res.json());
      
      // For now, simulate by updating mock data
      const index = mockQuotes.findIndex(q => q.id === quoteData.id);
      if (index === -1) {
        throw new Error('Quote not found');
      }
      
      const updatedQuote: Quote = {
        ...quoteData,
        updatedAt: new Date().toISOString(),
        version: quoteData.version + 1,
        versionHistory: [
          ...(quoteData.versionHistory || []),
          {
            version: quoteData.version,
            updatedAt: quoteData.updatedAt,
            updatedBy: quoteData.createdBy,
            changes: 'Quote updated'
          }
        ]
      };
      
      mockQuotes[index] = updatedQuote;
      return updatedQuote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quotes', data.id] });
      toast.success('Quote updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating quote: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

// Delete a quote
export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quoteId: string) => {
      // In a real app, this would be an API call
      // return await fetch(`/api/quotes/${quoteId}`, {
      //   method: 'DELETE'
      // }).then(res => res.json());
      
      // For now, simulate by removing from mock data
      const index = mockQuotes.findIndex(q => q.id === quoteId);
      if (index === -1) {
        throw new Error('Quote not found');
      }
      
      mockQuotes.splice(index, 1);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error deleting quote: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

// Hook for managing allowances
export function useAllowances() {
  return useQuery({
    queryKey: ['allowances'],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, return hardcoded allowances
      return [
        {
          id: 'broken-shift',
          type: 'broken-shift',
          name: 'Broken shift allowance',
          amount: 17.38,
          unit: 'per-day',
          description: 'For employees who work a broken shift',
          maxPerWeek: 86.90
        },
        {
          id: 'height',
          type: 'height',
          name: 'Height allowance',
          amount: 2.60,
          unit: 'per-hour',
          description: 'For cleaning above 22nd floor exterior'
        },
        {
          id: 'cold-places',
          type: 'cold-places',
          name: 'Cold places allowance',
          amount: 0.65,
          unit: 'per-hour',
          description: 'For working in cold storage areas below 0°C'
        },
        {
          id: 'toilet-cleaning',
          type: 'toilet-cleaning',
          name: 'Toilet cleaning allowance',
          amount: 2.94,
          unit: 'per-shift',
          description: 'For employees who clean toilets'
        },
        {
          id: 'leading-hand',
          type: 'leading-hand',
          name: 'Leading hand allowance (5-10 employees)',
          amount: 1.09,
          unit: 'per-hour',
          description: 'For employees supervising 5-10 cleaners'
        },
        {
          id: 'vehicle-mileage',
          type: 'vehicle-mileage',
          name: 'Vehicle mileage allowance',
          amount: 0.91,
          unit: 'per-km',
          description: 'For using personal vehicle for work purposes'
        }
      ];
    }
  });
}

// Hook for managing overhead profiles
export function useOverheadProfiles() {
  return useQuery({
    queryKey: ['overhead-profiles'],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, return hardcoded profiles
      return [
        {
          id: 'standard',
          name: 'Standard Overhead',
          laborPercentage: 15,
          suppliesCostPerHour: 2.0,
          equipmentCostPerHour: 1.5,
          additionalCosts: []
        },
        {
          id: 'high-security',
          name: 'High Security Site',
          laborPercentage: 18,
          suppliesCostPerHour: 2.5,
          equipmentCostPerHour: 2.0,
          additionalCosts: [
            {
              name: 'Security Clearance',
              amount: 250,
              type: 'fixed'
            }
          ]
        },
        {
          id: 'medical',
          name: 'Medical Facility',
          laborPercentage: 20,
          suppliesCostPerHour: 4.0,
          equipmentCostPerHour: 2.5,
          additionalCosts: [
            {
              name: 'Specialized Cleaning Agents',
              amount: 3,
              type: 'fixed'
            },
            {
              name: 'Compliance Training',
              amount: 175,
              type: 'fixed'
            }
          ]
        }
      ];
    }
  });
}
