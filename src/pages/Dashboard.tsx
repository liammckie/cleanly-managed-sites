
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { 
  Building, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  ClipboardCheck,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: 'Total Sites',
      value: '24',
      icon: Building,
      change: '+2 this month',
      trend: 'up'
    },
    {
      title: 'Active Subcontractors',
      value: '18',
      icon: Users,
      change: 'No change',
      trend: 'neutral'
    },
    {
      title: 'Upcoming Periodicals',
      value: '7',
      icon: Calendar,
      change: '+3 this week',
      trend: 'up'
    },
    {
      title: 'Compliance Rate',
      value: '92%',
      icon: CheckCircle,
      change: '+2% from last month',
      trend: 'up'
    }
  ];
  
  const alerts = [
    {
      site: 'Riverside Plaza',
      issue: 'Window cleaning due in 3 days',
      type: 'upcoming',
      date: '2023-07-15'
    },
    {
      site: 'Central Mall',
      issue: 'Compliance document expired',
      type: 'urgent',
      date: '2023-07-10'
    },
    {
      site: 'Tech Park Tower',
      issue: 'Stock replenishment needed',
      type: 'warning',
      date: '2023-07-12'
    }
  ];
  
  const recentUpdates = [
    {
      site: 'Harbor View Hotel',
      action: 'Subcontractor details updated',
      user: 'Emily Wilson',
      date: '2023-07-11 09:45'
    },
    {
      site: 'ABC Office Building',
      action: 'Job specifications modified',
      user: 'John Smith',
      date: '2023-07-10 14:30'
    },
    {
      site: 'Sunset Corporate Center',
      action: 'New site created',
      user: 'Sarah Johnson',
      date: '2023-07-09 11:20'
    }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                    {stat.trend === 'down' && <TrendingUp className="h-3 w-3 text-destructive mr-1 rotate-180" />}
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-md bg-secondary/50">
                      {alert.type === 'urgent' && (
                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      {alert.type === 'warning' && (
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                      {alert.type === 'upcoming' && (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{alert.site}</h4>
                        <p className="text-sm text-muted-foreground">{alert.issue}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-md bg-secondary/50">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{update.site}</h4>
                        <p className="text-sm">{update.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">By {update.user}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{update.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
