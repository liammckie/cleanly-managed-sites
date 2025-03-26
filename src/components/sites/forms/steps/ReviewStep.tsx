import React from 'react';
import { FormSection } from '@/components/sites/forms/FormSection';
import { SiteFormData } from '@/components/sites/forms/types';
import { getBusinessName, getContactName } from '@/components/sites/forms/types/subcontractorTypes';

interface ReviewStepProps {
  formData: SiteFormData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium">Site Information Summary</h3>
        
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
            <p className="mt-1 text-lg font-semibold">{formData.name}</p>
            <p className="mt-1">{formData.address}, {formData.city}, {formData.state} {formData.postcode}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="capitalize">{formData.status}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
            <p className="mt-1">{formData.representative}</p>
            {formData.phone && <p className="mt-1">{formData.phone}</p>}
            {formData.email && <p className="mt-1">{formData.email}</p>}
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Contract Details</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-muted-foreground">Contract #:</span>
                <p className="mt-1">{formData.contractDetails.contractNumber || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Contract Period:</span>
                <p className="mt-1">
                  {formData.contractDetails.startDate && formData.contractDetails.endDate 
                    ? `${formData.contractDetails.startDate} to ${formData.contractDetails.endDate}`
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Termination Period:</span>
                <p className="mt-1">{formData.contractDetails.terminationPeriod || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Billing Details</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-muted-foreground">Rate:</span>
                <p className="mt-1">{formData.billingDetails.rate || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Billing Frequency:</span>
                <p className="mt-1 capitalize">{formData.billingDetails.billingFrequency}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Payment Terms:</span>
                <p className="mt-1">{formData.billingDetails.paymentTerms}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Invoice Method:</span>
                <p className="mt-1 capitalize">{formData.billingDetails.invoiceMethod}</p>
              </div>
              {formData.billingDetails.accountNumber && (
                <div>
                  <span className="text-sm text-muted-foreground">Account #:</span>
                  <p className="mt-1">{formData.billingDetails.accountNumber}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Subcontractors Section */}
          {formData.subcontractors && formData.subcontractors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Subcontractors</h3>
              <ul className="list-disc ml-5 space-y-1">
                {formData.subcontractors.map((sub, idx) => (
                  <li key={idx}>
                    <strong>{getBusinessName(sub)}</strong>
                    {getContactName(sub) && <span> - Contact: {getContactName(sub)}</span>}
                    {sub.email && <span>, Email: {sub.email}</span>}
                    {sub.phone && <span>, Phone: {sub.phone}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-muted-foreground">Job Specifications</h4>
            <div className="mt-2">
              <p>{formData.jobSpecifications.daysPerWeek} days per week, {formData.jobSpecifications.hoursPerDay} hours per day</p>
              <p className="mt-1">{formData.jobSpecifications.directEmployees ? 'Direct Employees' : 'Subcontractors'}</p>
              {formData.jobSpecifications.notes && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Notes:</span>
                  <p className="mt-1">{formData.jobSpecifications.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">By submitting this form, you confirm that all provided information is correct.</p>
      </div>
    </div>
  );
}
