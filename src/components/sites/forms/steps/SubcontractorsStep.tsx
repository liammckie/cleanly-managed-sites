
import React, { useState } from 'react';
import { FormSection } from '../FormSection';
import { useContractors } from '@/hooks/useContractors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Subcontractor, getBusinessName, getContactName } from '../types/subcontractorTypes';
import { Trash2, PlusCircle, Edit, Building } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface SubcontractorsStepProps {
  subcontractors: Subcontractor[];
  addSubcontractor: (subcontractor: Subcontractor) => void;
  updateSubcontractor: (index: number, subcontractor: Subcontractor) => void;
  removeSubcontractor: (index: number) => void;
}

export function SubcontractorsStep({
  subcontractors,
  addSubcontractor,
  updateSubcontractor,
  removeSubcontractor
}: SubcontractorsStepProps) {
  const { contractors, isLoading } = useContractors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContractorId, setSelectedContractorId] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [subcontractorForm, setSubcontractorForm] = useState<Subcontractor>({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    services: [],
    notes: ''
  });

  const resetForm = () => {
    setSubcontractorForm({
      business_name: '',
      contact_name: '',
      email: '',
      phone: '',
      services: [],
      notes: ''
    });
    setSelectedContractorId('');
    setIsCustom(false);
    setSelectedIndex(null);
  };

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      const subcontractor = subcontractors[index];
      setSubcontractorForm({
        ...subcontractor,
        business_name: getBusinessName(subcontractor),
        contact_name: getContactName(subcontractor)
      });
      setSelectedContractorId(subcontractor.contractor_id || '');
      setIsCustom(!subcontractor.contractor_id);
      setSelectedIndex(index);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSelectContractor = (contractorId: string) => {
    if (contractorId === 'custom') {
      setIsCustom(true);
      setSelectedContractorId('');
      setSubcontractorForm({
        business_name: '',
        contact_name: '',
        email: '',
        phone: '',
        services: [],
        notes: ''
      });
    } else {
      setIsCustom(false);
      setSelectedContractorId(contractorId);
      const contractor = contractors.find(c => c.id === contractorId);
      if (contractor) {
        setSubcontractorForm({
          contractor_id: contractor.id,
          business_name: contractor.business_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          phone: contractor.phone,
          services: [],
          notes: ''
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubcontractorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectService = (value: string) => {
    setSubcontractorForm(prev => ({
      ...prev,
      services: [...(prev.services || []), value]
    }));
  };

  const handleSaveSubcontractor = () => {
    const newSubcontractor = {
      ...subcontractorForm,
      contractor_id: isCustom ? undefined : selectedContractorId
    };

    if (selectedIndex !== null) {
      updateSubcontractor(selectedIndex, newSubcontractor);
    } else {
      addSubcontractor(newSubcontractor);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <FormSection 
      title="Subcontractors & Service Providers" 
      description="Add subcontractors or other service providers for this site"
    >
      <div className="mb-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Subcontractor
        </Button>
      </div>

      {subcontractors.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcontractors.map((subcontractor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{getBusinessName(subcontractor)}</TableCell>
                  <TableCell>{getContactName(subcontractor)}</TableCell>
                  <TableCell>
                    {subcontractor.email && <div>{subcontractor.email}</div>}
                    {subcontractor.phone && <div>{subcontractor.phone}</div>}
                  </TableCell>
                  <TableCell>
                    {(subcontractor.services || []).length > 0 
                      ? subcontractor.services?.join(", ")
                      : <span className="text-muted-foreground italic">No services specified</span>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDialog(index)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeSubcontractor(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-3 text-lg font-medium">No Subcontractors</h3>
            <p className="text-sm text-muted-foreground">
              There are no subcontractors or service providers for this site yet.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedIndex !== null ? "Edit Subcontractor" : "Add Subcontractor"}
            </DialogTitle>
            <DialogDescription>
              Add a subcontractor or service provider for this site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subcontractor Type</Label>
              <Select 
                value={isCustom ? "custom" : selectedContractorId} 
                onValueChange={handleSelectContractor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contractor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom / Manual Entry</SelectItem>
                  {contractors.map(contractor => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      {contractor.business_name || contractor.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isCustom && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      name="business_name"
                      value={subcontractorForm.business_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Name</Label>
                    <Input
                      id="contact_name"
                      name="contact_name"
                      value={subcontractorForm.contact_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={subcontractorForm.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={subcontractorForm.phone || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Add any additional notes about this contractor"
                value={subcontractorForm.notes || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSubcontractor}>
              {selectedIndex !== null ? "Save Changes" : "Add Subcontractor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormSection>
  );
}
