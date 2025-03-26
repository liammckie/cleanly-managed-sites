
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, label, disabled }: TimePickerProps) {
  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
