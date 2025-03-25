
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableFilterProps {
  value: string;
  onChange: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

export function TableFilter({ value, onChange, statusFilter, setStatusFilter }: TableFilterProps) {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' }
  ];
  
  return (
    <div className="flex gap-2">
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contracts..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-1">
            Status
            {statusFilter && (
              <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => setStatusFilter(null)}
            >
              All
              {!statusFilter && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="flex items-center justify-between"
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
                {statusFilter === option.value && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
