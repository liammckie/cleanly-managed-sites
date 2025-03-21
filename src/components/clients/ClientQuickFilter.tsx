
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Building2
} from 'lucide-react';

export function ClientQuickFilter() {
  const navigate = useNavigate();
  
  const filters = [
    {
      id: 'active',
      name: 'Active Clients',
      description: 'View all active clients',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      badge: <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>,
      action: () => navigate('/clients?status=active')
    },
    {
      id: 'inactive',
      name: 'Inactive Clients',
      description: 'View all inactive clients',
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      badge: <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Inactive</Badge>,
      action: () => navigate('/clients?status=inactive')
    },
    {
      id: 'pending',
      name: 'Pending Clients',
      description: 'View all pending clients',
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      badge: <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>,
      action: () => navigate('/clients?status=pending')
    },
    {
      id: 'all',
      name: 'All Clients',
      description: 'View all clients',
      icon: <Building2 className="h-4 w-4 text-blue-500" />,
      badge: <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">All</Badge>,
      action: () => navigate('/clients')
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filters.map(filter => (
            <button
              key={filter.id}
              className="flex flex-col items-start p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              onClick={filter.action}
            >
              <div className="flex items-center gap-2 mb-2">
                {filter.icon}
                <span className="font-medium">{filter.name}</span>
              </div>
              <span className="text-xs text-muted-foreground mb-2">{filter.description}</span>
              {filter.badge}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
