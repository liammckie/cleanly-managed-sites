
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface PermissionCheckboxProps {
  permission: string;
  checked: boolean;
  onChange: (permission: string, checked: boolean) => void;
}

export const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({ 
  permission, 
  checked, 
  onChange 
}) => {
  const formatPermissionLabel = (permission: string) => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const handleChange = (checked: boolean) => {
    onChange(permission, checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`permission-${permission}`} 
        checked={checked} 
        onCheckedChange={handleChange}
      />
      <Label 
        htmlFor={`permission-${permission}`}
        className="text-sm cursor-pointer"
      >
        {formatPermissionLabel(permission)}
      </Label>
    </div>
  );
};

export default PermissionCheckbox;
