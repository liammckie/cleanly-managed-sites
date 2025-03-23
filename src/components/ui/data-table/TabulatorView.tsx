
import React, { useState, useEffect, useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Group, 
  Layers, 
  SortAsc, 
  Columns,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const tabulatorRef = useRef<any>(null);

  // Initialize table data and columns
  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(data);
      
      // Initialize visible columns
      if (Object.keys(visibleColumns).length === 0) {
        const initialVisibleColumns: Record<string, boolean> = {};
        columns.forEach(col => {
          initialVisibleColumns[col.field] = true;
        });
        setVisibleColumns(initialVisibleColumns);
      }
      
      const filteredColumns = columns.filter(col => visibleColumns[col.field] !== false);
      setTableColumns(filteredColumns);
    }
  }, [data, columns, visibleColumns]);

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
    movableRows: true,
    columnHeaderVertAlign: "middle",
    dataTree: false,
    dataTreeStartExpanded: false,
    footerElement: '<div class="tabulator-footer-contents"></div>',
  };

  // Toggle group by column
  const toggleGroup = (column: string) => {
    if (activeGroups.includes(column)) {
      setActiveGroups(activeGroups.filter(col => col !== column));
    } else {
      setActiveGroups([...activeGroups, column]);
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (field: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Export as CSV
  const downloadCSV = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.table.download("csv", `${filename}.csv`);
    }
  };

  // Reset columns to default
  const resetColumns = () => {
    const defaultVisibleColumns: Record<string, boolean> = {};
    columns.forEach(col => {
      defaultVisibleColumns[col.field] = true;
    });
    setVisibleColumns(defaultVisibleColumns);
    setActiveGroups([]);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Column selector dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
              >
                <Columns className="mr-1 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-[200px]">
              {columns.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.field}
                  checked={visibleColumns[col.field] !== false}
                  onCheckedChange={() => toggleColumnVisibility(col.field)}
                >
                  {col.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Group by selector */}
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
          
          {/* Reset columns button */}
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={resetColumns}
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Reset
          </Button>
          
          {/* Export CSV button */}
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
            ref={tabulatorRef}
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
