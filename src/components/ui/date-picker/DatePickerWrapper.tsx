
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DatePickerWrapperProps {
  value: Date;
  onChange: (date: Date) => void;
  id?: string; // We'll ignore this prop as it's not needed by DatePicker
}

export function DatePickerWrapper({ value, onChange }: DatePickerWrapperProps) {
  return (
    <DatePicker 
      date={value}  // Changed from 'value' to 'date' to match the DatePicker props
      onSelect={onChange}  // Changed from 'onChange' to 'onSelect' to match the DatePicker props
    />
  );
}
