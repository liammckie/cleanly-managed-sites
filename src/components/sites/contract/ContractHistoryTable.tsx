
import React from 'react';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';
import { format } from 'date-fns';

interface ContractHistoryTableProps {
  history: ContractHistoryEntry[];
  isLoading: boolean;
  currentContractDetails: any;
}

export default function ContractHistoryTable({ 
  history, 
  isLoading, 
  currentContractDetails 
}: ContractHistoryTableProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading contract history...</div>;
  }

  if (!history || history.length === 0) {
    return <div className="text-center py-4">No contract history available</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Contract History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Version history of contract changes
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.version_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(entry.created_at), 'PPP')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {entry.notes || "No notes provided"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
