
import { Json } from '@/types/common';

export function parseContractData(data: string | Json | null): any {
  if (!data) return null;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing contract data:', error);
    return null;
  }
}

export function formatContractData(data: any): Json {
  if (!data) return null;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data) as Json;
    }
    
    return data as Json;
  } catch (error) {
    console.error('Error formatting contract data:', error);
    return null;
  }
}
