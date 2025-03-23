
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, LayoutGrid, Table } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'table';
  onViewChange: (view: 'grid' | 'table') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button 
        variant={view === 'grid' ? 'default' : 'outline'} 
        className="rounded-none border-0 h-8 px-3"
        size="sm"
        onClick={() => onViewChange('grid')}
      >
        <LayoutGrid size={16} className="mr-2" />
        Grid
      </Button>
      <Button 
        variant={view === 'table' ? 'default' : 'outline'} 
        className="rounded-none border-0 h-8 px-3"
        size="sm"
        onClick={() => onViewChange('table')}
      >
        <Table size={16} className="mr-2" />
        Table
      </Button>
    </div>
  );
}
