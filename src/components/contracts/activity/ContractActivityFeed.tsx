
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractActivity } from '@/types/db';
import { format } from 'date-fns';
import { FileEdit, FileCheck, FileX, Calendar, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ContractActivityFeedProps {
  activities: ContractActivity[];
  title?: string;
  description?: string;
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <FileCheck className="h-4 w-4 text-green-500" />;
    case 'updated':
      return <FileEdit className="h-4 w-4 text-blue-500" />;
    case 'renewed':
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case 'expired':
    case 'canceled':
      return <FileX className="h-4 w-4 text-red-500" />;
    default:
      return <FileEdit className="h-4 w-4 text-gray-500" />;
  }
};

const getActionText = (action: string) => {
  switch (action) {
    case 'created':
      return 'Created';
    case 'updated':
      return 'Updated';
    case 'renewed':
      return 'Renewed';
    case 'expired':
      return 'Expired';
    case 'canceled':
      return 'Canceled';
    default:
      return 'Modified';
  }
};

export function ContractActivityFeed({ 
  activities, 
  title = "Contract Activity", 
  description = "Recent contract activities and changes"
}: ContractActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cards">
          <TabsList className="mb-4">
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start p-4 space-x-4">
                        <div className="p-2 rounded-full bg-muted">
                          {getActivityIcon(activity.action)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {getActionText(activity.action)} contract
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), 'PPp')}
                            </p>
                          </div>
                          
                          {activity.userName && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span>{activity.userName}</span>
                            </div>
                          )}
                          
                          {activity.details?.notes && (
                            <p className="text-sm">{activity.details.notes}</p>
                          )}
                          
                          {activity.details?.field && (
                            <p className="text-xs text-muted-foreground">
                              Changed {activity.details.field} from "{activity.details.oldValue}" to "{activity.details.newValue}"
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="table">
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent activities</p>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          {format(new Date(activity.timestamp), 'PP')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), 'p')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActivityIcon(activity.action)}
                            <span>{getActionText(activity.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{activity.userName || 'System'}</TableCell>
                        <TableCell>
                          {activity.details?.notes ? (
                            <span>{activity.details.notes}</span>
                          ) : activity.details?.field ? (
                            <span>
                              Changed {activity.details.field}: {activity.details.oldValue} → {activity.details.newValue}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No details</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ContractActivityFeed;
