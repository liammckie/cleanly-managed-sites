
import React from 'react';
import { SiteFormData } from '../siteFormTypes';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface PeriodicalsStepProps {
  formData: SiteFormData;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}

export function PeriodicalsStep({ 
  formData, 
  handleDoubleNestedChange 
}: PeriodicalsStepProps) {
  const periodicServices = formData.periodicals || {};
  
  // Initialize objects if they don't exist to prevent errors
  const carpet = periodicServices.carpet || {};
  const floor = periodicServices.floor || {};
  const windows = periodicServices.windows || {};
  const highLevel = periodicServices.highLevel || {};
  const additional = periodicServices.additional || {};
  
  const handleToggle = (section: string, field: string, value: boolean) => {
    handleDoubleNestedChange('periodicals', section, field, value);
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Carpet & Floor Maintenance</h3>
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="carpet-cleaning" className="font-medium">Carpet Cleaning</Label>
              <p className="text-sm text-muted-foreground">Regular carpet cleaning service</p>
            </div>
            <Switch 
              id="carpet-cleaning"
              checked={carpet.cleaning || false}
              onCheckedChange={(checked) => handleToggle('carpet', 'cleaning', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="carpet-shampooing" className="font-medium">Carpet Shampooing</Label>
              <p className="text-sm text-muted-foreground">Deep carpet shampooing service</p>
            </div>
            <Switch 
              id="carpet-shampooing"
              checked={carpet.shampooing || false}
              onCheckedChange={(checked) => handleToggle('carpet', 'shampooing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="floor-buffing" className="font-medium">Floor Buffing</Label>
              <p className="text-sm text-muted-foreground">Regular floor buffing and polishing</p>
            </div>
            <Switch 
              id="floor-buffing"
              checked={floor.buffing || false}
              onCheckedChange={(checked) => handleToggle('floor', 'buffing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="floor-stripping" className="font-medium">Floor Stripping & Sealing</Label>
              <p className="text-sm text-muted-foreground">Deep floor maintenance service</p>
            </div>
            <Switch 
              id="floor-stripping"
              checked={floor.stripping || false}
              onCheckedChange={(checked) => handleToggle('floor', 'stripping', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Window & High-Level Cleaning</h3>
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="window-internal" className="font-medium">Internal Windows</Label>
              <p className="text-sm text-muted-foreground">Internal window cleaning service</p>
            </div>
            <Switch 
              id="window-internal"
              checked={windows.internal || false}
              onCheckedChange={(checked) => handleToggle('windows', 'internal', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="window-external" className="font-medium">External Windows</Label>
              <p className="text-sm text-muted-foreground">External window cleaning service</p>
            </div>
            <Switch 
              id="window-external"
              checked={windows.external || false}
              onCheckedChange={(checked) => handleToggle('windows', 'external', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-dusting" className="font-medium">High-Level Dusting</Label>
              <p className="text-sm text-muted-foreground">Dusting of high and hard-to-reach areas</p>
            </div>
            <Switch 
              id="high-dusting"
              checked={highLevel.dusting || false}
              onCheckedChange={(checked) => handleToggle('highLevel', 'dusting', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Additional Periodical Services</h3>
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="upholstery-cleaning" className="font-medium">Upholstery Cleaning</Label>
              <p className="text-sm text-muted-foreground">Furniture and upholstery cleaning service</p>
            </div>
            <Switch 
              id="upholstery-cleaning"
              checked={additional.upholstery || false}
              onCheckedChange={(checked) => handleToggle('additional', 'upholstery', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pressure-washing" className="font-medium">Pressure Washing</Label>
              <p className="text-sm text-muted-foreground">External pressure washing service</p>
            </div>
            <Switch 
              id="pressure-washing"
              checked={additional.pressureWashing || false}
              onCheckedChange={(checked) => handleToggle('additional', 'pressureWashing', checked)}
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <Label htmlFor="periodicals-notes">Notes</Label>
          <Textarea
            id="periodicals-notes"
            placeholder="Add any notes about periodical services..."
            value={periodicServices.notes || ''}
            onChange={(e) => handleDoubleNestedChange('periodicals', 'notes', '', e.target.value)}
            className="glass-input"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
