
import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ContractDashboard } from '@/components/sites/contract/ContractDashboard';
import { useSites } from '@/hooks/useSites';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ViewToggle } from '@/components/ui/data-table/ViewToggle';
import { TabulatorView } from '@/components/ui/data-table/TabulatorView';

const Contracts = () => {
  const { sites, isLoading, error } = useSites();
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Prepare sites data for tabulator view
  const contractsData = sites
    .filter(site => site.contract_details)
    .map(site => {
      const contractDetails = site.contract_details || {};
      return {
        id: site.id,
        site_name: site.name,
        client_id: site.client_id,
        contract_start: contractDetails.start_date,
        contract_end: contractDetails.end_date,
        contract_type: contractDetails.contract_type || 'Unknown',
        renewal_type: contractDetails.renewal_type || 'Unknown',
        contract_value: site.monthly_revenue ? site.monthly_revenue * 12 : 0,
        monthly_value: site.monthly_revenue || 0,
        contract_status: contractDetails.status || 'Unknown',
        notice_period: contractDetails.notice_period || 'Unknown',
        auto_renewal: contractDetails.auto_renewal || false
      };
    });

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns for tabulator
  const tabulatorColumns = [
    { title: "Site Name", field: "site_name", headerFilter: true, sorter: "string", width: 200 },
    { 
      title: "Contract Type", 
      field: "contract_type", 
      headerFilter: true
    },
    { 
      title: "Contract Start", 
      field: "contract_start", 
      sorter: "date",
      formatter: (cell: any) => formatDate(cell.getValue())
    },
    { 
      title: "Contract End", 
      field: "contract_end", 
      sorter: "date",
      formatter: (cell: any) => formatDate(cell.getValue())
    },
    { 
      title: "Renewal Type", 
      field: "renewal_type", 
      headerFilter: true
    },
    { 
      title: "Auto Renewal", 
      field: "auto_renewal", 
      formatter: "tickCross",
      formatterParams: { allowEmpty: true }
    },
    { 
      title: "Notice Period", 
      field: "notice_period"
    },
    { 
      title: "Monthly Value", 
      field: "monthly_value", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Annual Value", 
      field: "contract_value", 
      formatter: "money", 
      formatterParams: { precision: 2, symbol: "$" },
      sorter: "number",
      bottomCalc: "sum",
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2, symbol: "$" }
    },
    { 
      title: "Actions", 
      formatter: "html", 
      width: 120,
      formatterParams: {
        html: (cell: any) => `<a href="/sites/${cell.getData().id}" class="text-primary hover:underline">View Site</a>`
      }
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center text-destructive">
                <h3 className="text-xl font-semibold mb-2">Error Loading Sites</h3>
                <p>{error.message || 'Unable to load site data'}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Contracts</h1>
                  <ViewToggle view={view} onViewChange={setView} />
                </div>
                
                {view === 'grid' ? (
                  <ContractDashboard sites={sites} isLoading={isLoading} />
                ) : (
                  <TabulatorView 
                    data={contractsData}
                    columns={tabulatorColumns}
                    title="Contracts"
                    initialSort={[{ column: "contract_end", dir: "asc" }]}
                    groupBy={["contract_type", "renewal_type"]}
                    filename="contracts-export"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contracts;
