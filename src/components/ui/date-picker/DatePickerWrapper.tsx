
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

export interface DatePickerWrapperProps {
  value: Date;
  onChange: (date: Date) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePickerWrapper({
  value,
  onChange,
  id,
  label,
  placeholder,
  disabled,
  className
}: DatePickerWrapperProps) {
  // Convert the props to what DatePicker expects
  return (
    <div className={cn(className)}>
      <DatePicker
        date={value}
        onSelect={onChange}
        disabled={disabled}
      />
    </div>
  );
}
