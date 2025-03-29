
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Mail, MapPin, Phone, User } from 'lucide-react';
import { SystemUser, dbUserToSystemUser } from '@/lib/types/users';
import { formatDate } from '@/lib/utils/dateUtils';

interface UserDetailsProps {
  user: any;
  onEdit: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onEdit }) => {
  const navigate = useNavigate();
  
  // Convert user to SystemUser type if it's from the DB
  const systemUser: SystemUser = user.first_name !== undefined ? dbUserToSystemUser(user) : user;
  
  const getInitials = () => {
    if (systemUser.firstName && systemUser.lastName) {
      return `${systemUser.firstName.charAt(0)}${systemUser.lastName.charAt(0)}`;
    }
    return systemUser.fullName ? systemUser.fullName.charAt(0) : systemUser.email.charAt(0).toUpperCase();
  };
  
  const getUserStatusColor = () => {
    switch (systemUser.status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-400';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>User Profile</CardTitle>
            <Button onClick={onEdit}>Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                {systemUser.avatarUrl ? (
                  <AvatarImage src={systemUser.avatarUrl} alt={systemUser.fullName || 'User'} />
                ) : (
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                )}
              </Avatar>
              
              <div className="text-center">
                <h3 className="font-semibold text-lg">{systemUser.fullName || `${systemUser.email}`}</h3>
                <div className="flex items-center justify-center mt-1">
                  <div className={`w-2 h-2 rounded-full ${getUserStatusColor()} mr-2`}></div>
                  <span className="text-sm capitalize">{systemUser.status}</span>
                </div>
              </div>
              
              {typeof systemUser.role === 'object' && systemUser.role.name ? (
                <Badge variant="outline" className="px-3 py-1">
                  {systemUser.role.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="px-3 py-1 capitalize">
                  {String(systemUser.role)}
                </Badge>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{systemUser.email}</p>
                    </div>
                  </div>
                  
                  {systemUser.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{systemUser.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {systemUser.title && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Job Title</p>
                        <p className="text-sm text-muted-foreground">{systemUser.title}</p>
                      </div>
                    </div>
                  )}
                  
                  {systemUser.customId && (
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Employee ID</p>
                        <p className="text-sm text-muted-foreground">{systemUser.customId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">System Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-5 mr-2">&nbsp;</div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{formatDate(systemUser.createdAt)}</p>
                    </div>
                  </div>
                  
                  {systemUser.lastLogin && (
                    <div className="flex items-start">
                      <div className="w-5 mr-2">&nbsp;</div>
                      <div>
                        <p className="font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">{formatDate(systemUser.lastLogin)}</p>
                      </div>
                    </div>
                  )}
                  
                  {systemUser.territories && systemUser.territories.length > 0 && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Territories</p>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {systemUser.territories.map((territory, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {territory}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {typeof systemUser.role === 'object' && systemUser.role.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Role Description</h4>
                  <p className="text-sm">{systemUser.role.description}</p>
                </div>
              )}
              
              {systemUser.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                  <p className="text-sm whitespace-pre-line">{systemUser.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
