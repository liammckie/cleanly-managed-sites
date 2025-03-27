
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SiteStatus } from '@/types/common';

interface StatusSelectorProps {
  value: SiteStatus;
  onChange: (value: SiteStatus) => void;
  disabled?: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <Select 
      value={value} 
      onValueChange={(val: string) => onChange(val as SiteStatus)} 
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="lost">Lost</SelectItem>
        <SelectItem value="on-hold">On Hold</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
