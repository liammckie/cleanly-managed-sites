
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdditionalInformationProps {
  formData: {
    status: 'active' | 'inactive' | 'pending';
    notes: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
}

export function AdditionalInformation({ 
  formData, 
  handleChange, 
  handleStatusChange 
}: AdditionalInformationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any additional notes about this client"
          rows={4}
        />
      </div>
    </div>
  );
}
