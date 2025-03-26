import { useState, useEffect, useCallback } from 'react';
import { clientsApi, sitesApi } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { toJsonValue } from '@/lib/utils/jsonUtils';
import { SiteStatus } from '@/types/common';

export function useSiteForm(initialData: Partial<SiteFormData> = {}) {
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    status: 'active',
    contacts: [],
    contract_details: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      autoRenewal: false,
      contractNumber: '',
      contractLength: 12,
      contractLengthUnit: 'months',
      renewalPeriod: 12,
      renewalNotice: 30, 
      noticeUnit: 'days',
      serviceFrequency: 'weekly',
      serviceDeliveryMethod: 'in-person'
    },
    billingDetails: {
      billingCycle: 'monthly',
      billingDay: 1,
      billingLines: [],
      billingNotes: '',  // Changed from billingTerms to billingNotes
      billingMethod: 'invoice',
      serviceDeliveryType: 'direct',
    },
    securityDetails: {
      hasAlarm: false,
      alarmCode: '',
      keyRequired: false,
      keyLocation: '',
      swipeCard: false,
      parkingDetails: '',
      accessNotes: ''
    },
    jobSpecifications: {
      daysPerWeek: 0,
      hoursPerDay: 0,
      directEmployees: 0,
      notes: '',
      cleaningFrequency: '',
      customFrequency: '',
      serviceDays: '',
      serviceTime: '',
      estimatedHours: '',
      equipmentRequired: '',
      scopeNotes: '',
      weeklyContractorCost: 0,
      monthlyContractorCost: 0,
      annualContractorCost: 0
    },
    replenishables: {
      stock: [],
      supplies: [],
      notes: ''
    },
    periodicals: {
      ceilings: false,
      glazing: false,
      upholstery: false,
      sanitizing: false,
      notes: ''
    },
    adHocWorkAuthorization: {
      authorizedAmount: 0,
      requiresApproval: true,
      approvalThreshold: 0,
      approvalContact: '',
      approvalEmail: '',
      approvalPhone: '',
      notes: ''
    },
    useClientInfo: false,
    hasSubcontractors: false,
    postcode: '',
    notes: ''
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const updateField = useCallback(
    (field: keyof SiteFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateNestedField = useCallback(
    (section: keyof SiteFormData, field: string, value: any) => {
      setFormData(prev => {
        if (prev[section] && typeof prev[section] === 'object') {
          return {
            ...prev,
            [section]: { ...prev[section] as object, [field]: value }
          };
        }
        return prev;
      });
    },
    []
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.clientId) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields (Name, Address, Client).',
          variant: 'destructive'
        });
        return;
      }

      // Convert form data to the format expected by the API
      const apiData = {
        ...formData,
        postal_code: formData.postalCode,
        client_id: formData.clientId,
        contract_details: toJsonValue(formData.contract_details),
        billing_details: toJsonValue(formData.billingDetails),
        security_details: toJsonValue(formData.securityDetails),
        job_specifications: toJsonValue(formData.jobSpecifications),
        replenishables: toJsonValue(formData.replenishables),
        periodicals: toJsonValue(formData.periodicals),
        adHocWorkAuthorization: toJsonValue(formData.adHocWorkAuthorization)
      };

      // Call the createSite API
      const newSite = await sitesApi.createSite(apiData);

      // Show success message
      toast({
        title: 'Success',
        description: 'Site created successfully.',
        duration: 3000
      });

      // Redirect to the new site's detail page
      navigate(`/sites/${newSite.id}`);
    } catch (error: any) {
      console.error('Error creating site:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create site. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    updateField,
    updateNestedField,
    handleSubmit,
    isSubmitting,
  };
}
