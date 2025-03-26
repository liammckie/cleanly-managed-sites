import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { useClientData } from './useClientData';
import { toJsonValue } from '@/lib/utils/jsonUtils';
import { SiteStatus } from '@/types/common';

const initialState: SiteFormData = {
  name: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  status: 'active',
  email: '',
  phone: '',
  clientId: '',
  representative: '',
  contractDetails: {
    startDate: '',
    endDate: '',
    contractLength: 0,
    contractLengthUnit: 'months',
    autoRenewal: false,
    renewalPeriod: 0,
    renewalNotice: 0,
    noticeUnit: 'weeks',
    serviceFrequency: 'weekly',
    serviceDeliveryMethod: 'contractor',
    additionalContracts: []
  },
  contacts: [],
  billingDetails: {
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostcode: '',
    billingEmail: '',
    contacts: [],
    rate: 0,
    billingFrequency: 'weekly',
    billingDay: 'monday',
    billingTerms: 'net_30',
    billingNotes: '',
    billingMethod: 'invoice',
    billingContact: '',
    billingContactEmail: '',
    billingContactPhone: '',
    billingLines: [],
    totalWeeklyAmount: 0
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
};

export const useSiteForm = () => {
  const [formData, setFormData] = useState<SiteFormData>(initialState);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSiteMutation } = useSiteCreate();
  const { updateSiteMutation } = useSiteUpdate();
  const navigate = useNavigate();
  
  const loadSiteData = (siteData: any) => {
    if (!siteData) return;
    
    setFormData(prevState => {
      const updatedState = {...prevState};
      
      updatedState.name = siteData.name || '';
      updatedState.address = siteData.address || '';
      updatedState.city = siteData.city || '';
      updatedState.state = siteData.state || '';
      updatedState.postalCode = siteData.postal_code || siteData.postcode || '';
      updatedState.postcode = siteData.postcode || siteData.postal_code || '';
      updatedState.country = siteData.country || '';
      updatedState.status = siteData.status || 'active';
      updatedState.email = siteData.email || '';
      updatedState.phone = siteData.phone || '';
      updatedState.clientId = siteData.client_id || '';
      updatedState.representative = siteData.representative || '';
      
      if (siteData.contract_details) {
        updatedState.contractDetails = {
          startDate: siteData.contract_details.startDate || '',
          endDate: siteData.contract_details.endDate || '',
          contractLength: siteData.contract_details.contractLength || 0,
          contractLengthUnit: siteData.contract_details.contractLengthUnit || 'months',
          autoRenewal: siteData.contract_details.autoRenewal || false,
          renewalPeriod: siteData.contract_details.renewalPeriod || 0,
          renewalNotice: siteData.contract_details.renewalNotice || 0,
          noticeUnit: siteData.contract_details.noticeUnit || 'weeks',
          serviceFrequency: siteData.contract_details.serviceFrequency || 'weekly',
          serviceDeliveryMethod: siteData.contract_details.serviceDeliveryMethod || 'contractor',
          additionalContracts: siteData.contract_details.additionalContracts || []
        };
      }
      
      if (siteData.billing_details) {
        updatedState.billingDetails = {
          ...updatedState.billingDetails,
          billingAddress: siteData.billing_details.billingAddress || '',
          billingCity: siteData.billing_details.billingCity || '',
          billingState: siteData.billing_details.billingState || '',
          billingPostcode: siteData.billing_details.billingPostcode || '',
          billingEmail: siteData.billing_details.billingEmail || '',
          contacts: siteData.billing_details.contacts || [],
          rate: siteData.billing_details.rate || 0,
          billingFrequency: siteData.billing_details.billingFrequency || 'weekly',
          billingDay: siteData.billing_details.billingDay || 'monday',
          billingTerms: siteData.billing_details.billingTerms || 'net_30',
          billingNotes: siteData.billing_details.billingNotes || '',
          billingMethod: siteData.billing_details.billingMethod || 'invoice',
          billingContact: siteData.billing_details.billingContact || '',
          billingContactEmail: siteData.billing_details.billingContactEmail || '',
          billingContactPhone: siteData.billing_details.billingContactPhone || '',
          billingLines: siteData.billing_details.billingLines || [],
          totalWeeklyAmount: siteData.billing_details.totalWeeklyAmount || 0
        };
      }
      
      if (siteData.security_details) {
        updatedState.securityDetails = {
          hasAlarm: siteData.security_details.hasAlarm || false,
          alarmCode: siteData.security_details.alarmCode || '',
          keyRequired: siteData.security_details.keyRequired || false,
          keyLocation: siteData.security_details.keyLocation || '',
          swipeCard: siteData.security_details.swipeCard || false,
          parkingDetails: siteData.security_details.parkingDetails || '',
          accessNotes: siteData.security_details.accessNotes || ''
        };
      }
      
      if (siteData.job_specifications) {
        updatedState.jobSpecifications = {
          ...updatedState.jobSpecifications,
          daysPerWeek: siteData.job_specifications.daysPerWeek || 0,
          hoursPerDay: siteData.job_specifications.hoursPerDay || 0,
          directEmployees: siteData.job_specifications.directEmployees || 0,
          notes: siteData.job_specifications.notes || '',
          cleaningFrequency: siteData.job_specifications.cleaningFrequency || '',
          customFrequency: siteData.job_specifications.customFrequency || '',
          serviceDays: siteData.job_specifications.serviceDays || '',
          serviceTime: siteData.job_specifications.serviceTime || '',
          estimatedHours: siteData.job_specifications.estimatedHours || '',
          equipmentRequired: siteData.job_specifications.equipmentRequired || '',
          scopeNotes: siteData.job_specifications.scopeNotes || '',
          weeklyContractorCost: siteData.job_specifications.weeklyContractorCost || 0,
          monthlyContractorCost: siteData.job_specifications.monthlyContractorCost || 0,
          annualContractorCost: siteData.job_specifications.annualContractorCost || 0
        };
      }
      
      if (siteData.replenishables) {
        updatedState.replenishables = {
          stock: siteData.replenishables.stock || [],
          supplies: siteData.replenishables.supplies || [],
          notes: siteData.replenishables.notes || ''
        };
      }
      
      if (siteData.periodicals) {
        updatedState.periodicals = {
          ceilings: siteData.periodicals.ceilings || false,
          glazing: siteData.periodicals.glazing || false,
          upholstery: siteData.periodicals.upholstery || false,
          sanitizing: siteData.periodicals.sanitizing || false,
          notes: siteData.periodicals.notes || ''
        };
      }
      
      if (siteData.adHocWorkAuthorization) {
        updatedState.adHocWorkAuthorization = {
          authorizedAmount: siteData.adHocWorkAuthorization.authorizedAmount || 0,
          requiresApproval: siteData.adHocWorkAuthorization.requiresApproval || true,
          approvalThreshold: siteData.adHocWorkAuthorization.approvalThreshold || 0,
          approvalContact: siteData.adHocWorkAuthorization.approvalContact || '',
          approvalEmail: siteData.adHocWorkAuthorization.approvalEmail || '',
          approvalPhone: siteData.adHocWorkAuthorization.approvalPhone || '',
          notes: siteData.adHocWorkAuthorization.notes || ''
        };
      }
      
      updatedState.contacts = siteData.contacts || [];
      updatedState.hasSubcontractors = siteData.has_subcontractors || false;
      updatedState.notes = siteData.notes || '';
      
      return updatedState;
    });
  };
  
  const handleClientChange = (clientId: string) => {
    setFormData(prevState => ({
      ...prevState,
      clientId
    }));
  };
  
  const loadClientData = (clientId: string) => {
    // This function will be implemented by useClientData hook
    // It's a placeholder here for the interface
  };
  
  const handleSubmit = async (siteId?: string) => {
    try {
      setIsSubmitting(true);
      
      const siteData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode || formData.postcode,
        postcode: formData.postalCode || formData.postcode,
        country: formData.country,
        status: formData.status === 'on_hold' ? 'on-hold' as SiteStatus : formData.status,
        email: formData.email,
        phone: formData.phone,
        client_id: formData.clientId,
        representative: formData.representative,
        contract_details: toJsonValue({
          startDate: formData.contractDetails.startDate,
          endDate: formData.contractDetails.endDate,
          contractLength: formData.contractDetails.contractLength,
          contractLengthUnit: formData.contractDetails.contractLengthUnit,
          autoRenewal: formData.contractDetails.autoRenewal,
          renewalPeriod: formData.contractDetails.renewalPeriod,
          renewalNotice: formData.contractDetails.renewalNotice,
          noticeUnit: formData.contractDetails.noticeUnit,
          serviceFrequency: formData.contractDetails.serviceFrequency,
          serviceDeliveryMethod: formData.contractDetails.serviceDeliveryMethod,
          additionalContracts: formData.contractDetails.additionalContracts?.map(c => toJsonValue(c)) || []
        }),
        billing_details: toJsonValue(formData.billingDetails),
        security_details: toJsonValue(formData.securityDetails),
        job_specifications: toJsonValue(formData.jobSpecifications),
        replenishables: toJsonValue(formData.replenishables),
        periodicals: toJsonValue(formData.periodicals),
        adHocWorkAuthorization: toJsonValue(formData.adHocWorkAuthorization),
        has_subcontractors: formData.hasSubcontractors,
        contacts: formData.contacts,
        notes: formData.notes
      };
      
      let result;
      
      if (siteId) {
        result = await updateSiteMutation.mutateAsync({
          id: siteId,
          data: siteData as any
        });
        toast.success('Site updated successfully!');
      } else {
        result = await createSiteMutation.mutateAsync(siteData as any);
        toast.success('Site created successfully!');
      }
      
      navigate(`/sites/${result.id}`);
    } catch (error) {
      console.error('Error submitting site form:', error);
      toast.error('Failed to save site. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    setFormData,
    step,
    setStep,
    isSubmitting,
    handleSubmit,
    handleClientChange,
    loadSiteData,
    loadClientData
  };
};
