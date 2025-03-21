
import { BusinessDetails } from '@/lib/api/businessDetails/businessDetailsApi';

export type BusinessFormValues = {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  industry?: string;
  description?: string;
  business_hours?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export const mapBusinessDetailsToFormValues = (details: BusinessDetails | null): BusinessFormValues => {
  if (!details) {
    return {
      name: '',
      social_media: {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: ''
      }
    };
  }

  return {
    name: details.name || '',
    address: details.address || '',
    city: details.city || '',
    state: details.state || '',
    postcode: details.postcode || '',
    phone: details.phone || '',
    email: details.email || '',
    website: details.website || '',
    tax_id: details.tax_id || '',
    industry: details.industry || '',
    description: details.description || '',
    business_hours: details.business_hours || '',
    social_media: details.social_media || {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  };
};
