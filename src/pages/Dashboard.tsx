
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Building, ClipboardCheck, Users, Calendar, AlertTriangle, ArrowRight, Ellipsis } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data - in a real app, this would come from API calls
  const summaryData = {
    activeSites: 3,
    scheduledVisits: 12,
    openTasks: 5,
    activeClients: 4
  };
  
  // Recent activity mock data
  const recentActivities = [
    { id: 1, type: 'site', action: 'updated', name: 'Office Tower B', date: '2 hours ago' },
    { id: 2, type: 'client', action: 'added', name: 'Acme Corporation', date: '1 day ago' },
    { id: 3, type: 'task', action: 'completed', name: 'Monthly floor cleaning', date: '2 days ago' },
  ];

  // Upcoming tasks mock data
  const upcomingTasks = [
    { id: 1, name: 'Window cleaning at Tech Park', dueDate: 'Tomorrow', priority: 'high' },
    { id: 2, name: 'Carpet shampooing at Corporate HQ', dueDate: 'In 3 days', priority: 'medium' },
    { id: 3, name: 'Deep cleaning at Financial Center', dueDate: 'Next week', priority: 'low' },
  ];
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Active Sites
                  </CardTitle>
                  <CardDescription>Total active cleaning sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summaryData.activeSites}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-muted-foreground">
                    <Link to="/sites">
                      View all sites
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Scheduled Visits
                  </CardTitle>
                  <CardDescription>Upcoming visits this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summaryData.scheduledVisits}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                    View schedule
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    Tasks
                  </CardTitle>
                  <CardDescription>Open tasks requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summaryData.openTasks}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                    View all tasks
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Active Clients
                  </CardTitle>
                  <CardDescription>Total active clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{summaryData.activeClients}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-muted-foreground">
                    <Link to="/clients">
                      View all clients
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across all sites</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            {activity.type === 'site' && <Building className="h-5 w-5 text-primary" />}
                            {activity.type === 'client' && <Users className="h-5 w-5 text-primary" />}
                            {activity.type === 'task' && <ClipboardCheck className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.name} was {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No recent activity to display
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View all activity
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>Tasks requiring attention soon</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            {task.priority === 'high' && (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            )}
                            {task.priority === 'medium' && (
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                            )}
                            {task.priority === 'low' && (
                              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.name}</p>
                            <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No upcoming tasks to display
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View all tasks
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you may want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" asChild className="h-auto flex flex-col items-center justify-center py-6 gap-2">
                    <Link to="/sites/create">
                      <Building className="h-6 w-6 mb-2" />
                      <span>Add New Site</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto flex flex-col items-center justify-center py-6 gap-2">
                    <Link to="/clients/create">
                      <Users className="h-6 w-6 mb-2" />
                      <span>Add New Client</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6 gap-2">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Schedule Visit</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6 gap-2">
                    <ClipboardCheck className="h-6 w-6 mb-2" />
                    <span>Create Task</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
