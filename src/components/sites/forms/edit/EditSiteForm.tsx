
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteFormData } from '../types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { useSiteFormData } from './useSiteFormData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteFormStepper } from '../SiteFormStepper';
import { BasicInformationStep } from '../steps/BasicInformationStep';
import { ContactsStep } from '../steps/contacts';
import { BillingDetailsStepWrapper } from '../steps/BillingDetailsStepWrapper';
import { ContractDetailsStep } from '../steps/ContractDetailsStep';
import { JobSpecificationsStepWrapper } from '../steps/JobSpecificationsStepWrapper';
import { PeriodicalsStepWrapper } from '../steps/PeriodicalsStepWrapper';
import { SubcontractorsStep } from '../steps/SubcontractorsStep';
import { ReplenishablesStep } from '../steps/ReplenishablesStep';
import { SecurityStep } from '../steps/SecurityStep';
import { useSiteFormBillingLines } from '@/hooks/useSiteFormBillingLines';
import { useSiteFormContractTerms } from '@/hooks/useSiteFormContractTerms';
import { useSiteFormAdditionalContracts } from '@/hooks/useSiteFormAdditionalContracts';
import { Loader2 } from 'lucide-react';

// Define the props interface for EditSiteForm
export interface EditSiteFormProps {
  initialData: any;
  siteId: string;
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export function EditSiteForm({ 
  initialData, 
  siteId, 
  isLoading, 
  onSubmit 
}: EditSiteFormProps) {
  const [formData, setFormData] = useState<SiteFormData>(initialData as SiteFormData);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SiteFormData>({
    defaultValues: initialData || {}
  });
  
  // Use the site form data hook to prepare data
  useSiteFormData(initialData || {}, formData, setFormData, form);
  
  // Use billing lines hook
  const { 
    billingLines, 
    addBillingLine, 
    updateBillingLine, 
    removeBillingLine 
  } = useSiteFormBillingLines();
  
  // Use contract terms hook
  const {
    addContractTerm,
    updateContractTerm,
    removeContractTerm
  } = useSiteFormContractTerms(formData, setFormData);
  
  // Use additional contracts hook
  const {
    addAdditionalContract,
    updateAdditionalContract,
    removeAdditionalContract
  } = useSiteFormAdditionalContracts(formData, setFormData);
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle field changes
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle nested field changes
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };
  
  // Handle doubly nested field changes
  const handleDoubleNestedChange = (
    section: keyof SiteFormData, 
    subsection: string, 
    field: string, 
    value: any
  ) => {
    setFormData(prev => {
      const currentSection = prev[section] || {};
      const currentSubsection = currentSection[subsection] || {};
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subsection]: {
            ...currentSubsection,
            [field]: value
          }
        }
      };
    });
  };
  
  // Handle client selection
  const handleClientChange = (clientId: string) => {
    handleChange('client_id', clientId);
    // Additional logic to fetch client data could go here
  };
  
  // Create an adapter function for input events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name as keyof SiteFormData, value);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Site: {formData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-6">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="job-specs">Job Specs</TabsTrigger>
              <TabsTrigger value="periodicals">Periodicals</TabsTrigger>
              <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
              <TabsTrigger value="replenishables">Replenishables</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info">
              <BasicInformationStep 
                formData={formData} 
                handleChange={handleInputChange} 
                handleNestedChange={handleNestedChange}
                handleClientChange={handleClientChange}
              />
            </TabsContent>
            
            <TabsContent value="contacts">
              <ContactsStep contacts={formData.contacts || []} />
            </TabsContent>
            
            <TabsContent value="billing">
              <BillingDetailsStepWrapper 
                formData={formData} 
                handleNestedChange={handleNestedChange}
                handleDoubleNestedChange={handleDoubleNestedChange}
                addBillingLine={addBillingLine}
                updateBillingLine={updateBillingLine}
                removeBillingLine={removeBillingLine}
              />
            </TabsContent>
            
            <TabsContent value="contract">
              <ContractDetailsStep 
                formData={formData} 
                handleNestedChange={handleNestedChange}
                addContractTerm={addContractTerm}
                updateContractTerm={updateContractTerm}
                removeContractTerm={removeContractTerm}
              />
            </TabsContent>
            
            <TabsContent value="job-specs">
              <JobSpecificationsStepWrapper 
                formData={formData} 
                handleNestedChange={handleNestedChange}
              />
            </TabsContent>
            
            <TabsContent value="periodicals">
              <PeriodicalsStepWrapper 
                formData={formData} 
                handleNestedChange={handleNestedChange}
                handleDoubleNestedChange={handleDoubleNestedChange}
              />
            </TabsContent>
            
            <TabsContent value="subcontractors">
              <SubcontractorsStep 
                subcontractors={formData.subcontractors || []} 
                hasSubcontractors={formData.hasSubcontractors || false}
              />
            </TabsContent>
            
            <TabsContent value="replenishables">
              <ReplenishablesStep 
                replenishables={formData.replenishables || {}} 
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityStep 
                securityDetails={formData.securityDetails || {}} 
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
