
import { useQuery } from '@tanstack/react-query';

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

// Mock fetch function that simulates API behavior
const fetchAllowances = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return SAMPLE_ALLOWANCES;
};

export function useAllowances() {
  return useQuery({
    queryKey: ['allowances'],
    queryFn: fetchAllowances,
  });
}

export function useQuotes() {
  // This would connect to your quotes API in a real implementation
  return {
    isLoading: false,
    data: []
  };
}
