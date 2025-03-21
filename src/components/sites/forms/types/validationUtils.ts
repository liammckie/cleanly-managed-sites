
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
  return phoneRegex.test(phone);
};

export const requiredFields = {
  basicInformation: ['name', 'address', 'city', 'state', 'postcode', 'representative', 'clientId'],
  contractDetails: ['startDate', 'contractNumber'],
  billingDetails: ['rate', 'billingFrequency', 'paymentTerms'],
  subcontractors: [] // Subcontractors are optional
};
