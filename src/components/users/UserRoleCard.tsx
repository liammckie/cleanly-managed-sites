
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/types/userTypes';

// Fixed version of permissionDisplay function
const permissionDisplay = (permissions: string[] | Record<string, boolean>) => {
  if (Array.isArray(permissions)) {
    // Convert array to Record for display
    const permRecord: Record<string, boolean> = {};
    permissions.forEach(p => { permRecord[p] = true; });
    return permRecord;
  }
  return permissions;
};

interface UserRoleCardProps {
  role: UserRole;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const UserRoleCard: React.FC<UserRoleCardProps> = ({ role, onEditClick, onDeleteClick }) => {
  const permissions = permissionDisplay(role.permissions);
  const permissionCount = Object.keys(permissions).filter(key => permissions[key]).length;

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{role.name}</span>
          {role.user_count !== undefined && role.user_count > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Users className="h-3 w-3 mr-1" />
              {role.user_count} {role.user_count === 1 ? 'user' : 'users'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {role.description && <p className="text-sm text-muted-foreground mb-2">{role.description}</p>}
        <div className="flex flex-wrap gap-1">
          {Object.keys(permissions).filter(key => permissions[key]).map(key => (
            <Badge key={key} variant="outline" className="text-xs">
              {key}
            </Badge>
          ))}
          {permissionCount === 0 && (
            <span className="text-xs text-muted-foreground">No permissions assigned</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="text-destructive" onClick={onDeleteClick}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// Add a default export of the component
export default UserRoleCard;
