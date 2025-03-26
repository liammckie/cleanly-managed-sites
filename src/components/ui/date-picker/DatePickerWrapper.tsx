
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

export interface DatePickerWrapperProps {
  value: Date;
  onChange: (date: Date) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerWrapper({ 
  value, 
  onChange,
  id,
  label,
  placeholder,
  disabled
}: DatePickerWrapperProps) {
  // Convert the props to what DatePicker expects
  return (
    <DatePicker
      date={value}
      onSelect={onChange}
      disabled={disabled}
      // We'll use the className prop to style it according to the placeholder
      className={!value ? "text-muted-foreground" : ""}
    />
  );
}
