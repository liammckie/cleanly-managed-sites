
import React from 'react';
import { SiteFormData } from '../siteFormTypes';

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
            <h4 className="font-medium text-sm text-muted-foreground">Subcontractors</h4>
            <div className="mt-2 space-y-2">
              {formData.subcontractors.map((sub, index) => (
                <div key={index} className="p-2 bg-secondary rounded-md">
                  <p className="font-medium">{sub.businessName}</p>
                  <p className="text-sm">{sub.contactName} | {sub.email} | {sub.phone}</p>
                </div>
              ))}
            </div>
          </div>
          
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
