
import React, { useState, useEffect } from 'react';
import { SiteFormData } from '../siteFormTypes';
import { PrimaryContractInformation } from './contract/PrimaryContractInformation';
import { ServiceDeliveryMethod } from './contract/ServiceDeliveryMethod';
import { ContractTermsSection } from './contract/ContractTermsSection';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractDetails } from '../types/contractTypes';

interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  addContractTerm?: () => void;
  removeContractTerm?: (index: number) => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<SiteFormData>>;
}

export function ContractDetailsStep({ 
  formData, 
  handleNestedChange,
  addContractTerm,
  removeContractTerm,
  updateContractTerm,
  setFormData
}: ContractDetailsStepProps) {
  const [annualValue, setAnnualValue] = useState<number>(0);
  const [annualDirectCost, setAnnualDirectCost] = useState<number>(0);
  const [annualContractorCost, setAnnualContractorCost] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);

  // Calculate annual value based on billing cycle and contract value
  useEffect(() => {
    const value = formData.contractDetails.value || 0;
    const cycle = formData.contractDetails.billingCycle || 'monthly';
    
    let annual = 0;
    let weekly = 0;
    let monthly = 0;
    
    switch (cycle) {
      case 'weekly':
        weekly = value;
        monthly = value * 4.33;
        annual = value * 52;
        break;
      case 'monthly':
        weekly = value / 4.33;
        monthly = value;
        annual = value * 12;
        break;
      case 'quarterly':
        weekly = value / 13;
        monthly = value / 3;
        annual = value * 4;
        break;
      case 'annually':
        weekly = value / 52;
        monthly = value / 12;
        annual = value;
        break;
      default:
        annual = 0;
        weekly = 0;
        monthly = 0;
    }
    
    setAnnualValue(annual);
    
    // Add a billing line automatically if a value is set
    if (value > 0 && formData.billingDetails.billingLines.length === 0) {
      handleNestedChange('billingDetails', 'billingLines', [{
        description: 'Contract payment',
        amount: value,
        frequency: cycle,
        isRecurring: true
      }]);
    }

    // Update revenue fields on the site record
    setFormData && setFormData(prev => ({
      ...prev,
      weeklyRevenue: weekly,
      monthlyRevenue: monthly,
      annualRevenue: annual
    }));
  }, [formData.contractDetails.value, formData.contractDetails.billingCycle]);

  // Calculate annual direct cost based on weekly budget
  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'direct') {
      const weeklyBudget = formData.billingDetails.weeklyBudget || 0;
      const annualCost = weeklyBudget * 52;
      setAnnualDirectCost(annualCost);
      
      // Update monthly cost on the site record
      handleNestedChange('monthlyCost', '', weeklyBudget * 4.33);
      
      // Calculate profit margin
      if (annualValue > 0) {
        const profit = annualValue - annualCost;
        const margin = (profit / annualValue) * 100;
        setProfitMargin(margin);
      }
    }
  }, [formData.billingDetails.weeklyBudget, annualValue, formData.billingDetails.serviceDeliveryType]);

  // Calculate annual contractor cost
  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'contractor') {
      const contractorCost = formData.billingDetails.annualContractorCost || 0;
      setAnnualContractorCost(contractorCost);
      
      // Update monthly cost on the site record based on the annual cost
      handleNestedChange('monthlyCost', '', contractorCost / 12);
      
      // Calculate profit margin
      if (annualValue > 0) {
        const profit = annualValue - contractorCost;
        const margin = (profit / annualValue) * 100;
        setProfitMargin(margin);
      }
    }
  }, [formData.billingDetails.annualContractorCost, annualValue, formData.billingDetails.serviceDeliveryType]);

  // Function to add an additional contract
  const addAdditionalContract = () => {
    if (!setFormData) return;
    
    // Create a new default contract
    const newContract: ContractDetails = {
      startDate: '',
      endDate: '',
      contractNumber: '',
      renewalTerms: '',
      terminationPeriod: '',
      contractType: 'cleaning',
      terms: []
    };
    
    // Add it to the additional contracts array
    setFormData(prev => ({
      ...prev,
      additionalContracts: [...(prev.additionalContracts || []), newContract]
    }));
  };

  // Function to remove an additional contract
  const removeAdditionalContract = (index: number) => {
    if (!setFormData) return;
    
    setFormData(prev => {
      const updatedContracts = [...(prev.additionalContracts || [])];
      updatedContracts.splice(index, 1);
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  };

  // Function to update an additional contract
  const updateAdditionalContract = (index: number, field: string, value: any) => {
    if (!setFormData || !formData.additionalContracts) return;
    
    setFormData(prev => {
      const updatedContracts = [...(prev.additionalContracts || [])];
      updatedContracts[index] = {
        ...updatedContracts[index],
        [field]: value
      };
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  };

  return (
    <div className="space-y-6">
      <PrimaryContractInformation 
        formData={formData}
        handleNestedChange={handleNestedChange}
        annualValue={annualValue}
      />
      
      <ServiceDeliveryMethod 
        formData={formData}
        handleNestedChange={handleNestedChange}
        annualDirectCost={annualDirectCost}
        annualContractorCost={annualContractorCost}
        profitMargin={profitMargin}
        annualValue={annualValue}
      />
      
      <ContractTermsSection 
        formData={formData}
        handleNestedChange={handleNestedChange}
        addContractTerm={addContractTerm}
        removeContractTerm={removeContractTerm}
        updateContractTerm={updateContractTerm}
      />

      {/* Additional Contracts Section */}
      {setFormData && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Additional Contracts</h3>
            <Button 
              onClick={addAdditionalContract} 
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Contract
            </Button>
          </div>

          {formData.additionalContracts && formData.additionalContracts.length > 0 ? (
            <div className="space-y-4">
              {formData.additionalContracts.map((contract, index) => (
                <Card key={index} className="bg-slate-50">
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="text-md">
                      Contract #{index + 2}: {contract.contractType || 'Cleaning'}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAdditionalContract(index)}
                      className="h-8 w-8 p-0" 
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contract Type</label>
                        <select 
                          className="w-full rounded-md border border-input p-2"
                          value={contract.contractType || 'cleaning'}
                          onChange={(e) => updateAdditionalContract(index, 'contractType', e.target.value)}
                        >
                          <option value="cleaning">Cleaning</option>
                          <option value="pest">Pest Control</option>
                          <option value="grounds">Grounds Maintenance</option>
                          <option value="waste">Waste Management</option>
                          <option value="hygiene">Hygiene Services</option>
                          <option value="gardening">Gardening</option>
                          <option value="security">Security</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contract Number</label>
                        <input 
                          type="text"
                          className="w-full rounded-md border border-input p-2"
                          value={contract.contractNumber || ''}
                          onChange={(e) => updateAdditionalContract(index, 'contractNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <input 
                          type="date"
                          className="w-full rounded-md border border-input p-2"
                          value={contract.startDate || ''}
                          onChange={(e) => updateAdditionalContract(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <input 
                          type="date"
                          className="w-full rounded-md border border-input p-2"
                          value={contract.endDate || ''}
                          onChange={(e) => updateAdditionalContract(index, 'endDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contract Value</label>
                        <input 
                          type="number"
                          className="w-full rounded-md border border-input p-2"
                          value={contract.value || ''}
                          onChange={(e) => updateAdditionalContract(index, 'value', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Billing Cycle</label>
                        <select 
                          className="w-full rounded-md border border-input p-2"
                          value={contract.billingCycle || 'monthly'}
                          onChange={(e) => updateAdditionalContract(index, 'billingCycle', e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-md border border-slate-200">
              <p className="text-muted-foreground">No additional contracts added yet.</p>
              <Button 
                onClick={addAdditionalContract} 
                variant="secondary" 
                size="sm" 
                className="mt-2"
              >
                Add Contract
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
