
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';
import { ClientRecord } from '@/lib/api';
import { ClientFormData, initialFormData } from './types';
import { validateClientForm } from './clientFormValidation';

export function useClientForm(mode: 'create' | 'edit', client?: ClientRecord) {
  const navigate = useNavigate();
  const { createClient, updateClient, isCreating, isUpdating } = useClients();
  
  const [formData, setFormData] = useState<ClientFormData>(
    client 
      ? {
          name: client.name,
          contact_name: client.contact_name,
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          city: client.city || '',
          state: client.state || '',
          postcode: client.postcode || '',
          status: client.status as any,
          notes: client.notes || '',
        } 
      : initialFormData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as any
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors = validateClientForm(formData);
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (mode === 'create') {
        await createClient(formData);
        navigate('/clients');
      } else if (mode === 'edit' && client) {
        await updateClient({ id: client.id, data: formData });
        navigate(`/clients/${client.id}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleCancel = () => {
    if (mode === 'edit' && client) {
      navigate(`/clients/${client.id}`);
    } else {
      navigate('/clients');
    }
  };
  
  return {
    formData,
    errors,
    isLoading: isCreating || isUpdating,
    handleChange,
    handleSelectChange,
    handleStatusChange,
    handleSubmit,
    handleCancel
  };
}
