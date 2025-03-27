
import React from 'react';
import { SiteFormData } from '../types/siteFormData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
}

export function BillingDetailsStep({
  formData,
  handleNestedChange,
  handleDoubleNestedChange,
  addBillingLine,
  updateBillingLine,
  removeBillingLine
}: BillingDetailsStepProps) {
  const billingDetails = formData.billingDetails || {};
  const billingLines = billingDetails.billingLines || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="useClientInfo" 
                checked={billingDetails.useClientInfo || false}
                onCheckedChange={(checked) => 
                  handleNestedChange('billingDetails', 'useClientInfo', checked)
                }
              />
              <Label htmlFor="useClientInfo">Use client information for billing</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientPO">Client PO Number</Label>
                <Input
                  id="clientPO"
                  value={billingDetails.clientPO || ''}
                  onChange={(e) => handleNestedChange('billingDetails', 'clientPO', e.target.value)}
                  placeholder="Client PO Number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientReference">Client Reference</Label>
                <Input
                  id="clientReference"
                  value={billingDetails.clientReference || ''}
                  onChange={(e) => handleNestedChange('billingDetails', 'clientReference', e.target.value)}
                  placeholder="Client Reference"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingFrequency">Billing Frequency</Label>
                <Select
                  value={billingDetails.billingFrequency || ''}
                  onValueChange={(value) => handleNestedChange('billingDetails', 'billingFrequency', value)}
                >
                  <SelectTrigger id="billingFrequency">
                    <SelectValue placeholder="Select billing frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select
                  value={billingDetails.paymentTerms || ''}
                  onValueChange={(value) => handleNestedChange('billingDetails', 'paymentTerms', value)}
                >
                  <SelectTrigger id="paymentTerms">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="14days">14 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="end-of-month">End of Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Billing Lines</h3>
            <Button variant="outline" size="sm" onClick={addBillingLine}>
              <Plus className="h-4 w-4 mr-2" /> Add Billing Line
            </Button>
          </div>
          
          {billingLines.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No billing lines added. Click the button above to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {billingLines.map((line) => (
                <div key={line.id} className="border p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`description-${line.id}`}>Description</Label>
                      <Input
                        id={`description-${line.id}`}
                        value={line.description}
                        onChange={(e) => updateBillingLine(line.id, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`amount-${line.id}`}>Amount</Label>
                      <Input
                        id={`amount-${line.id}`}
                        type="number"
                        value={line.amount || 0}
                        onChange={(e) => updateBillingLine(line.id, 'amount', parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`frequency-${line.id}`}>Frequency</Label>
                      <Select
                        value={line.frequency || 'monthly'}
                        onValueChange={(value) => updateBillingLine(line.id, 'frequency', value)}
                      >
                        <SelectTrigger id={`frequency-${line.id}`}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="once">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 flex items-end">
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`recurring-${line.id}`}
                            checked={line.isRecurring}
                            onCheckedChange={(checked) => 
                              updateBillingLine(line.id, 'isRecurring', checked === true)
                            }
                          />
                          <Label htmlFor={`recurring-${line.id}`}>Recurring</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`onhold-${line.id}`}
                            checked={line.onHold}
                            onCheckedChange={(checked) => 
                              updateBillingLine(line.id, 'onHold', checked === true)
                            }
                          />
                          <Label htmlFor={`onhold-${line.id}`}>On Hold</Label>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeBillingLine(line.id)}
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
