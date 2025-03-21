
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData, BillingContact } from '../siteFormTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
}

export function BillingDetailsStep({ 
  formData, 
  handleNestedChange, 
  handleDoubleNestedChange 
}: BillingDetailsStepProps) {
  const [activeTab, setActiveTab] = useState("main");
  
  // Handler for billing address checkbox
  const handleUseSiteAddress = (checked: boolean) => {
    handleNestedChange('billingDetails', 'useSiteAddress', checked);
    
    if (checked) {
      // Copy site address to billing address
      handleNestedChange('billingDetails', 'billingAddress', formData.address);
      handleNestedChange('billingDetails', 'billingCity', formData.city);
      handleNestedChange('billingDetails', 'billingState', formData.state);
      handleNestedChange('billingDetails', 'billingPostcode', formData.postcode);
    }
  };
  
  // Add new billing contact
  const addBillingContact = () => {
    const newContact: BillingContact = {
      name: '',
      position: '',
      email: '',
      phone: ''
    };
    
    const updatedContacts = [...(formData.billingDetails.contacts || []), newContact];
    handleNestedChange('billingDetails', 'contacts', updatedContacts);
  };
  
  // Remove billing contact
  const removeBillingContact = (index: number) => {
    const updatedContacts = [...(formData.billingDetails.contacts || [])];
    updatedContacts.splice(index, 1);
    handleNestedChange('billingDetails', 'contacts', updatedContacts);
  };
  
  // Update billing contact field
  const updateBillingContact = (index: number, field: keyof BillingContact, value: string) => {
    const updatedContacts = [...(formData.billingDetails.contacts || [])];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    handleNestedChange('billingDetails', 'contacts', updatedContacts);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="main">Main Billing</TabsTrigger>
          <TabsTrigger value="contacts">Billing Contacts</TabsTrigger>
          <TabsTrigger value="adhoc">Ad-Hoc Work</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-medium">Billing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Rate</Label>
                <Input
                  id="rate"
                  placeholder="e.g., $250 per week"
                  value={formData.billingDetails.rate}
                  onChange={(e) => handleNestedChange('billingDetails', 'rate', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-frequency">Billing Frequency</Label>
                <Select 
                  value={formData.billingDetails.billingFrequency} 
                  onValueChange={(value) => handleNestedChange('billingDetails', 'billingFrequency', value)}
                >
                  <SelectTrigger id="billing-frequency" className="glass-input">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select 
                  value={formData.billingDetails.paymentTerms} 
                  onValueChange={(value) => handleNestedChange('billingDetails', 'paymentTerms', value)}
                >
                  <SelectTrigger id="payment-terms" className="glass-input">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="7 days">7 days</SelectItem>
                    <SelectItem value="14 days">14 days</SelectItem>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="60 days">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-method">Invoice Method</Label>
                <Select 
                  value={formData.billingDetails.invoiceMethod} 
                  onValueChange={(value) => handleNestedChange('billingDetails', 'invoiceMethod', value)}
                >
                  <SelectTrigger id="invoice-method" className="glass-input">
                    <SelectValue placeholder="Select invoice method" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="mail">Mail</SelectItem>
                    <SelectItem value="portal">Client Portal</SelectItem>
                    <SelectItem value="xero">Xero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Client account number"
                  value={formData.billingDetails.accountNumber}
                  onChange={(e) => handleNestedChange('billingDetails', 'accountNumber', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-email">Billing Email</Label>
                <Input
                  id="billing-email"
                  type="email"
                  placeholder="accounts@company.com"
                  value={formData.billingDetails.billingEmail}
                  onChange={(e) => handleNestedChange('billingDetails', 'billingEmail', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="purchase-order-required" 
                  checked={formData.billingDetails.purchaseOrderRequired}
                  onCheckedChange={(checked) => 
                    handleNestedChange('billingDetails', 'purchaseOrderRequired', !!checked)
                  }
                />
                <Label htmlFor="purchase-order-required">Purchase Order Required</Label>
              </div>
              
              {formData.billingDetails.purchaseOrderRequired && (
                <div className="space-y-2">
                  <Label htmlFor="purchase-order">Purchase Order Number</Label>
                  <Input
                    id="purchase-order"
                    placeholder="PO-12345"
                    value={formData.billingDetails.purchaseOrderNumber}
                    onChange={(e) => handleNestedChange('billingDetails', 'purchaseOrderNumber', e.target.value)}
                    className="glass-input"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / ABN</Label>
                <Input
                  id="tax-id"
                  placeholder="Tax ID or ABN"
                  value={formData.billingDetails.taxId}
                  onChange={(e) => handleNestedChange('billingDetails', 'taxId', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="xero-id">Xero Contact ID</Label>
                <Input
                  id="xero-id"
                  placeholder="Xero Contact ID (if applicable)"
                  value={formData.billingDetails.xeroContactId}
                  onChange={(e) => handleNestedChange('billingDetails', 'xeroContactId', e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="use-site-address" 
                checked={formData.billingDetails.useSiteAddress}
                onCheckedChange={(checked) => handleUseSiteAddress(!!checked)}
              />
              <Label htmlFor="use-site-address">Same as Site Address</Label>
            </div>
            
            {!formData.billingDetails.useSiteAddress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Input
                    id="billing-address"
                    placeholder="Billing street address"
                    value={formData.billingDetails.billingAddress}
                    onChange={(e) => handleNestedChange('billingDetails', 'billingAddress', e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-city">City</Label>
                  <Input
                    id="billing-city"
                    placeholder="City"
                    value={formData.billingDetails.billingCity}
                    onChange={(e) => handleNestedChange('billingDetails', 'billingCity', e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-state">State</Label>
                  <Input
                    id="billing-state"
                    placeholder="State"
                    value={formData.billingDetails.billingState}
                    onChange={(e) => handleNestedChange('billingDetails', 'billingState', e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-postcode">Postcode</Label>
                  <Input
                    id="billing-postcode"
                    placeholder="Postcode"
                    value={formData.billingDetails.billingPostcode}
                    onChange={(e) => handleNestedChange('billingDetails', 'billingPostcode', e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-medium">Additional Billing Notes</h3>
            <Textarea
              placeholder="Add any special billing requirements or notes here"
              className="glass-input min-h-32"
              value={formData.billingDetails.notes}
              onChange={(e) => handleNestedChange('billingDetails', 'notes', e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Billing Contacts</h3>
              <Button onClick={addBillingContact} variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
            
            {(formData.billingDetails.contacts || []).length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No billing contacts added. Click "Add Contact" to add a billing contact.
              </div>
            ) : (
              <div className="space-y-4">
                {(formData.billingDetails.contacts || []).map((contact, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3 flex flex-row justify-between items-center">
                      <CardTitle className="text-md">Contact {index + 1}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeBillingContact(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-${index}-name`}>Name</Label>
                        <Input
                          id={`contact-${index}-name`}
                          value={contact.name}
                          onChange={(e) => updateBillingContact(index, 'name', e.target.value)}
                          placeholder="Contact name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`contact-${index}-position`}>Position</Label>
                        <Input
                          id={`contact-${index}-position`}
                          value={contact.position}
                          onChange={(e) => updateBillingContact(index, 'position', e.target.value)}
                          placeholder="Position/Title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`contact-${index}-email`}>Email</Label>
                        <Input
                          id={`contact-${index}-email`}
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateBillingContact(index, 'email', e.target.value)}
                          placeholder="Email address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`contact-${index}-phone`}>Phone</Label>
                        <Input
                          id={`contact-${index}-phone`}
                          value={contact.phone}
                          onChange={(e) => updateBillingContact(index, 'phone', e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="adhoc" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-medium">Ad-Hoc Work Authorization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approval-limit">Approval Limit (USD)</Label>
                <Input
                  id="approval-limit"
                  type="number"
                  placeholder="500"
                  value={formData.adHocWorkAuthorization.approvalLimit.toString()}
                  onChange={(e) => handleNestedChange(
                    'adHocWorkAuthorization', 
                    'approvalLimit', 
                    parseInt(e.target.value || '0')
                  )}
                  className="glass-input"
                />
              </div>
              
              <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="require-po" 
                  checked={formData.adHocWorkAuthorization.requirePurchaseOrder}
                  onCheckedChange={(checked) => 
                    handleNestedChange('adHocWorkAuthorization', 'requirePurchaseOrder', !!checked)
                  }
                />
                <Label htmlFor="require-po">Requires Purchase Order for Ad-Hoc Work</Label>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="font-medium mb-3">Approver Details</h4>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approver-name">Approver Name</Label>
                <Input
                  id="approver-name"
                  placeholder="Name of person who can approve work"
                  value={formData.adHocWorkAuthorization.approverName}
                  onChange={(e) => handleNestedChange('adHocWorkAuthorization', 'approverName', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approver-email">Approver Email</Label>
                <Input
                  id="approver-email"
                  type="email"
                  placeholder="approver@company.com"
                  value={formData.adHocWorkAuthorization.approverEmail}
                  onChange={(e) => handleNestedChange('adHocWorkAuthorization', 'approverEmail', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approver-phone">Approver Phone</Label>
                <Input
                  id="approver-phone"
                  placeholder="Phone number"
                  value={formData.adHocWorkAuthorization.approverPhone}
                  onChange={(e) => handleNestedChange('adHocWorkAuthorization', 'approverPhone', e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
