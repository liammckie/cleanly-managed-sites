
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteStatus } from '../SiteCard';
import { SiteRecord } from '@/lib/api';
import { 
  Edit, 
  MapPin, 
  Building, 
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SiteDetailHeaderProps {
  site: SiteRecord;
}

export function SiteDetailHeader({ site }: SiteDetailHeaderProps) {
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

  // Calculate the margin percentage if we have both revenue and cost
  const hasFinancials = site.monthly_revenue && site.monthly_cost;
  const margin = hasFinancials ? site.monthly_revenue - site.monthly_cost : 0;
  const marginPercentage = hasFinancials && site.monthly_revenue > 0 
    ? ((margin / site.monthly_revenue) * 100).toFixed(1) 
    : '0';

  // Calculate weekly and annual figures
  const weeklyRevenue = site.monthly_revenue ? (site.monthly_revenue / 4.33).toFixed(2) : '0.00';
  const weeklyCost = site.monthly_cost ? (site.monthly_cost / 4.33).toFixed(2) : '0.00';
  const weeklyMargin = hasFinancials ? (margin / 4.33).toFixed(2) : '0.00';
  
  const annualRevenue = site.monthly_revenue ? (site.monthly_revenue * 12).toFixed(2) : '0.00';
  const annualCost = site.monthly_cost ? (site.monthly_cost * 12).toFixed(2) : '0.00';
  const annualMargin = hasFinancials ? (margin * 12).toFixed(2) : '0.00';

  return (
    <div className="space-y-4">
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
          
          <div className="flex items-center mt-1 text-muted-foreground">
            <Building size={16} className="mr-1" />
            <span>Client: <Link to={`/clients/${site.client_id}`} className="text-primary hover:underline">
              {site.client_name || "View Client"}
            </Link></span>
          </div>
        </div>
        
        <Button asChild className="gap-2">
          <Link to={`/sites/${site.id}/edit`}>
            <Edit size={16} />
            <span>Edit Site</span>
          </Link>
        </Button>
      </div>

      {/* P&L Summary Card */}
      <Card className="bg-slate-50">
        <CardContent className="pt-4">
          <div className="flex items-center mb-2">
            <DollarSign size={18} className="mr-1 text-primary" />
            <h3 className="text-md font-medium">Financial Summary</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Weekly</p>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm">${weeklyRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Cost</span>
                  <span className="text-sm">${weeklyCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Margin</span>
                  <span className="text-sm">${weeklyMargin}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Monthly</p>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm">${site.monthly_revenue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Cost</span>
                  <span className="text-sm">${site.monthly_cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Margin</span>
                  <span className="text-sm">${margin.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Annual</p>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="text-sm">${annualRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Cost</span>
                  <span className="text-sm">${annualCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Margin</span>
                  <span className="text-sm">${annualMargin}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between p-2 bg-slate-100 rounded">
            <span className="text-sm font-medium">Margin Percentage:</span>
            <span className={`text-sm font-bold ${parseFloat(marginPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marginPercentage}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
