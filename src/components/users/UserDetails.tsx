
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/lib/utils/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SystemUser } from '@/types/models';
import { Pencil, Trash2, Mail, Phone, Calendar, Key, UserCheck, Building, MapPin } from 'lucide-react';

interface UserDetailsProps {
  user: SystemUser;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetails({ user, onEdit, onDelete }: UserDetailsProps) {
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    } else if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('');
    }
    return user.email[0].toUpperCase();
  };
  
  // Format role name
  const formatRoleName = (role?: string) => {
    if (!role) return 'No Role Assigned';
    return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
  };
  
  // Get status badge variant
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{user.full_name || 'User Profile'}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.full_name || user.email}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(user.status) as any}>
                  {user.status || 'Unknown Status'}
                </Badge>
                {user.role?.name && (
                  <Badge variant="outline">
                    {formatRoleName(user.role?.name)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              {user.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              
              {user.title && (
                <div className="flex items-start gap-2">
                  <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Title</p>
                    <p className="font-medium">{user.title}</p>
                  </div>
                </div>
              )}
              
              {user.custom_id && (
                <div className="flex items-start gap-2">
                  <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custom ID</p>
                    <p className="font-medium">{user.custom_id}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {user.created_at && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              )}
              
              {user.last_login && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">{formatRelativeTime(user.last_login)}</p>
                  </div>
                </div>
              )}
              
              {user.territories && user.territories.length > 0 && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Territories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.territories.map((territory, i) => (
                        <Badge key={i} variant="outline">{territory}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {user.role && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{formatRoleName(user.role.name)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {user.notes && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="p-3 bg-muted rounded-md">{user.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
