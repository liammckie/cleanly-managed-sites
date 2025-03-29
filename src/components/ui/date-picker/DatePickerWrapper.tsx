
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DatePickerWrapperProps {
  value?: Date | null;
  onChange: (date?: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePickerWrapper({
  value,
  onChange,
  placeholder = "Select a date",
  className,
  disabled = false
}: DatePickerWrapperProps) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}
