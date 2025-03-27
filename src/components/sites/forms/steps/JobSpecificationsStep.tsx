import React from 'react';

export function JobSpecificationsStep() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Job Specifications</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="daysPerWeek" className="text-sm font-medium">
              Days Per Week
            </label>
            <input
              id="daysPerWeek"
              type="number"
              min="1"
              max="7"
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 5"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="hoursPerDay" className="text-sm font-medium">
              Hours Per Day
            </label>
            <input
              id="hoursPerDay"
              type="number"
              min="0.5"
              step="0.5"
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 8"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="cleaningFrequency" className="text-sm font-medium">
              Cleaning Frequency
            </label>
            <select
              id="cleaningFrequency"
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="directEmployees" className="text-sm font-medium">
              Number of Direct Employees
            </label>
            <input
              id="directEmployees"
              type="number"
              min="0"
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="serviceDays" className="text-sm font-medium">
            Service Days
          </label>
          <input
            id="serviceDays"
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Monday, Wednesday, Friday"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="serviceTime" className="text-sm font-medium">
            Service Time
          </label>
          <input
            id="serviceTime"
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 6:00 PM - 8:00 PM"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="estimatedHours" className="text-sm font-medium">
            Estimated Hours
          </label>
          <input
            id="estimatedHours"
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 10 hours per week"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="equipmentRequired" className="text-sm font-medium">
            Equipment Required
          </label>
          <input
            id="equipmentRequired"
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Vacuum, mop, cleaning supplies"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="scopeNotes" className="text-sm font-medium">
            Scope Notes
          </label>
          <textarea
            id="scopeNotes"
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Enter detailed scope of work..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="weeklyContractorCost" className="text-sm font-medium">
              Weekly Contractor Cost
            </label>
            <input
              id="weeklyContractorCost"
              type="number"
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
              placeholder="$0.00"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="monthlyContractorCost" className="text-sm font-medium">
              Monthly Contractor Cost
            </label>
            <input
              id="monthlyContractorCost"
              type="number"
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
              placeholder="$0.00"
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="annualContractorCost" className="text-sm font-medium">
              Annual Contractor Cost
            </label>
            <input
              id="annualContractorCost"
              type="number"
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
              placeholder="$0.00"
              disabled
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full p-2 border rounded-md"
            placeholder="Any additional notes about job specifications..."
          />
        </div>
      </div>
    </div>
  );
}
