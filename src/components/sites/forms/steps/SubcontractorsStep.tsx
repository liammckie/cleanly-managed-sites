
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormSection } from '@/components/sites/forms/FormSection';
import { Subcontractor, serviceOptions } from '@/components/sites/forms/types/subcontractorTypes';

export interface SubcontractorsStepProps {
  subcontractors: Subcontractor[];
  onSubcontractorAdd: () => void;
  onSubcontractorChange: (index: number, field: string, value: any) => void;
  onSubcontractorRemove: (index: number) => void;
  errors: Record<string, string>;
}

export function SubcontractorsStep({ 
  subcontractors, 
  onSubcontractorAdd, 
  onSubcontractorChange, 
  onSubcontractorRemove,
  errors
}: SubcontractorsStepProps) {
  return (
    <div className="space-y-6">
      <FormSection
        title="Subcontractors"
        description="Add any subcontractors that will be working on this site."
      >
        {subcontractors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No subcontractors added yet.
          </div>
        ) : (
          subcontractors.map((subcontractor, index) => (
            <div key={index} className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium">
                  {subcontractor.business_name || `Subcontractor #${index + 1}`}
                </h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onSubcontractorRemove(index)}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name</label>
                  <Input
                    value={subcontractor.business_name || ''}
                    onChange={(e) => onSubcontractorChange(index, 'business_name', e.target.value)}
                    placeholder="Enter business name"
                    className={errors[`subcontractors.${index}.business_name`] ? 'border-red-500' : ''}
                  />
                  {errors[`subcontractors.${index}.business_name`] && (
                    <p className="text-sm text-red-500 mt-1">{errors[`subcontractors.${index}.business_name`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name</label>
                  <Input
                    value={subcontractor.contact_name || ''}
                    onChange={(e) => onSubcontractorChange(index, 'contact_name', e.target.value)}
                    placeholder="Enter contact name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={subcontractor.email || ''}
                    onChange={(e) => onSubcontractorChange(index, 'email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={subcontractor.phone || ''}
                    onChange={(e) => onSubcontractorChange(index, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Services Provided</label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${index}-${service.id}`}
                        checked={(subcontractor.services || []).includes(service.id)}
                        onCheckedChange={(checked) => {
                          const services = [...(subcontractor.services || [])];
                          if (checked) {
                            if (!services.includes(service.id)) {
                              services.push(service.id);
                            }
                          } else {
                            const serviceIndex = services.indexOf(service.id);
                            if (serviceIndex > -1) {
                              services.splice(serviceIndex, 1);
                            }
                          }
                          onSubcontractorChange(index, 'services', services);
                        }}
                      />
                      <Label htmlFor={`${index}-${service.id}`}>{service.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {(subcontractor.services || []).includes('other') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Other Services</label>
                  <Input
                    value={subcontractor.customServices || ''}
                    onChange={(e) => onSubcontractorChange(index, 'customServices', e.target.value)}
                    placeholder="Describe other services"
                  />
                </div>
              )}
              
              <div className="flex flex-col space-y-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`flat-rate-${index}`}
                    checked={subcontractor.is_flat_rate !== false}
                    onCheckedChange={(checked) => onSubcontractorChange(index, 'is_flat_rate', checked)}
                  />
                  <Label htmlFor={`flat-rate-${index}`}>Flat Rate Payment</Label>
                </div>
                
                {subcontractor.is_flat_rate !== false && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Cost</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        className="pl-7"
                        type="number"
                        value={subcontractor.monthly_cost || 0}
                        onChange={(e) => onSubcontractorChange(index, 'monthly_cost', parseFloat(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={subcontractor.notes || ''}
                  onChange={(e) => onSubcontractorChange(index, 'notes', e.target.value)}
                  placeholder="Additional notes about this subcontractor"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))
        )}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSubcontractorAdd}
        >
          Add Subcontractor
        </Button>
      </FormSection>
    </div>
  );
}
