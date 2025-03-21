
import React from 'react';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { Building2 } from 'lucide-react';

interface BusinessBrandingProps {
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BusinessBranding: React.FC<BusinessBrandingProps> = ({ 
  showName = true, 
  size = 'md',
  className = '' 
}) => {
  const { businessDetails, isLoading } = useBusinessDetails();
  
  // Size classes for the logo
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Size classes for the text
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };
  
  // If loading or no business details, show a placeholder
  if (isLoading || !businessDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`bg-muted flex items-center justify-center rounded-md ${sizeClasses[size]}`}>
          <Building2 className="text-muted-foreground/50 w-3/4 h-3/4" />
        </div>
        {showName && (
          <span className={`font-semibold ${textSizeClasses[size]}`}>
            Your Business
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {businessDetails.logo_url ? (
        <img 
          src={businessDetails.logo_url} 
          alt={businessDetails.name || 'Business Logo'} 
          className={`rounded-md object-contain ${sizeClasses[size]}`}
        />
      ) : (
        <div className={`bg-muted flex items-center justify-center rounded-md ${sizeClasses[size]}`}>
          <Building2 className="text-muted-foreground/50 w-3/4 h-3/4" />
        </div>
      )}
      
      {showName && businessDetails.name && (
        <span className={`font-semibold ${textSizeClasses[size]}`}>
          {businessDetails.name}
        </span>
      )}
    </div>
  );
};
