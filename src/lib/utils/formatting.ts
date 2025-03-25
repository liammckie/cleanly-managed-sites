
import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return 'N/A';
  
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) return 'Invalid date';
    
    return format(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-AU').format(num);
};

export const formatPercentage = (decimal?: number): string => {
  if (decimal === undefined || decimal === null) return '0%';
  return `${(decimal * 100).toFixed(1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Australian format
  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};
