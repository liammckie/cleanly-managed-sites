
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuoteCreate } from '@/hooks/quotes/useQuoteCreate';
import { useQuoteUpdate } from '@/hooks/quotes/useQuoteUpdate';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShiftPlanner } from './ShiftPlanner';
import { SubcontractorSection } from './SubcontractorSection';
import { QuoteDetailsForm } from './QuoteDetailsForm';
import { QuoteSummary } from './QuoteSummary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useOverheadProfiles } from '@/hooks/quotes/useOverheadProfiles';
import { OverheadProfile } from '@/lib/utils/typeAdapters';

// The component handles both creation and editing of quotes
export function QuoteForm({ quoteId, initialData }: { quoteId?: string; initialData?: any }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createQuote, isCreating } = useQuoteCreate();
  const { updateQuote, isUpdating } = useQuoteUpdate();
  const { data: overheadProfiles = [], isLoading: isLoadingProfiles } = useOverheadProfiles();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    siteName: '',
    clientContact: '',
    clientEmail: '',
    clientPhone: '',
    siteAddress: '',
    startDate: '',
    endDate: '',
    expiryDate: '',
    notes: '',
    frequency: 'weekly',
    scope: '',
    terms: '',
    status: 'draft',
    overheadProfile: '',
    overheadPercentage: 15,
    marginPercentage: 20,
    clientId: '',
    siteId: '',
    ...(initialData || {})
  });
  
  const [shifts, setShifts] = useState(initialData?.shifts || []);
  const [subcontractors, setSubcontractors] = useState(initialData?.subcontractors || []);
  
  // Update form when initialData changes (for edits)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        clientName: initialData.clientName || initialData.client_name || '',
        siteName: initialData.siteName || initialData.site_name || '',
        clientContact: initialData.clientContact || '',
        clientEmail: initialData.clientEmail || '',
        clientPhone: initialData.clientPhone || '',
        siteAddress: initialData.siteAddress || '',
        startDate: initialData.startDate || initialData.start_date || '',
        endDate: initialData.endDate || initialData.end_date || '',
        expiryDate: initialData.expiryDate || initialData.expiry_date || '',
        notes: initialData.notes || '',
        frequency: initialData.frequency || 'weekly',
        scope: initialData.scope || '',
        terms: initialData.terms || '',
        status: initialData.status || 'draft',
        overheadProfile: initialData.overheadProfile || '',
        overheadPercentage: initialData.overheadPercentage || initialData.overhead_percentage || 15,
        marginPercentage: initialData.marginPercentage || initialData.margin_percentage || 20,
        clientId: initialData.clientId || initialData.client_id || '',
        siteId: initialData.siteId || initialData.site_id || '',
      });
      
      if (initialData.shifts) {
        setShifts(initialData.shifts);
      }
      
      if (initialData.subcontractors) {
        setSubcontractors(initialData.subcontractors);
      }
    }
  }, [initialData]);
  
  // Field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle shifts update
  const handleShiftsChange = (newShifts: any[]) => {
    setShifts(newShifts);
  };
  
  // Handle subcontractors update
  const handleSubcontractorsChange = (newSubcontractors: any[]) => {
    setSubcontractors(newSubcontractors);
  };
  
  // Handle overhead profile selection
  const handleOverheadProfileSelect = (profileId: string) => {
    if (!profileId) {
      setFormData(prev => ({ 
        ...prev, 
        overheadProfile: '',
        overheadPercentage: 15 // Default
      }));
      return;
    }
    
    // Find selected profile
    const profile = overheadProfiles.find((p: any) => p.id === profileId);
    if (profile) {
      setFormData(prev => ({ 
        ...prev,
        overheadProfile: profileId,
        overheadPercentage: profile.laborPercentage || 15
      }));
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data for submission
      const quoteData = {
        ...formData,
        shifts,
        subcontractors,
        // Add missing required fields
        laborCost: 0, // Will be calculated on the server
        suppliesCost: 0,
        equipmentCost: 0,
        subcontractorCost: 0,
        totalCost: 0,
        marginAmount: 0,
        totalPrice: 0,
      };
      
      // Create or update quote based on whether we have a quoteId
      if (quoteId) {
        // Update
        await updateQuote({
          ...quoteData,
          id: quoteId
        });
        toast({
          title: "Quote Updated",
          description: "The quote has been successfully updated.",
        });
      } else {
        // Create
        const result = await createQuote(quoteData);
        toast({
          title: "Quote Created",
          description: "The quote has been successfully created.",
        });
        navigate(`/quotes/${result?.id}`);
        return;
      }
      
      // Return to quotes list
      navigate('/quotes');
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the quote. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Formatted list of overhead profiles for select dropdown
  const formattedProfiles = overheadProfiles.map((profile: unknown) => ({
    value: typeof profile === 'object' && profile !== null && 'id' in profile ? String(profile.id) : '',
    label: typeof profile === 'object' && profile !== null && 'name' in profile ? String(profile.name) : '',
    laborPercentage: typeof profile === 'object' && profile !== null && 'laborPercentage' in profile ? 
      Number(profile.laborPercentage) : 15
  }));
  
  const isSubmitting = isCreating || isUpdating;
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{quoteId ? 'Edit Quote' : 'Create New Quote'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Quote Details</TabsTrigger>
              <TabsTrigger value="shifts">Shift Planning</TabsTrigger>
              <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
              <TabsTrigger value="summary">Quote Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <QuoteDetailsForm 
                formData={formData}
                onChange={handleChange}
                onOverheadProfileSelect={handleOverheadProfileSelect}
                overheadProfiles={formattedProfiles}
                isLoadingProfiles={isLoadingProfiles}
              />
            </TabsContent>
            
            <TabsContent value="shifts">
              <ShiftPlanner 
                quoteId={quoteId || null} 
                shifts={shifts} 
                onShiftsChange={handleShiftsChange} 
              />
            </TabsContent>
            
            <TabsContent value="subcontractors">
              <SubcontractorSection 
                subcontractors={subcontractors}
                onSubcontractorsChange={handleSubcontractorsChange}
              />
            </TabsContent>
            
            <TabsContent value="summary">
              <QuoteSummary 
                quoteId={quoteId || null}
                shifts={shifts}
                subcontractors={subcontractors}
                overheadPercentage={Number(formData.overheadPercentage)}
                marginPercentage={Number(formData.marginPercentage)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/quotes')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
          {quoteId ? 'Update Quote' : 'Create Quote'}
        </Button>
      </div>
    </form>
  );
}
