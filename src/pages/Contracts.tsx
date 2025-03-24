import React from 'react';
import { useContractForecast } from '@/hooks/useContractForecast';
import { asJsonObject } from '@/lib/utils/json';

interface ContractDetails {
  start_date: string;
  end_date: string;
  contract_number: string;
  contract_type: string;
  renewal_type: string;
  value: number;
  status: string;
  notice_period: string;
  auto_renewal: string;
}

const ContractRow = ({ details }: { details: ContractDetails }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.start_date}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.end_date}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.contract_number}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.contract_type}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.renewal_type}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.value}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.status}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.notice_period}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details.auto_renewal}</td>
  </tr>
);

export default function ContractsPage() {
  const { contractData, isLoading, groupedContracts } = useContractForecast();
  
  // Sample contract data transformation function - fixed to use asJsonObject
  const sampleTransformContractDetails = (detailsJson: any) => {
    const contractDetails = asJsonObject(detailsJson, {});
    return {
      start_date: contractDetails.startDate || 'N/A',
      end_date: contractDetails.endDate || 'N/A',
      contract_number: contractDetails.contractNumber || 'N/A',
      contract_type: contractDetails.contractType || 'Standard',
      renewal_type: contractDetails.renewalType || 'Auto',
      value: contractDetails.value || 0,
      status: contractDetails.status || 'Active',
      notice_period: contractDetails.noticePeriod || '30 days',
      auto_renewal: contractDetails.autoRenewal || 'Yes'
    };
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Contract Overview</h1>
      
      {isLoading ? (
        <p>Loading contracts...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notice Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Renewal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contractData && contractData.map((contract) => {
                const transformedDetails = sampleTransformContractDetails(contract);
                return <ContractRow key={contract.id} details={transformedDetails} />;
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
