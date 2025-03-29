import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/types/users';

interface UserRoleCardProps {
  role: UserRole;
  onClick?: (role: UserRole) => void;
  onEditClick?: (role: UserRole) => void;
  onDeleteClick?: (role: UserRole) => void;
  isActive?: boolean;
}

const UserRoleCard = ({ role, onClick, onEditClick, onDeleteClick, isActive = false }: UserRoleCardProps) => {
  const getPermissionCount = (permissions: string[] | Record<string, boolean>) => {
    if (Array.isArray(permissions)) {
      return permissions.length;
    } else {
      return Object.values(permissions).filter(value => value === true).length;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{role.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {role.description && (
          <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Permissions:</span>
            <span className="text-sm">{getPermissionCount(role.permissions)}</span>
          </div>
          
          {role.user_count !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Users with this role:</span>
              <span className="text-sm">{role.user_count}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {(onEditClick || onDeleteClick) && (
        <CardFooter className="pt-0 flex justify-end gap-2">
          {onEditClick && <Button size="sm" variant="outline" onClick={() => onEditClick(role)}>Edit</Button>}
          {onDeleteClick && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDeleteClick(role)}
              disabled={role.user_count ? role.user_count > 0 : false}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default UserRoleCard;
