
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { SiteFormData } from '../../siteFormTypes';

interface ContractTermsSectionProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  addContractTerm?: () => void;
  removeContractTerm?: (index: number) => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
}

export function ContractTermsSection({ 
  formData, 
  handleNestedChange,
  addContractTerm,
  removeContractTerm,
  updateContractTerm
}: ContractTermsSectionProps) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Special Conditions and Contract Terms</h3>
        {addContractTerm && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addContractTerm}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Term
          </Button>
        )}
      </div>
      
      {formData.contractDetails.terms && formData.contractDetails.terms.length > 0 ? (
        <div className="space-y-4">
          {formData.contractDetails.terms.map((term, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <CardTitle className="text-base font-medium">
                  Term {index + 1}: {term.name || 'Untitled Term'}
                </CardTitle>
                {removeContractTerm && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeContractTerm(index)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`term-name-${index}`}>Term Name</Label>
                    <Input
                      id={`term-name-${index}`}
                      value={term.name}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'name', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`term-description-${index}`}>Description</Label>
                    <Input
                      id={`term-description-${index}`}
                      value={term.description}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'description', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`term-start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`term-start-date-${index}`}
                      type="date"
                      value={term.startDate}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'startDate', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`term-end-date-${index}`}>End Date</Label>
                    <Input
                      id={`term-end-date-${index}`}
                      type="date"
                      value={term.endDate}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'endDate', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`term-renewal-terms-${index}`}>Renewal Terms</Label>
                    <Input
                      id={`term-renewal-terms-${index}`}
                      value={term.renewalTerms}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'renewalTerms', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`term-termination-period-${index}`}>Termination Period</Label>
                    <Input
                      id={`term-termination-period-${index}`}
                      value={term.terminationPeriod}
                      onChange={(e) => updateContractTerm && updateContractTerm(index, 'terminationPeriod', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id={`term-auto-renew-${index}`} 
                      checked={term.autoRenew || false}
                      onCheckedChange={(checked) => updateContractTerm && updateContractTerm(index, 'autoRenew', checked)}
                    />
                    <Label htmlFor={`term-auto-renew-${index}`}>Auto-renew this term</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No special conditions or terms added. Click "Add Term" to create a new condition or term.
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="termination-period">Main Termination Period</Label>
        <Input
          id="termination-period"
          placeholder="e.g., 30 days notice"
          value={formData.contractDetails.terminationPeriod}
          onChange={(e) => handleNestedChange('contractDetails', 'terminationPeriod', e.target.value)}
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="renewal-terms">General Renewal Terms</Label>
        <Textarea
          id="renewal-terms"
          placeholder="Enter renewal terms..."
          rows={3}
          value={formData.contractDetails.renewalTerms}
          onChange={(e) => handleNestedChange('contractDetails', 'renewalTerms', e.target.value)}
          className="glass-input resize-none"
        />
      </div>
    </div>
  );
}
