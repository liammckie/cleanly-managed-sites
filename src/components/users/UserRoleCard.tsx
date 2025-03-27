
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Edit, Users } from 'lucide-react';

interface UserRoleCardProps {
  role: UserRole;
}

export function UserRoleCard({ role }: UserRoleCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{role.name}</h3>
            {role.description && (
              <p className="text-muted-foreground text-sm">{role.description}</p>
            )}
            
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {(role as any).user_count || 0} users
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {Object.entries(role.permissions || {}).map(([key, value]) => {
                if (value) {
                  return (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key.replace(/_/g, ' ')}
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit role</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
