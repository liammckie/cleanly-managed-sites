
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteForm, UseSiteFormReturn } from '@/hooks/useSiteForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SiteFormData } from './types/siteFormData';
import SiteFormStepper from './SiteFormStepper';
import { Loader2 } from 'lucide-react';

interface EditSiteFormProps {
  initialData: SiteFormData;
  siteId: string;
}

const EditSiteForm: React.FC<EditSiteFormProps> = ({ initialData, siteId }) => {
  // Pass initialData correctly
  const siteForm: UseSiteFormReturn = useSiteForm({ ...initialData, id: siteId }, 'edit');
  
  const {
    formData,
    handleSubmit,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    isSubmitting,
    errors
  } = siteForm;

  // Adapter function to convert form control events to field/value pairs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name as keyof SiteFormData, value);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Edit Site</h1>
          <Separator className="mb-6" />
          
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
              <h3 className="font-medium">Form Errors</h3>
              <ul className="list-disc pl-5 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <SiteFormStepper 
              formData={formData} 
              onChange={handleChange}
              onNestedChange={handleNestedChange}
              onDoubleNestedChange={handleDoubleNestedChange}
              mode="edit"
            />
            
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditSiteForm;
