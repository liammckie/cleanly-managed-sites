
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddressInformationProps {
  formData: {
    address: string;
    city: string;
    state: string;
    postcode: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function AddressInformation({ 
  formData, 
  handleChange,
  handleSelectChange
}: AddressInformationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter street address"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select 
            value={formData.state} 
            onValueChange={(value) => handleSelectChange('state', value)}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a state</SelectItem>
              <SelectItem value="NSW">New South Wales</SelectItem>
              <SelectItem value="VIC">Victoria</SelectItem>
              <SelectItem value="QLD">Queensland</SelectItem>
              <SelectItem value="WA">Western Australia</SelectItem>
              <SelectItem value="SA">South Australia</SelectItem>
              <SelectItem value="TAS">Tasmania</SelectItem>
              <SelectItem value="ACT">Australian Capital Territory</SelectItem>
              <SelectItem value="NT">Northern Territory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="Enter postcode"
          />
        </div>
      </div>
    </div>
  );
}
