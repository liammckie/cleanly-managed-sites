
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, DollarSign, PlusCircle } from 'lucide-react';
import { SiteFormData } from '../types/siteFormData';
import { Subcontractor, serviceOptions } from '../types/subcontractorTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface SubcontractorsStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleSubcontractorChange: (index: number, field: string, value: any) => void;
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleServiceChange = (index: number, service: string, checked: boolean) => {
    const currentServices = formData.subcontractors![index].services || [];
    let newServices;
    
    if (checked) {
      newServices = [...currentServices, service];
    } else {
      newServices = currentServices.filter(s => s !== service);
    }
    
    handleSubcontractorChange(index, 'services', newServices);
  };

  return (
    <div className="space-y-6">
      {formData.subcontractors && formData.subcontractors.map((subcontractor, index) => (
        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {subcontractor.businessName || `Subcontractor ${index + 1}`}
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpand(index)}
                >
                  {expandedIndex === index ? 'Collapse' : 'Expand'}
                </Button>
                {formData.subcontractors && formData.subcontractors.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeSubcontractor(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className={`space-y-4 ${expandedIndex !== index ? 'hidden md:block' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              {expandedIndex === index && (
                <>
                  <div className="space-y-2 mt-4">
                    <Label>Services Provided</Label>
                    <div className="border rounded-md p-4 bg-background/50">
                      <ScrollArea className="h-48 pr-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {serviceOptions.map((service) => (
                            <div key={service.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`service-${index}-${service.value}`}
                                checked={(subcontractor.services || []).includes(service.value)}
                                onCheckedChange={(checked) => handleServiceChange(index, service.value, !!checked)}
                              />
                              <label 
                                htmlFor={`service-${index}-${service.value}`}
                                className="text-sm"
                              >
                                {service.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor={`custom-services-${index}`}>Additional Services</Label>
                      <Textarea
                        id={`custom-services-${index}`}
                        placeholder="Enter any custom or additional services not listed above"
                        value={subcontractor.customServices || ''}
                        onChange={(e) => handleSubcontractorChange(index, 'customServices', e.target.value)}
                        className="glass-input mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`monthly-cost-${index}`}>Monthly Cost</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id={`monthly-cost-${index}`}
                          type="number"
                          placeholder="0.00"
                          value={subcontractor.monthlyCost || ''}
                          onChange={(e) => handleSubcontractorChange(index, 'monthlyCost', parseFloat(e.target.value) || '')}
                          className="glass-input pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-8">
                      <Switch
                        id={`flat-rate-${index}`}
                        checked={!!subcontractor.isFlatRate}
                        onCheckedChange={(checked) => handleSubcontractorChange(index, 'isFlatRate', checked)}
                      />
                      <Label htmlFor={`flat-rate-${index}`}>Flat Rate (vs. Hourly)</Label>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Collapsed view - only show minimal info */}
            {expandedIndex !== index && (
              <div className="md:hidden">
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <div><span className="text-muted-foreground">Contact:</span> {subcontractor.contactName}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {subcontractor.phone}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {subcontractor.email}</div>
                </div>
              </div>
            )}
          </CardContent>
          
          {expandedIndex === index && (
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex flex-wrap gap-2">
                {(subcontractor.services || []).map(service => {
                  const serviceOption = serviceOptions.find(s => s.value === service);
                  return serviceOption ? (
                    <Badge key={service} variant="secondary">
                      {serviceOption.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
      
      <div className="flex justify-center">
        <Button 
          type="button" 
          variant="outline" 
          onClick={addSubcontractor}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subcontractor
        </Button>
      </div>
    </div>
  );
}
