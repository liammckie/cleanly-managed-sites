
import React, { useEffect, useState } from 'react';
import { SiteFormData } from '../types/siteFormData';
import { useSiteFormData } from './useSiteFormData';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditSiteFormProps {
  initialData: Partial<SiteFormData>;
  siteId: string;
  onSubmit: (data: SiteFormData) => void;
  isLoading: boolean;
}

// Changed from default export to named export
export const EditSiteForm: React.FC<EditSiteFormProps> = ({ initialData, siteId, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    status: 'active',
    contacts: [],
    ...initialData
  });
  
  const form = useForm<SiteFormData>({
    defaultValues: formData
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [initialData, form]);
  
  const { formData: processedFormData } = useSiteFormData(initialData as any, formData, setFormData, form);
  
  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Edit Site</h2>
          
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contract">Contract</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input
                      type="text"
                      {...form.register('name')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      {...form.register('status')}
                      className="w-full p-2 border rounded"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                      <option value="lost">Lost</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    {...form.register('address')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      {...form.register('city')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      {...form.register('state')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      {...form.register('postalCode')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      {...form.register('country')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contract">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contract Start Date</label>
                    <input
                      type="date"
                      {...form.register('contract_details.startDate')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contract End Date</label>
                    <input
                      type="date"
                      {...form.register('contract_details.endDate')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contract Type</label>
                    <select
                      {...form.register('contract_details.contractType')}
                      className="w-full p-2 border rounded"
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contract Number</label>
                    <input
                      type="text"
                      {...form.register('contract_details.contractNumber')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Notes</label>
                  <textarea
                    {...form.register('contract_details.notes')}
                    className="w-full p-2 border rounded"
                    rows={4}
                  ></textarea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing Method</label>
                    <select
                      {...form.register('billingDetails.billingMethod')}
                      className="w-full p-2 border rounded"
                    >
                      <option value="invoice">Invoice</option>
                      <option value="direct_debit">Direct Debit</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Terms</label>
                    <select
                      {...form.register('billingDetails.paymentTerms')}
                      className="w-full p-2 border rounded"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Weekly Revenue</label>
                    <input
                      type="number"
                      {...form.register('weeklyRevenue')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Revenue</label>
                    <input
                      type="number"
                      {...form.register('monthlyRevenue')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Annual Revenue</label>
                    <input
                      type="number"
                      {...form.register('annualRevenue')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Billing Notes</label>
                  <textarea
                    {...form.register('billingDetails.notes')}
                    className="w-full p-2 border rounded"
                    rows={4}
                  ></textarea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="additional">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    {...form.register('notes')}
                    className="w-full p-2 border rounded"
                    rows={6}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      {...form.register('phone')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      {...form.register('email')}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
};

// Also export as default for backward compatibility
export default EditSiteForm;
