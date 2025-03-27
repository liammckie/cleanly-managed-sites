
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { permissionCategories, permissionDescriptions } from '@/lib/permissions';

interface CreateRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated?: () => void;
}

export default function CreateRoleDialog({ isOpen, onClose, onRoleCreated }: CreateRoleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createRole } = useRoles();
  
  const handlePermissionChange = (permissionKey: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Role name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createRole({
        name,
        description,
        permissions
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPermissions({});
      
      // Close dialog
      onClose();
      
      // Notify parent
      if (onRoleCreated) {
        onRoleCreated();
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create role');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Operations Manager"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Role description and responsibilities"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              
              {permissionCategories.map((category) => (
                <Card key={category.name}>
                  <CardContent className="pt-6">
                    <h4 className="text-md font-medium mb-4">{category.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.permissions.map((permission) => (
                        <div key={permission} className="flex items-start space-x-3">
                          <Button
                            type="button"
                            variant={permissions[permission] ? "default" : "outline"}
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full"
                            onClick={() => handlePermissionChange(permission, !permissions[permission])}
                          >
                            {permissions[permission] ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{permission}</p>
                            <p className="text-xs text-muted-foreground">
                              {permissionDescriptions[permission] || ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
