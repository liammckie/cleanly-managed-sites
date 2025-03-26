
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, PencilLine, Mail, Phone, Calendar, User2, MapPin, BriefcaseBusiness } from 'lucide-react';
import { SystemUser } from '@/lib/types';
import { formatDateRelative } from '@/lib/utils/dateUtils';

interface UserDetailsProps {
  user: SystemUser;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetails({ user, onEdit, onDelete }: UserDetailsProps) {
  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name?.[0] || '';
    const lastInitial = user.last_name?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };
  
  // Get status badge color
  const getStatusColor = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  // Format role name for display
  const formatRole = (role: string | null) => {
    if (!role) return 'No Role Assigned';
    
    // Convert camelCase or snake_case to Title Case with spaces
    return role
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
      .trim();
  };
  
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">User not found</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.full_name}</h2>
              <p className="text-muted-foreground">{user.title || 'No Title'}</p>
              <div className="mt-2">
                <Badge variant={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilLine className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || 'No phone number'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last login: {user.last_login ? formatDateRelative(user.last_login) : 'Never'}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span>Role: {formatRole(user.role_id)}</span>
              </li>
              <li className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                <span>ID: {user.custom_id || user.id}</span>
              </li>
              {user.territories && user.territories.length > 0 && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Territories: {user.territories.join(', ')}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {user.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-muted-foreground">{user.notes}</p>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t text-xs text-muted-foreground">
          <p>Created: {formatDateRelative(user.created_at)}</p>
          <p>Last updated: {formatDateRelative(user.updated_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
