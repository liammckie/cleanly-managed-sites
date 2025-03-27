import React from 'react';

export function ReplenishablesStep() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Supplies & Replenishables</h3>
      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Stock Items</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add items that are kept on-site and need to be replenished regularly.
          </p>
          <div className="space-y-2">
            {/* Stock items list would go here */}
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>No stock items added yet</span>
            </div>
          </div>
          <button 
            type="button"
            className="mt-4 text-sm text-primary hover:underline"
          >
            + Add Stock Item
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Supplies</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add supplies that need to be ordered from suppliers.
          </p>
          <div className="space-y-2">
            {/* Supplies list would go here */}
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>No supplies added yet</span>
            </div>
          </div>
          <button 
            type="button"
            className="mt-4 text-sm text-primary hover:underline"
          >
            + Add Supply
          </button>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Notes</h4>
          <textarea
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Add any notes about replenishables or supplies..."
          />
        </div>
      </div>
    </div>
  );
}
