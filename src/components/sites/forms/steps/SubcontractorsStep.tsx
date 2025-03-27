
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface SubcontractorsStepProps {
  subcontractors: any[];
  onSubcontractorAdd: () => void;
  onSubcontractorChange: (index: number, field: string, value: any) => void;
  onSubcontractorRemove: (index: number) => void;
  errors: Record<string, string>;
}

export function SubcontractorsStep({
  subcontractors = [],
  onSubcontractorAdd,
  onSubcontractorChange,
  onSubcontractorRemove,
  errors
}: SubcontractorsStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Subcontractors</h3>
            <Button variant="outline" size="sm" onClick={onSubcontractorAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Subcontractor
            </Button>
          </div>
          
          {subcontractors.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No subcontractors added. Click the button above to add one.
            </div>
          ) : (
            <div className="space-y-6">
              {subcontractors.map((subcontractor, index) => (
                <div key={subcontractor.id || index} className="border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`business-name-${index}`}>Business Name</Label>
                      <Input
                        id={`business-name-${index}`}
                        value={subcontractor.business_name || ''}
                        onChange={(e) => onSubcontractorChange(index, 'business_name', e.target.value)}
                        placeholder="Business Name"
                        className={errors[`subcontractors.${index}.business_name`] ? 'border-destructive' : ''}
                      />
                      {errors[`subcontractors.${index}.business_name`] && (
                        <p className="text-destructive text-sm">{errors[`subcontractors.${index}.business_name`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact-name-${index}`}>Contact Name</Label>
                      <Input
                        id={`contact-name-${index}`}
                        value={subcontractor.contact_name || ''}
                        onChange={(e) => onSubcontractorChange(index, 'contact_name', e.target.value)}
                        placeholder="Contact Name"
                        className={errors[`subcontractors.${index}.contact_name`] ? 'border-destructive' : ''}
                      />
                      {errors[`subcontractors.${index}.contact_name`] && (
                        <p className="text-destructive text-sm">{errors[`subcontractors.${index}.contact_name`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`email-${index}`}>Email</Label>
                      <Input
                        id={`email-${index}`}
                        value={subcontractor.email || ''}
                        onChange={(e) => onSubcontractorChange(index, 'email', e.target.value)}
                        placeholder="Email"
                        type="email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>Phone</Label>
                      <Input
                        id={`phone-${index}`}
                        value={subcontractor.phone || ''}
                        onChange={(e) => onSubcontractorChange(index, 'phone', e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`monthly-cost-${index}`}>Monthly Cost</Label>
                      <Input
                        id={`monthly-cost-${index}`}
                        type="number"
                        value={subcontractor.monthly_cost || 0}
                        onChange={(e) => onSubcontractorChange(index, 'monthly_cost', parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2 flex items-end">
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`is-flat-rate-${index}`}
                            checked={subcontractor.is_flat_rate === undefined ? true : subcontractor.is_flat_rate}
                            onCheckedChange={(checked) => 
                              onSubcontractorChange(index, 'is_flat_rate', checked === true)
                            }
                          />
                          <Label htmlFor={`is-flat-rate-${index}`}>Flat Rate</Label>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onSubcontractorRemove(index)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
