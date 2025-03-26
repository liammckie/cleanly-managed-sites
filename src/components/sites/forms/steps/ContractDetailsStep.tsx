import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePickerWrapper } from '@/components/ui/date-picker/DatePickerWrapper';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { SiteFormData } from '../types';

interface ServiceDeliveryMethodProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  annualDirectCost: number;
  annualContractorCost: number;
  profitMargin: number;
  annualValue: number;
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
    
    if (value > 0 && formData.billingDetails.billingLines.length === 0) {
      handleNestedChange('billingDetails', 'billingLines', [{
        description: 'Contract payment',
        amount: value,
        frequency: cycle,
        isRecurring: true
      }]);
    }

    setFormData && setFormData(prev => ({
      ...prev,
      weeklyRevenue: weekly,
      monthlyRevenue: monthly,
      annualRevenue: annual
    }));
  }, [formData.contractDetails.value, formData.contractDetails.billingCycle]);

  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'direct') {
      const weeklyBudget = formData.billingDetails.weeklyBudget || 0;
      const annualCost = weeklyBudget * 52;
      setAnnualDirectCost(annualCost);
      
      handleNestedChange('monthlyCost', '', weeklyBudget * 4.33);
      
      if (annualValue > 0) {
        const profit = annualValue - annualCost;
        const margin = (profit / annualValue) * 100;
        setProfitMargin(margin);
      }
    }
  }, [formData.billingDetails.weeklyBudget, annualValue, formData.billingDetails.serviceDeliveryType]);

  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'contractor') {
      const contractorCost = formData.billingDetails.annualContractorCost || 0;
      setAnnualContractorCost(contractorCost);
      
      handleNestedChange('monthlyCost', '', contractorCost / 12);
      
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

      {setFormData && (
        <AdditionalContractsSection
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
