
import React, { useEffect } from 'react';
import { useZapierIntegration } from '@/hooks/useZapierIntegration';
import { setZapierTriggers } from '@/utils/webhookTriggers';

export const ZapierProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const zapierIntegration = useZapierIntegration();

  useEffect(() => {
    // Set the Zapier triggers when the component mounts
    if (zapierIntegration) {
      setZapierTriggers(zapierIntegration);
    }
  }, [zapierIntegration]);

  return <>{children}</>;
};
