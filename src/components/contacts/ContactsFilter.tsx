import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { 
  Search, 
  Filter, 
  X, 
  ListFilter,
  ArrowDownAZ, 
  ArrowUpZA,
  RotateCcw
} from 'lucide-react';
import { ContactFilters } from '@/hooks/useContacts';
import { Badge } from '@/components/ui/badge';

interface ContactsFilterProps {
  filters: ContactFilters;
  onFilterChange: (filters: ContactFilters) => void;
  availableRoles: string[];
  availableDepartments: string[];
}

export function ContactsFilter({ 
  filters, 
  onFilterChange,
  availableRoles = [],
  availableDepartments = []
}: ContactsFilterProps) {
  const form = useForm<ContactFilters>({
    defaultValues: filters
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };

  const handleSortChange = (field: string) => {
    const direction = 
      filters.sortBy === field && filters.sortDirection === 'asc' 
        ? 'desc' 
        : 'asc';

    onFilterChange({
      ...filters,
      sortBy: field,
      sortDirection: direction
    });
  };

  const handleFilterSubmit = (data: ContactFilters) => {
    onFilterChange(data);
  };

  const resetFilters = () => {
    onFilterChange({
      search: filters.search, // Preserve search
      entityType: filters.entityType // Preserve entity type
    });
    form.reset({
      search: filters.search,
      entityType: filters.entityType
    });
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    return (
      key !== 'search' && 
      key !== 'entityType' && 
      key !== 'sortBy' && 
      key !== 'sortDirection' && 
      filters[key as keyof ContactFilters] !== undefined
    );
  }).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-9"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>

        <Button
          variant={filters.isPrimary ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange({
            ...filters,
            isPrimary: filters.isPrimary ? undefined : true
          })}
          className="h-10"
        >
          Primary Only
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange('name')}
          className="h-10"
        >
          Name {filters.sortBy === 'name' && (
            filters.sortDirection === 'asc' ? <ArrowDownAZ className="ml-1 h-4 w-4" /> : <ArrowUpZA className="ml-1 h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange('created_at')}
          className="h-10"
        >
          Date {filters.sortBy === 'created_at' && (
            filters.sortDirection === 'asc' ? <ArrowDownAZ className="ml-1 h-4 w-4" /> : <ArrowUpZA className="ml-1 h-4 w-4" />
          )}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFilterSubmit)} className="space-y-4">
                <h4 className="font-medium">Filter Contacts</h4>
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        value={field.value || 'any-role'}
                        onValueChange={(value) => field.onChange(value === 'any-role' ? undefined : value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any-role">Any role</SelectItem>
                          {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        value={field.value || 'any-department'}
                        onValueChange={(value) => field.onChange(value === 'any-department' ? undefined : value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any-department">Any department</SelectItem>
                          {availableDepartments.map(department => (
                            <SelectItem key={department} value={department}>{department}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPrimary"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Primary contacts only</FormLabel>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>

        {(filters.search || activeFilterCount > 0 || filters.sortBy) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({ entityType: filters.entityType })}
            className="h-10"
          >
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="text-xs text-muted-foreground">Active filters:</div>
          {filters.role && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {filters.role}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, role: undefined })}
              />
            </Badge>
          )}
          {filters.department && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Department: {filters.department}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, department: undefined })}
              />
            </Badge>
          )}
          {filters.isPrimary && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Primary Only
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFilterChange({ ...filters, isPrimary: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
