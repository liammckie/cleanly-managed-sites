
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, UserPlus, Users, UserCircle } from 'lucide-react';
import { SiteFormData } from '../siteFormTypes';
import { ContactRecord } from '@/lib/types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useContacts } from '@/hooks/useContacts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactsStepProps {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleContactChange: (index: number, field: keyof ContactRecord, value: any) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
  addExistingContact?: (contactId: string) => void;
}

export function ContactsStep({
  formData,
  errors,
  handleContactChange,
  addContact,
  removeContact,
  addExistingContact
}: ContactsStepProps) {
  const { contacts: existingContacts } = useContacts();
  const [isExistingContactDialogOpen, setIsExistingContactDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [expandedContact, setExpandedContact] = useState<number | null>(null);
  
  // Handler to add a contact
  const handleAddContact = () => {
    addContact();
  };
  
  // Handler to add an existing contact
  const handleAddExistingContact = () => {
    if (selectedContactId && addExistingContact) {
      addExistingContact(selectedContactId);
      setIsExistingContactDialogOpen(false);
      setSelectedContactId('');
    }
  };

  // Toggle expanded view for a contact
  const toggleContactExpand = (index: number) => {
    setExpandedContact(expandedContact === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Site Contacts</h3>
        <div className="flex space-x-2">
          <Dialog open={isExistingContactDialogOpen} onOpenChange={setIsExistingContactDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex items-center"
              >
                <Users className="mr-1 h-4 w-4" /> Add Existing Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Existing Contact</DialogTitle>
                <DialogDescription>
                  Select a contact from your existing contacts to add to this site.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="select-contact">Select Contact</Label>
                  <Select 
                    value={selectedContactId} 
                    onValueChange={setSelectedContactId}
                  >
                    <SelectTrigger id="select-contact">
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingContacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} - {contact.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddExistingContact}
                  disabled={!selectedContactId}
                  className="w-full"
                >
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            type="button"
            size="sm"
            onClick={handleAddContact}
            className="flex items-center"
          >
            <UserPlus className="mr-1 h-4 w-4" /> New Contact
          </Button>
        </div>
      </div>
      
      {formData.contacts.length === 0 ? (
        <div className="py-8 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground">No contacts added yet. Click 'New Contact' to add your first contact or 'Add Existing Contact' to use a contact from your database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {formData.contacts.map((contact, index) => (
            <Card key={index} className={`${expandedContact === index ? 'md:col-span-2' : ''} hover:shadow-md transition-shadow duration-200`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-base flex items-center">
                    <UserCircle className="mr-2 h-5 w-5 text-primary" />
                    {contact.name || 'Unnamed Contact'}
                    {contact.is_primary && (
                      <Badge className="ml-2 bg-primary hover:bg-primary/90">Primary</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{contact.role}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleContactExpand(index)}
                  >
                    {expandedContact === index ? 'Collapse' : 'Expand'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {expandedContact === index ? (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${index}-name`}>
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`contact-${index}-name`}
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        className="glass-input"
                        placeholder="Contact name"
                      />
                      {errors[`contacts[${index}].name`] && (
                        <p className="text-sm text-destructive">{errors[`contacts[${index}].name`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${index}-role`}>
                        Role <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={contact.role}
                        onValueChange={(value) => handleContactChange(index, 'role', value)}
                      >
                        <SelectTrigger id={`contact-${index}-role`} className="glass-input">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="site_manager">Site Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`contacts[${index}].role`] && (
                        <p className="text-sm text-destructive">{errors[`contacts[${index}].role`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${index}-department`}>Department</Label>
                      <Input
                        id={`contact-${index}-department`}
                        value={contact.department || ''}
                        onChange={(e) => handleContactChange(index, 'department', e.target.value)}
                        className="glass-input"
                        placeholder="Department"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${index}-email`}>Email</Label>
                      <Input
                        id={`contact-${index}-email`}
                        type="email"
                        value={contact.email || ''}
                        onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                        className="glass-input"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`contact-${index}-phone`}>Phone</Label>
                      <Input
                        id={`contact-${index}-phone`}
                        value={contact.phone || ''}
                        onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                        className="glass-input"
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-8">
                      <Switch
                        id={`contact-${index}-primary`}
                        checked={!!contact.is_primary}
                        onCheckedChange={(checked) => handleContactChange(index, 'is_primary', checked)}
                      />
                      <Label htmlFor={`contact-${index}-primary`}>Primary Contact</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`contact-${index}-notes`}>Notes</Label>
                    <Textarea
                      id={`contact-${index}-notes`}
                      value={contact.notes || ''}
                      onChange={(e) => handleContactChange(index, 'notes', e.target.value)}
                      className="glass-input"
                      placeholder="Additional notes"
                      rows={3}
                    />
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {contact.email && (
                      <div>
                        <span className="text-muted-foreground">Email:</span> {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {contact.phone}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {formData.contacts.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full mt-4"
          onClick={handleAddContact}
        >
          <Plus className="mr-1 h-4 w-4" /> Add Another Contact
        </Button>
      )}
    </div>
  );
}
