
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { ContractTerm } from '@/components/sites/forms/types/contractTypes';
import { v4 as uuidv4 } from 'uuid';

interface ContractTermsSectionProps {
  contractTerms: ContractTerm[];
  onChange: (terms: ContractTerm[]) => void;
}

export const ContractTermsSection: React.FC<ContractTermsSectionProps> = ({
  contractTerms,
  onChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState<ContractTerm | null>(null);
  const [term, setTerm] = useState<ContractTerm>({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    renewalTerms: '',
    terminationPeriod: '',
    autoRenew: false,
  });

  const handleAddTerm = () => {
    setShowForm(true);
    setEditingTerm(null);
    setTerm({
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      renewalTerms: '',
      terminationPeriod: '',
      autoRenew: false,
    });
  };

  const handleEditTerm = (term: ContractTerm) => {
    setShowForm(true);
    setEditingTerm(term);
    setTerm({
      ...term,
      id: term.id // Ensure ID is preserved
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTerm) {
      // Update existing term
      const updatedTerms = contractTerms.map((t) =>
        t.id === editingTerm.id ? { ...term, id: editingTerm.id } : t
      );
      onChange(updatedTerms);
    } else {
      // Add new term
      const newTerm = { ...term, id: uuidv4() };
      onChange([...contractTerms, newTerm]);
    }

    setShowForm(false);
    setEditingTerm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTerm(null);
  };

  const handleDelete = (id: string) => {
    onChange(contractTerms.filter((term) => term.id !== id));
  };

  const handleChange = (name: string, value: any) => {
    setTerm({ ...term, [name]: value });
  };

  return (
    <div className="space-y-6 my-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contract Terms</h3>
        <Button variant="outline" size="sm" onClick={handleAddTerm}>
          Add Term
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTerm ? 'Edit Term' : 'Add Term'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Term Name</Label>
                  <Input
                    id="name"
                    value={term.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminationPeriod">Termination Period</Label>
                  <Input
                    id="terminationPeriod"
                    value={term.terminationPeriod}
                    onChange={(e) =>
                      handleChange('terminationPeriod', e.target.value)
                    }
                    placeholder="e.g. 30 days notice"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePicker
                    value={term.startDate ? new Date(term.startDate) : undefined}
                    onChange={(date) =>
                      handleChange(
                        'startDate',
                        date ? date.toISOString().split('T')[0] : ''
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePicker
                    value={term.endDate ? new Date(term.endDate) : undefined}
                    onChange={(date) =>
                      handleChange(
                        'endDate',
                        date ? date.toISOString().split('T')[0] : ''
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewalTerms">Renewal Terms</Label>
                <Textarea
                  id="renewalTerms"
                  value={term.renewalTerms}
                  onChange={(e) =>
                    handleChange('renewalTerms', e.target.value)
                  }
                  placeholder="Describe renewal terms..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRenew"
                  checked={term.autoRenew}
                  onCheckedChange={(checked) =>
                    handleChange('autoRenew', checked)
                  }
                />
                <Label htmlFor="autoRenew">Auto-Renew</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTerm ? 'Update Term' : 'Add Term'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {contractTerms.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No contract terms defined</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add terms to define contract duration, renewal options, and more
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contractTerms.map((term) => (
            <Card key={term.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{term.name}</h4>
                    {term.startDate && term.endDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(term.startDate).toLocaleDateString()} -{' '}
                        {new Date(term.endDate).toLocaleDateString()}
                      </p>
                    )}
                    {term.renewalTerms && (
                      <p className="text-sm mt-2">{term.renewalTerms}</p>
                    )}
                    {term.autoRenew && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Auto-Renew
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTerm(term)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(term.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
