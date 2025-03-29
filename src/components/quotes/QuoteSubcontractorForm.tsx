
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface QuoteSubcontractorFormProps {
  quoteId: string;
  onSubmit?: (subcontractorData: any) => void;
}

/**
 * A form component for managing quote subcontractors.
 */
const QuoteSubcontractorForm: React.FC<QuoteSubcontractorFormProps> = ({ quoteId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 0,
    frequency: 'monthly'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...formData, quoteId });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Subcontractor Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Subcontractor name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description of services"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Cost</label>
            <Input 
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min={0}
              step={0.01}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="once-off">Once-off</option>
            </select>
          </div>
        </div>
        
        <Button type="submit" className="mt-4">Save Subcontractor</Button>
      </div>
    </Form>
  );
};

export default QuoteSubcontractorForm;
