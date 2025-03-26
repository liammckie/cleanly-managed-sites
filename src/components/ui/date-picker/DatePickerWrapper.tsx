
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DatePickerWrapperProps {
  value: Date;
  onChange: (date: Date) => void;
  id?: string; // We'll ignore this prop as it's not needed by DatePicker
}

export function DatePickerWrapper({ value, onChange, id }: DatePickerWrapperProps) {
  return (
    <DatePicker 
      value={value} 
      onChange={onChange} 
    />
  );
}
