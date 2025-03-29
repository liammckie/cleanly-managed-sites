
import React from 'react';
import type { ContractActivity } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContractActivityFeedProps {
  activities: ContractActivity[];
  title?: string;
  description?: string;
}

const ContractActivityFeed: React.FC<ContractActivityFeedProps> = ({ 
  activities, 
  title = "Activity Feed",
  description
}) => {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">No activities found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activity.timestamp || activity.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-sm mt-1">By: {activity.userName || 'System'}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {typeof activity.details === 'string' 
                  ? activity.details 
                  : activity.description || JSON.stringify(activity.details || activity.metadata || {})}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractActivityFeed;
