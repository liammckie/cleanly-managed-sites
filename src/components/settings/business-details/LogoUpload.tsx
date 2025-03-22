
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, Building2, AlertCircle } from 'lucide-react';
import { isImageFile } from '@/lib/fileUtils';
import { toast } from 'sonner';

interface LogoUploadProps {
  logoUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export const LogoUpload = ({ logoUrl, isUploading, onUpload }: LogoUploadProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Update preview when logoUrl changes
  useEffect(() => {
    if (logoUrl) {
      console.log('Setting logo preview from URL:', logoUrl);
      setLogoPreview(logoUrl);
    }
  }, [logoUrl]);
  
  const handleFileButtonClick = () => {
    if (isUploading) return;
    
    // Manually trigger file input click
    if (fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.error('File input reference is not available');
    }
  };
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!isImageFile(file.name)) {
      setUploadError('Please upload an image file (jpg, png, gif, etc.)');
      toast.error('Invalid file type. Please upload an image.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }
    
    // Create a preview
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('Preview created for file');
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      console.log('Uploading file...');
      await onUpload(file);
      console.log('Upload completed successfully');
      
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadError('Failed to upload logo');
      toast.error('Failed to upload logo');
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border rounded-lg overflow-hidden w-full aspect-square flex items-center justify-center bg-muted relative">
        {logoPreview ? (
          <img 
            src={logoPreview} 
            alt="Business Logo" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <Building2 className="h-20 w-20 text-muted-foreground/40" />
        )}
      </div>
      
      <div className="w-full">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          disabled={isUploading}
          onClick={handleFileButtonClick}
        >
          {isUploading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </>
          )}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
          disabled={isUploading}
        />
        
        {uploadError && (
          <div className="text-xs text-destructive mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {uploadError}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Recommended: Square image, 512x512px or larger (max 5MB)
        </p>
      </div>
    </div>
  );
};
