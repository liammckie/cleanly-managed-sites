
export interface ReplenishableSupply {
  id: string;
  name: string;
  quantity?: number;
  notes?: string;
}

export interface Replenishables {
  stock: string[];
  contactDetails: string;
  supplies?: ReplenishableSupply[];
  notes?: string;
}
