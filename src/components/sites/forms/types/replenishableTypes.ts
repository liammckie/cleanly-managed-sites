
export interface ReplenishableItem {
  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  description?: string;
  location?: string;
  cost?: number;
}

export interface ReplenishableStock extends ReplenishableItem {
  isStockItem: true;
}

export interface ReplenishableSupplies extends ReplenishableItem {
  supplier?: string;
  orderLeadTime?: number;
}
