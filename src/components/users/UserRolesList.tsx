
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoles } from '@/hooks/useRoles';
import { UserRoleCard } from './UserRoleCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RefreshCw } from 'lucide-react';

export function UserRolesList() {
  const { roles, isLoading, isError, error, refetchRoles } = useRoles();

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchRoles();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-6 text-destructive">
        <p>Error loading roles:</p>
        <p>{error?.message || 'Unknown error'}</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">User Roles</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh roles</span>
        </Button>
      </CardHeader>
      <CardContent>
        {roles.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">No roles found</p>
        ) : (
          <div className="grid gap-4">
            {roles.map((role) => (
              <UserRoleCard key={role.id} role={role} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
