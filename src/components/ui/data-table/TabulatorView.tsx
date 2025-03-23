
import React, { useState, useEffect } from 'react';
import { ReactTabulator } from 'react-tabulator';
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { Button } from '@/components/ui/button';
import { Download, Group, Layers, SortAsc } from 'lucide-react';

interface TabulatorViewProps {
  data: any[];
  columns: any[];
  title: string;
  initialSort?: Array<{ column: string; dir: 'asc' | 'desc' }>;
  groupBy?: string[];
  filename?: string;
}

export function TabulatorView({
  data,
  columns,
  title,
  initialSort = [],
  groupBy = [],
  filename = 'export-data'
}: TabulatorViewProps) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [activeGroups, setActiveGroups] = useState<string[]>([]);

  // Initialize table data and columns
  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(data);
      setTableColumns(columns);
    }
  }, [data, columns]);

  // Tabulator options
  const options = {
    layout: "fitColumns",
    responsiveLayout: "collapse",
    pagination: "local",
    paginationSize: 20,
    paginationSizeSelector: [10, 20, 50, 100],
    movableColumns: true,
    initialSort: initialSort,
    groupBy: activeGroups,
    groupStartOpen: false,
    placeholder: "No Data Available",
  };

  // Toggle group by column
  const toggleGroup = (column: string) => {
    if (activeGroups.includes(column)) {
      setActiveGroups(activeGroups.filter(col => col !== column));
    } else {
      setActiveGroups([...activeGroups, column]);
    }
  };

  // Export as CSV
  const downloadCSV = () => {
    if (window.tabulator) {
      (window.tabulator as any).download("csv", `${filename}.csv`);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        
        <div className="flex flex-wrap gap-2">
          {groupBy.length > 0 && (
            <div className="flex gap-2 items-center border rounded-md p-1">
              <span className="text-xs text-muted-foreground px-2">Group by:</span>
              {groupBy.map(column => (
                <Button
                  key={column}
                  size="sm"
                  variant={activeGroups.includes(column) ? "default" : "outline"}
                  className="text-xs h-8"
                  onClick={() => toggleGroup(column)}
                >
                  <Group className="mr-1 h-3 w-3" />
                  {column}
                </Button>
              ))}
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={downloadCSV}
          >
            <Download className="mr-1 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {tableData.length > 0 && (
          <ReactTabulator
            data={tableData}
            columns={tableColumns}
            options={options}
            className="tabulator-table"
          />
        )}
      </div>
    </div>
  );
}

// Add to Window interface
declare global {
  interface Window {
    tabulator: any;
  }
}
