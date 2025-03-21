import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteStatus } from './SiteCard';
import { SiteRecord } from '@/lib/api';
import { Edit, MapPin, Phone, Mail, User, Calendar, Clock, FileText, Briefcase } from 'lucide-react';

// Update the component props to accept a site parameter
export function SiteDetailView({ site }: { site: SiteRecord }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getStatusColor = (status: SiteStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{site.name}</h1>
            <Badge className={getStatusColor(site.status as SiteStatus)}>
              {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{site.address}, {site.city}, {site.state} {site.postcode}</span>
          </div>
        </div>
        
        <Button asChild className="gap-2">
          <Link to={`/sites/${site.id}/edit`}>
            <Edit size={16} />
            <span>Edit Site</span>
          </Link>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
          <TabsTrigger value="periodicals">Periodicals</TabsTrigger>
          <TabsTrigger value="job">Job Specs</TabsTrigger>
          <TabsTrigger value="supplies">Supplies</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User size={18} className="text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Representative</p>
                  <p className="font-medium">{site.representative}</p>
                </div>
                
                {site.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      {site.phone}
                    </p>
                  </div>
                )}
                
                {site.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      {site.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Timeline Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{site.created_at}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{site.created_at}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        
        <TabsContent value="subcontractors" className="mt-0 animate-slide-in">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-primary" />
              Subcontractor Details
            </h3>
            
            {site.subcontractors?.map((subcontractor, index) => (
              <div key={index} className="border-b border-border py-4 last:border-0 last:pb-0">
                <h4 className="font-medium">{subcontractor.business_name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Name</p>
                    <p>{subcontractor.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{subcontractor.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{subcontractor.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="periodicals" className="mt-0 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-4">Window Cleaning</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="font-medium">{site.periodicals?.windowCleaning.frequency}</p>
                </div>
                
                {site.periodicals?.windowCleaning.lastCompleted && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Completed</p>
                    <p className="font-medium">{site.periodicals?.windowCleaning.lastCompleted}</p>
                  </div>
                )}
                
                {site.periodicals?.windowCleaning.nextScheduled && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Scheduled</p>
                    <p className="font-medium">{site.periodicals?.windowCleaning.nextScheduled}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-4">Steam Cleaning</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="font-medium">{site.periodicals?.steamCleaning.frequency}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Charges</p>
                  <p className="font-medium">{site.periodicals?.steamCleaning.charges}</p>
                </div>
                
                {site.periodicals?.steamCleaning.lastCompleted && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Completed</p>
                    <p className="font-medium">{site.periodicals?.steamCleaning.lastCompleted}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="job" className="mt-0 animate-slide-in">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              Job Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Days Per Week</p>
                <p className="text-xl font-medium">{site.job_specifications?.daysPerWeek}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Hours Per Day</p>
                <p className="text-xl font-medium">{site.job_specifications?.hoursPerDay}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Direct Employees</p>
                <p className="text-xl font-medium">{site.job_specifications?.directEmployees ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{site.job_specifications?.notes}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="supplies" className="mt-0 animate-slide-in">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Replenishable Stock</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Stock Items</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {site.replenishables?.stock.map((item, index) => (
                    <div key={index} className="bg-secondary p-2 rounded-md">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Contact Details</p>
                <p className="mt-1">{site.replenishables?.contactDetails}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-0 animate-slide-in">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Security Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.security_details?.accessCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Access Code</p>
                  <p className="font-medium">•••• <span className="text-xs">(hidden)</span></p>
                </div>
              )}
              
              {site.security_details?.alarmCode && (
                <div>
                  <p className="text-sm text-muted-foreground">Alarm Code</p>
                  <p className="font-medium">•••• <span className="text-xs">(hidden)</span></p>
                </div>
              )}
              
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Key Location</p>
                <p className="font-medium">{site.security_details?.keyLocation}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Out of Hours Access</p>
                <p className="font-medium">{site.security_details?.outOfHoursAccess ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
