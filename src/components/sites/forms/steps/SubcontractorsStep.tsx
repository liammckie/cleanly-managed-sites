
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface SubcontractorsStepProps {
  subcontractors: any[];
  hasSubcontractors: boolean;
  handleAddSubcontractor?: () => void;
  handleUpdateSubcontractor?: (index: number, field: string, value: any) => void;
  handleRemoveSubcontractor?: (index: number) => void;
}

export function SubcontractorsStep({
  subcontractors,
  hasSubcontractors,
  handleAddSubcontractor = () => {},
  handleUpdateSubcontractor = () => {},
  handleRemoveSubcontractor = () => {}
}: SubcontractorsStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subcontractors</CardTitle>
          <Button 
            type="button" 
            onClick={handleAddSubcontractor}
            variant="outline"
          >
            Add Subcontractor
          </Button>
        </CardHeader>
        <CardContent>
          {subcontractors.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No subcontractors have been added yet.
            </div>
          ) : (
            <div className="space-y-6">
              {subcontractors.map((subcontractor, index) => (
                <div key={subcontractor.id || index} className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Subcontractor {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubcontractor(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name={`subcontractors[${index}].business_name`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              value={subcontractor.business_name || ''}
                              onChange={(e) => 
                                handleUpdateSubcontractor(index, 'business_name', e.target.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`subcontractors[${index}].contact_name`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              value={subcontractor.contact_name || ''}
                              onChange={(e) => 
                                handleUpdateSubcontractor(index, 'contact_name', e.target.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`subcontractors[${index}].email`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              value={subcontractor.email || ''}
                              onChange={(e) => 
                                handleUpdateSubcontractor(index, 'email', e.target.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`subcontractors[${index}].phone`}
                      render={() => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              value={subcontractor.phone || ''}
                              onChange={(e) => 
                                handleUpdateSubcontractor(index, 'phone', e.target.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    name={`subcontractors[${index}].is_flat_rate`}
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Flat Rate</FormLabel>
                          <FormDescription>
                            Is this subcontractor paid a flat rate?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={subcontractor.is_flat_rate}
                            onCheckedChange={(checked) => 
                              handleUpdateSubcontractor(index, 'is_flat_rate', checked)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name={`subcontractors[${index}].monthly_cost`}
                    render={() => (
                      <FormItem>
                        <FormLabel>Monthly Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={subcontractor.monthly_cost || ''}
                            onChange={(e) => 
                              handleUpdateSubcontractor(index, 'monthly_cost', 
                                e.target.value === '' ? '' : parseFloat(e.target.value))
                            }
                            step="0.01"
                            min="0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    name={`subcontractors[${index}].notes`}
                    render={() => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            value={subcontractor.notes || ''}
                            onChange={(e) => 
                              handleUpdateSubcontractor(index, 'notes', e.target.value)
                            }
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
