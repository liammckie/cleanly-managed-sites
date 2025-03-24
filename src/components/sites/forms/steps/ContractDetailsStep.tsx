
import React, { useState, useEffect } from 'react';
import { SiteFormData } from '../siteFormTypes';
import { PrimaryContractInformation } from './contract/PrimaryContractInformation';
import { ServiceDeliveryMethod } from './contract/ServiceDeliveryMethod';
import { ContractTermsSection } from './contract/ContractTermsSection';
import { AdditionalContractsSection } from './contract/AdditionalContractsSection';
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
        <AdditionalContractsSection
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
