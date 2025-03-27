
/**
 * Types for replenishable items in site form
 */

export interface ReplenishableItem {
  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  isStockItem?: boolean;
}

export interface ReplenishableSupplies {
  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
}

export interface ReplenishableStock {
  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
}

export interface Replenishables {
  stock?: ReplenishableStock[];
  supplies?: ReplenishableSupplies[];
  notes?: string;
}
