
import { useState } from 'react';
import { toast } from 'sonner';

export function useErrorHandling() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleError = (error: any, defaultMessage: string = 'An error occurred') => {
    console.error('Error:', error);
    
    // Extract error message if available
    let message = defaultMessage;
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = error.message as string;
    }
    
    // Set error message and show toast
    setErrorMessage(message);
    toast.error(message);
    
    return message;
  };
  
  const clearError = () => {
    setErrorMessage(null);
  };
  
  return {
    errorMessage,
    handleError,
    clearError
  };
}
