
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/lib/types/users';

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole | null;
  onRoleDeleted?: () => void;
}

export default function DeleteRoleDialog({ isOpen, onClose, role, onRoleDeleted }: DeleteRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteRole } = useRoles();

  const handleDelete = async () => {
    if (!role) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteRole(role.id);
      
      // Close dialog
      onClose();
      
      // Notify parent
      if (onRoleDeleted) {
        onRoleDeleted();
      }
      
      toast.success(`Role "${role.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete role');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p>Are you sure you want to delete the role <strong>{role?.name}</strong>?</p>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone. Any users with this role will need to be reassigned.
          </p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
