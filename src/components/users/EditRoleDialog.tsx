
import React, { useState, useEffect } from 'react';
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

interface EditRoleDialogProps {
  open: boolean;
  role: UserRole;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  standalone?: boolean;
}

export const EditRoleDialog: React.FC<EditRoleDialogProps> = ({ 
  open, 
  role, 
  onOpenChange, 
  onSuccess,
  standalone = false 
}) => {
  const { updateRole, isUpdating } = useUserRoles();
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description || '');
  const [permissions, setPermissions] = useState<Record<string, boolean>>(role.permissions || {});

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      setPermissions(role.permissions || {});
    }
  }, [role]);

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
      await updateRole({
        ...role,
        name,
        description,
        permissions
      });
      
      if (onSuccess) onSuccess();
      if (!standalone) onOpenChange(false);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const renderFormContent = () => (
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
          disabled={isUpdating || !name}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating
            </>
          ) : (
            'Update Role'
          )}
        </Button>
      </div>
    </form>
  );

  if (standalone) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        {renderFormContent()}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>
        {renderFormContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
