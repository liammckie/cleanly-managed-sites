
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Sample allowances data - in a real app, this would come from an API
const SAMPLE_ALLOWANCES = [
  {
    id: 'broken-shift',
    name: 'Broken Shift Allowance',
    amount: 17.51,
    unit: 'per-day',
    description: 'For shifts with a break longer than 1 hour (excluding meal breaks)'
  },
  {
    id: 'height',
    name: 'Height Allowance',
    amount: 0.85,
    unit: 'per-hour',
    description: 'For cleaning at height over 30 feet'
  },
  {
    id: 'cold-places',
    name: 'Cold Places Allowance',
    amount: 0.70,
    unit: 'per-hour',
    description: 'For working in cold rooms or freezer rooms'
  },
  {
    id: 'hot-places',
    name: 'Hot Places Allowance',
    amount: 0.70,
    unit: 'per-hour',
    description: 'For working in hot places where temperature exceeds 40°C'
  },
  {
    id: 'leading-hand',
    name: 'Leading Hand Allowance',
    amount: 1.15,
    unit: 'per-hour',
    description: 'For supervising 1-10 employees'
  },
  {
    id: 'leading-hand-large',
    name: 'Leading Hand (Large Team)',
    amount: 1.70,
    unit: 'per-hour',
    description: 'For supervising more than 10 employees'
  },
  {
    id: 'refuse-collection',
    name: 'Refuse Collection Allowance',
    amount: 3.00,
    unit: 'per-shift',
    description: 'For collecting and removing refuse/garbage'
  },
  {
    id: 'toilet-cleaning',
    name: 'Toilet Cleaning Allowance',
    amount: 2.93,
    unit: 'per-shift',
    description: 'For cleaners mainly engaged in toilet cleaning'
  },
  {
    id: 'first-aid',
    name: 'First Aid Allowance',
    amount: 15.55,
    unit: 'per-week',
    description: 'For designated first aid officers with certification'
  },
  {
    id: 'vehicle-mileage',
    name: 'Vehicle Mileage',
    amount: 0.78,
    unit: 'per-km',
    description: 'For using own vehicle for work travel'
  }
];

// Sample overhead profiles
const SAMPLE_OVERHEAD_PROFILES = [
  {
    id: 'standard',
    name: 'Standard Overhead',
    laborPercentage: 15,
    description: 'Standard overhead rate for most sites'
  },
  {
    id: 'high-security',
    name: 'High Security Site',
    laborPercentage: 18,
    description: 'Higher overhead for secure facilities with additional requirements'
  },
  {
    id: 'low-overhead',
    name: 'Low Overhead',
    laborPercentage: 12,
    description: 'Reduced overhead for simple sites with minimal requirements'
  },
  {
    id: 'custom',
    name: 'Custom',
    laborPercentage: 15,
    description: 'Customizable overhead'
  }
];

// Sample quotes for mock data
const SAMPLE_QUOTES = [
  {
    id: '1',
    name: 'Office Building Weekly Cleaning',
    clientName: 'ABC Corporation',
    siteName: 'CBD Office Tower',
    status: 'draft',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    expiryDate: '2024-12-15',
    contractLength: 12,
    contractLengthUnit: 'months',
    overheadProfile: 'standard',
    overheadPercentage: 15,
    marginPercentage: 20,
    notes: 'Weekly cleaning service for 3-floor office building',
    shifts: [],
    subcontractors: [],
    laborCost: 0,
    overheadCost: 0,
    subcontractorCost: 0,
    totalCost: 0,
    marginAmount: 0,
    totalPrice: 0,
    createdAt: '2024-11-01',
    updatedAt: '2024-11-01',
    createdBy: 'user1'
  }
];

// Mock fetch function that simulates API behavior
const fetchAllowances = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return SAMPLE_ALLOWANCES;
};

const fetchOverheadProfiles = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return SAMPLE_OVERHEAD_PROFILES;
};

const fetchQuotes = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return SAMPLE_QUOTES;
};

const fetchQuote = async (quoteId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const quote = SAMPLE_QUOTES.find(q => q.id === quoteId);
  
  if (!quote) {
    throw new Error(`Quote with ID ${quoteId} not found`);
  }
  
  return quote;
};

const createQuoteMutation = async (quoteData: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newQuote = {
    ...quoteData,
    id: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newQuote;
};

const updateQuoteMutation = async (quoteData: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...quoteData,
    updatedAt: new Date().toISOString()
  };
};

const deleteQuoteMutation = async (quoteId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true };
};

export function useAllowances() {
  return useQuery({
    queryKey: ['allowances'],
    queryFn: fetchAllowances,
  });
}

export function useOverheadProfiles() {
  return useQuery({
    queryKey: ['overhead-profiles'],
    queryFn: fetchOverheadProfiles,
  });
}

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
}

export function useQuote(quoteId: string) {
  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => fetchQuote(quoteId),
    enabled: !!quoteId,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateQuoteMutation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote', data.id] });
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteQuoteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}
