
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReplenishableItem, ReplenishableSupplies } from '@/components/sites/forms/types/replenishableTypes';

export function useSiteFormReplenishables() {
  const [stockItems, setStockItems] = useState<ReplenishableItem[]>([]);
  const [supplies, setSupplies] = useState<ReplenishableSupplies[]>([]);

  const addStockItem = () => {
    const newItem: ReplenishableItem = {
      id: uuidv4(),
      name: '',
      quantity: 0,
      reorderLevel: 0,
      unit: 'ea',
      description: ''
    };
    setStockItems(prev => [...prev, newItem]);
  };

  const addSupply = () => {
    const newSupply: ReplenishableSupplies = {
      id: uuidv4(),
      name: '',
      quantity: 0,
      reorderLevel: 0,
      unit: 'ea',
      description: '',
      isStockItem: true,
      supplier: '',
      orderLeadTime: 7
    };
    setSupplies(prev => [...prev, newSupply]);
  };

  const updateStockItem = (index: number, field: keyof ReplenishableItem, value: any) => {
    setStockItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateSupply = (index: number, field: keyof ReplenishableSupplies, value: any) => {
    setSupplies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeStockItem = (index: number) => {
    setStockItems(prev => prev.filter((_, i) => i !== index));
  };

  const removeSupply = (index: number) => {
    setSupplies(prev => prev.filter((_, i) => i !== index));
  };

  return {
    stockItems,
    supplies,
    addStockItem,
    addSupply,
    updateStockItem,
    updateSupply,
    removeStockItem,
    removeSupply
  };
}
