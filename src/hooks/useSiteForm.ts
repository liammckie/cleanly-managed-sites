import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormTypes';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { useClientData } from './useClientData';

const initialState: SiteFormData = {
  // Basic site details
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
  // Contract details
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
  // Other sections
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
  // Backward compatibility
  postcode: ''
};

export const useSiteForm = () => {
  const [formData, setFormData] = useState<SiteFormData>(initialState);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSiteMutation } = useSiteCreate();
  const { updateSiteMutation } = useSiteUpdate();
  const navigate = useNavigate();
  
  // Method to load existing site data
  const loadSiteData = (siteData: any) => {
    if (!siteData) return;
    
    setFormData(prevState => {
      // Create a properly formatted state object from the site data
      const updatedState = {...prevState};
      
      // Copy basic fields
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
      
      // Load contract details
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
      
      // Load billing details
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
      
      // Load security details
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
      
      // Load job specifications
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
      
      // Load replenishables
      if (siteData.replenishables) {
        updatedState.replenishables = {
          stock: siteData.replenishables.stock || [],
          supplies: siteData.replenishables.supplies || [],
          notes: siteData.replenishables.notes || ''
        };
      }
      
      // Load periodicals
      if (siteData.periodicals) {
        updatedState.periodicals = {
          ceilings: siteData.periodicals.ceilings || false,
          glazing: siteData.periodicals.glazing || false,
          upholstery: siteData.periodicals.upholstery || false,
          sanitizing: siteData.periodicals.sanitizing || false,
          notes: siteData.periodicals.notes || ''
        };
      }
      
      // Load ad hoc work authorization
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
      
      // Load contacts
      updatedState.contacts = siteData.contacts || [];
      
      // Load subcontractors flag
      updatedState.hasSubcontractors = siteData.has_subcontractors || false;
      
      return updatedState;
    });
  };
  
  // Handle client change
  const handleClientChange = (clientId: string) => {
    setFormData(prevState => ({
      ...prevState,
      clientId
    }));
  };
  
  // Load client data
  const loadClientData = (clientId: string) => {
    // This function will be implemented by useClientData hook
    // It's a placeholder here for the interface
  };
  
  // Handle submit
  const handleSubmit = async (siteId?: string) => {
    try {
      setIsSubmitting(true);
      
      // Process form data into site record format
      const siteData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode || formData.postcode,
        postcode: formData.postalCode || formData.postcode,
        country: formData.country,
        status: formData.status,
        email: formData.email,
        phone: formData.phone,
        client_id: formData.clientId,
        representative: formData.representative,
        contract_details: {
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
          additionalContracts: formData.contractDetails.additionalContracts
        },
        billing_details: {
          billingAddress: formData.billingDetails.billingAddress,
          billingCity: formData.billingDetails.billingCity,
          billingState: formData.billingDetails.billingState,
          billingPostcode: formData.billingDetails.billingPostcode,
          billingEmail: formData.billingDetails.billingEmail,
          contacts: formData.billingDetails.contacts,
          rate: formData.billingDetails.rate,
          billingFrequency: formData.billingDetails.billingFrequency,
          billingDay: formData.billingDetails.billingDay,
          billingTerms: formData.billingDetails.billingTerms,
          billingNotes: formData.billingDetails.billingNotes,
          billingMethod: formData.billingDetails.billingMethod,
          billingContact: formData.billingDetails.billingContact,
          billingContactEmail: formData.billingDetails.billingContactEmail,
          billingContactPhone: formData.billingDetails.billingContactPhone,
          billingLines: formData.billingDetails.billingLines,
          totalWeeklyAmount: formData.billingDetails.totalWeeklyAmount
        },
        security_details: {
          hasAlarm: formData.securityDetails.hasAlarm,
          alarmCode: formData.securityDetails.alarmCode,
          keyRequired: formData.securityDetails.keyRequired,
          keyLocation: formData.securityDetails.keyLocation,
          swipeCard: formData.securityDetails.swipeCard,
          parkingDetails: formData.securityDetails.parkingDetails,
          accessNotes: formData.securityDetails.accessNotes
        },
        job_specifications: {
          daysPerWeek: formData.jobSpecifications.daysPerWeek,
          hoursPerDay: formData.jobSpecifications.hoursPerDay,
          directEmployees: formData.jobSpecifications.directEmployees,
          notes: formData.jobSpecifications.notes,
          cleaningFrequency: formData.jobSpecifications.cleaningFrequency,
          customFrequency: formData.jobSpecifications.customFrequency,
          serviceDays: formData.jobSpecifications.serviceDays,
          serviceTime: formData.jobSpecifications.serviceTime,
          estimatedHours: formData.jobSpecifications.estimatedHours,
          equipmentRequired: formData.jobSpecifications.equipmentRequired,
          scopeNotes: formData.jobSpecifications.scopeNotes,
          weeklyContractorCost: formData.jobSpecifications.weeklyContractorCost,
          monthlyContractorCost: formData.jobSpecifications.monthlyContractorCost,
          annualContractorCost: formData.jobSpecifications.annualContractorCost
        },
        replenishables: formData.replenishables,
        periodicals: formData.periodicals,
        adHocWorkAuthorization: formData.adHocWorkAuthorization,
        has_subcontractors: formData.hasSubcontractors,
        contacts: formData.contacts
      };
      
      let result;
      
      if (siteId) {
        // Update existing site
        result = await updateSiteMutation.mutateAsync({
          id: siteId,
          data: siteData
        });
        toast.success('Site updated successfully!');
      } else {
        // Create new site
        result = await createSiteMutation.mutateAsync(siteData);
        toast.success('Site created successfully!');
      }
      
      // Navigate to the site details page
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
