
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ReplenishableItem, ReplenishableSupplies, ReplenishableStock } from '@/components/sites/forms/types/replenishableTypes';

export const useSiteFormReplenishables = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Generate a new empty replenishable item
  const createEmptyReplenishableItem = (): ReplenishableItem => ({
    id: uuidv4(),
    name: '',
    quantity: 0,
    reorderLevel: 0,
    unit: 'units',
    isStockItem: true,
    description: ''
  });

  // Generate a new empty replenishable supply
  const createEmptyReplenishableSupply = (): ReplenishableSupplies => ({
    id: uuidv4(),
    name: '',
    quantity: 0,
    reorderLevel: 0,
    unit: 'units',
    description: ''
  });

  // Generate a new empty stock item
  const createEmptyStockItem = (): ReplenishableStock => ({
    id: uuidv4(),
    name: '',
    quantity: 0,
    reorderLevel: 0,
    unit: 'units'
  });

  // Add a new stock item
  const addStockItem = () => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const stock = replenishables.stock || [];
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          stock: [...stock, createEmptyStockItem()]
        }
      };
    });
  };

  // Add a new supply item
  const addSupplyItem = () => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const supplies = replenishables.supplies || [];
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          supplies: [...supplies, createEmptyReplenishableSupply()]
        }
      };
    });
  };

  // Update a stock item
  const updateStockItem = (id: string, field: keyof ReplenishableStock, value: any) => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const stock = replenishables.stock || [];
      
      const updatedStock = stock.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          stock: updatedStock
        }
      };
    });
  };

  // Update a supply item
  const updateSupplyItem = (id: string, field: keyof ReplenishableSupplies, value: any) => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const supplies = replenishables.supplies || [];
      
      const updatedSupplies = supplies.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          supplies: updatedSupplies
        }
      };
    });
  };

  // Remove a stock item
  const removeStockItem = (id: string) => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const stock = replenishables.stock || [];
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          stock: stock.filter(item => item.id !== id)
        }
      };
    });
  };

  // Remove a supply item
  const removeSupplyItem = (id: string) => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      const supplies = replenishables.supplies || [];
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          supplies: supplies.filter(item => item.id !== id)
        }
      };
    });
  };

  // Update notes
  const updateNotes = (notes: string) => {
    setFormData(prev => {
      const replenishables = prev.replenishables || {};
      
      return {
        ...prev,
        replenishables: {
          ...replenishables,
          notes
        }
      };
    });
  };

  return {
    addStockItem,
    addSupplyItem,
    updateStockItem,
    updateSupplyItem,
    removeStockItem,
    removeSupplyItem,
    updateNotes,
    createEmptyReplenishableItem,
    createEmptyStockItem,
    createEmptyReplenishableSupply
  };
};
