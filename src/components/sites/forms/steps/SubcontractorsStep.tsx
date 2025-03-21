
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SiteFormData } from '../siteFormTypes';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface SubcontractorsStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleSubcontractorChange: (index: number, field: string, value: string) => void;
  addSubcontractor: () => void;
  removeSubcontractor: (index: number) => void;
}

export function SubcontractorsStep({ 
  formData, 
  errors,
  handleSubcontractorChange, 
  addSubcontractor, 
  removeSubcontractor 
}: SubcontractorsStepProps) {
  return (
    <div className="space-y-6">
      {formData.subcontractors.map((subcontractor, index) => (
        <div key={index} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Subcontractor {index + 1}</h3>
            {formData.subcontractors.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => removeSubcontractor(index)}
              >
                Remove
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`business-name-${index}`}>Business Name <span className="text-destructive">*</span></Label>
              <Input
                id={`business-name-${index}`}
                placeholder="Enter business name"
                value={subcontractor.businessName}
                onChange={(e) => handleSubcontractorChange(index, 'businessName', e.target.value)}
                className={`glass-input ${errors[`subcontractors[${index}].businessName`] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors[`subcontractors[${index}].businessName`]}
              />
              {errors[`subcontractors[${index}].businessName`] && 
                <p className="text-sm font-medium text-destructive">{errors[`subcontractors[${index}].businessName`]}</p>
              }
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`contact-name-${index}`}>Contact Name <span className="text-destructive">*</span></Label>
              <Input
                id={`contact-name-${index}`}
                placeholder="Enter contact name"
                value={subcontractor.contactName}
                onChange={(e) => handleSubcontractorChange(index, 'contactName', e.target.value)}
                className={`glass-input ${errors[`subcontractors[${index}].contactName`] ? 'border-destructive' : ''}`}
                required
                aria-invalid={!!errors[`subcontractors[${index}].contactName`]}
              />
              {errors[`subcontractors[${index}].contactName`] && 
                <p className="text-sm font-medium text-destructive">{errors[`subcontractors[${index}].contactName`]}</p>
              }
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email <span className="text-destructive">*</span></Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  placeholder="Enter email"
                  value={subcontractor.email}
                  onChange={(e) => handleSubcontractorChange(index, 'email', e.target.value)}
                  className={`glass-input ${errors[`subcontractors[${index}].email`] ? 'border-destructive' : ''}`}
                  required
                  aria-invalid={!!errors[`subcontractors[${index}].email`]}
                />
                {errors[`subcontractors[${index}].email`] && 
                  <p className="text-sm font-medium text-destructive">{errors[`subcontractors[${index}].email`]}</p>
                }
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`phone-${index}`}>Phone <span className="text-destructive">*</span></Label>
                <Input
                  id={`phone-${index}`}
                  placeholder="Enter phone number"
                  value={subcontractor.phone}
                  onChange={(e) => handleSubcontractorChange(index, 'phone', e.target.value)}
                  className={`glass-input ${errors[`subcontractors[${index}].phone`] ? 'border-destructive' : ''}`}
                  required
                  aria-invalid={!!errors[`subcontractors[${index}].phone`]}
                />
                {errors[`subcontractors[${index}].phone`] && 
                  <p className="text-sm font-medium text-destructive">{errors[`subcontractors[${index}].phone`]}</p>
                }
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={addSubcontractor}
      >
        Add Another Subcontractor
      </Button>
    </div>
  );
}
