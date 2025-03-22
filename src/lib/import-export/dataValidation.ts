
import { supabase } from '../supabase';

// Generate unique identifier for imported data
export const generateImportId = (item: any, type: 'clients' | 'sites' | 'contracts'): string => {
  switch (type) {
    case 'clients':
      // Try to identify client by custom_id first, then by name + contact
      return item.custom_id || `${item.name}-${item.contact_name}`;
    case 'sites':
      // Try to identify site by custom_id first, then by name + client_id
      return item.custom_id || `${item.name}-${item.client_id}`;
    case 'contracts':
      // Identify contract by site_id + contract number or start date
      return `${item.site_id}-${item.contract_details?.contractNumber || item.contract_details?.startDate}`;
    default:
      return '';
  }
};

// Check if an item already exists in the database based on identifying fields
export const checkExistingItems = async (
  items: any[], 
  type: 'clients' | 'sites' | 'contracts'
): Promise<{ existing: any[], new: any[] }> => {
  const result = { existing: [], new: [] };
  
  if (items.length === 0) return result;
  
  switch (type) {
    case 'clients': {
      // Get all custom_ids first
      const customIds = items
        .filter(item => item.custom_id)
        .map(item => item.custom_id);
      
      // Query clients with matching custom_ids
      if (customIds.length > 0) {
        const { data: existingByCustomId } = await supabase
          .from('clients')
          .select('id, custom_id, name, contact_name')
          .in('custom_id', customIds);
        
        if (existingByCustomId && existingByCustomId.length > 0) {
          const existingCustomIds = existingByCustomId.map(item => item.custom_id);
          
          // Add existing clients to the result
          existingByCustomId.forEach(existing => {
            const matchingItem = items.find(item => item.custom_id === existing.custom_id);
            if (matchingItem) {
              result.existing.push({
                ...matchingItem,
                id: existing.id,
                _isExisting: true
              });
            }
          });
          
          // Add remaining items that don't have a matching custom_id
          items
            .filter(item => !existingCustomIds.includes(item.custom_id))
            .forEach(item => result.new.push(item));
        } else {
          // If no matching custom_ids, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no custom_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    case 'sites': {
      // Similar logic for sites
      const customIds = items
        .filter(item => item.custom_id)
        .map(item => item.custom_id);
      
      if (customIds.length > 0) {
        const { data: existingByCustomId } = await supabase
          .from('sites')
          .select('id, custom_id, name, client_id')
          .in('custom_id', customIds);
        
        if (existingByCustomId && existingByCustomId.length > 0) {
          const existingCustomIds = existingByCustomId.map(item => item.custom_id);
          
          // Add existing sites to the result
          existingByCustomId.forEach(existing => {
            const matchingItem = items.find(item => item.custom_id === existing.custom_id);
            if (matchingItem) {
              result.existing.push({
                ...matchingItem,
                id: existing.id,
                _isExisting: true
              });
            }
          });
          
          // Add remaining items that don't have a matching custom_id
          items
            .filter(item => !existingCustomIds.includes(item.custom_id))
            .forEach(item => result.new.push(item));
        } else {
          // If no matching custom_ids, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no custom_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    case 'contracts': {
      // For contracts, we need to check site_id and contract details
      const siteIds = [...new Set(items.map(item => item.site_id))];
      
      if (siteIds.length > 0) {
        const { data: existingContracts } = await supabase
          .from('site_contract_history')
          .select('id, site_id, contract_details')
          .in('site_id', siteIds);
        
        if (existingContracts && existingContracts.length > 0) {
          // Check for matching contracts by site_id and contract number
          items.forEach(item => {
            const matchingContract = existingContracts.find(existing => {
              // Type checking to avoid the error
              if (existing.site_id === item.site_id) {
                // Safely access contract_details.contractNumber
                const existingContractNumber = typeof existing.contract_details === 'object' && 
                  existing.contract_details !== null ? 
                  (existing.contract_details as any).contractNumber : 
                  undefined;
                
                const itemContractNumber = item.contract_details && 
                  typeof item.contract_details === 'object' ? 
                  (item.contract_details as any).contractNumber : 
                  undefined;
                
                return existingContractNumber === itemContractNumber;
              }
              return false;
            });
            
            if (matchingContract) {
              result.existing.push({
                ...item,
                id: matchingContract.id,
                _isExisting: true
              });
            } else {
              result.new.push(item);
            }
          });
        } else {
          // If no matching contracts, all items are new
          items.forEach(item => result.new.push(item));
        }
      } else {
        // If no site_ids, all items are new
        items.forEach(item => result.new.push(item));
      }
      break;
    }
    
    default:
      items.forEach(item => result.new.push(item));
  }
  
  return result;
};

// Merge imported data with existing data
export const mergeImportData = (
  importedData: any[], 
  existingItems: any[]
): any[] => {
  // Create a map of existing items by ID for quick lookup
  const existingMap = new Map(existingItems.map(item => [item.id, item]));
  
  // Process imported data to update existing items or add new ones
  return importedData.map(importedItem => {
    // If the imported item has an ID and it exists in our map
    if (importedItem.id && existingMap.has(importedItem.id)) {
      const existingItem = existingMap.get(importedItem.id);
      // Merge the imported item with the existing one
      return {
        ...existingItem,
        ...importedItem,
        _isExisting: true // Flag to indicate this is an update, not an insert
      };
    }
    // Return the imported item as is (for new items)
    return importedItem;
  });
};

// Data validation functions
export const validateClientData = (importedClients: any[]): importedClients is ClientRecord[] => {
  return Array.isArray(importedClients) && 
    importedClients.every(client => 
      typeof client === 'object' && 
      client !== null &&
      'name' in client &&
      'contact_name' in client
    );
};

export const validateSiteData = (importedSites: any[]): importedSites is SiteRecord[] => {
  return Array.isArray(importedSites) && 
    importedSites.every(site => 
      typeof site === 'object' && 
      site !== null &&
      'name' in site &&
      'address' in site
    );
};

export const validateContractData = (importedContracts: any[]): importedContracts is ContractHistoryEntry[] => {
  return Array.isArray(importedContracts) && 
    importedContracts.every(contract => 
      typeof contract === 'object' && 
      contract !== null &&
      'site_id' in contract
    );
};
