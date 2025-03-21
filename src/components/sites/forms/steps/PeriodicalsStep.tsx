
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
import { SiteFormData } from '../siteFormTypes';

interface PeriodicalsStepProps {
  formData: SiteFormData;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
}

export function PeriodicalsStep({ formData, handleDoubleNestedChange }: PeriodicalsStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Window Cleaning</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="window-frequency">Frequency</Label>
            <Select 
              value={formData.periodicals.windowCleaning.frequency} 
              onValueChange={(value) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'frequency', value)}
            >
              <SelectTrigger id="window-frequency" className="glass-input">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="window-last-completed">Last Completed</Label>
              <Input
                id="window-last-completed"
                type="date"
                value={formData.periodicals.windowCleaning.lastCompleted}
                onChange={(e) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'lastCompleted', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="window-next-scheduled">Next Scheduled</Label>
              <Input
                id="window-next-scheduled"
                type="date"
                value={formData.periodicals.windowCleaning.nextScheduled}
                onChange={(e) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'nextScheduled', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Steam Cleaning</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="steam-charges">Charges</Label>
            <Input
              id="steam-charges"
              placeholder="Enter charges (e.g. $250 per session)"
              value={formData.periodicals.steamCleaning.charges}
              onChange={(e) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'charges', e.target.value)}
              className="glass-input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steam-frequency">Frequency</Label>
              <Select 
                value={formData.periodicals.steamCleaning.frequency} 
                onValueChange={(value) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'frequency', value)}
              >
                <SelectTrigger id="steam-frequency" className="glass-input">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="as-needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="steam-last-completed">Last Completed</Label>
              <Input
                id="steam-last-completed"
                type="date"
                value={formData.periodicals.steamCleaning.lastCompleted}
                onChange={(e) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'lastCompleted', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
