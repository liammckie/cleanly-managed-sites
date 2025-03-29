
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PermissionCheckbox } from './PermissionCheckbox';
import { useUserRoles } from '@/hooks/useUserRoles';
import { UserRole } from '@/lib/types/users';
import { Loader2 } from 'lucide-react';

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  standalone?: boolean;
}

export const NewRoleDialog: React.FC<NewRoleDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  standalone = false 
}) => {
  const { createRole, isCreating } = useUserRoles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    view_dashboard: true,
    manage_users: false,
    manage_roles: false,
    manage_clients: false,
    manage_sites: false,
    manage_contracts: false,
    manage_quotes: false,
    manage_invoices: false,
    manage_workorders: false,
    view_reports: false,
    manage_settings: false,
  });

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await createRole({ 
        name, 
        description, 
        permissions
      } as Omit<UserRole, 'id' | 'created_at' | 'updated_at'>);
      
      resetForm();
      if (onSuccess) onSuccess();
      if (!standalone) onOpenChange(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPermissions({
      view_dashboard: true,
      manage_users: false,
      manage_roles: false,
      manage_clients: false,
      manage_sites: false,
      manage_contracts: false,
      manage_quotes: false,
      manage_invoices: false,
      manage_workorders: false,
      view_reports: false,
      manage_settings: false,
    });
  };

  // If it's standalone, we should render just the content without the Dialog wrapper
  if (standalone) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {Object.entries(permissions).map(([permission, value]) => (
                  <PermissionCheckbox
                    key={permission}
                    permission={permission}
                    checked={value}
                    onChange={handlePermissionChange}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !name}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New User Role</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {Object.entries(permissions).map(([permission, value]) => (
                  <PermissionCheckbox
                    key={permission}
                    permission={permission}
                    checked={value}
                    onChange={handlePermissionChange}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !name}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoleDialog;
