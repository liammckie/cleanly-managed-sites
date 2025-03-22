
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractors } from '@/hooks/useContractors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContractorsDashboard() {
  const { contractors, isLoading, error, contractorCounts, expiringDocuments } = useContractors();
  
  if (isLoading) {
    return (
      <Card className="col-span-1 h-[350px] flex items-center justify-center">
        <LoadingSpinner />
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Contractors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an error loading the contractor information.</p>
        </CardContent>
      </Card>
    );
  }
  
  const hasContractors = contractors && contractors.length > 0;
  
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Contractors & Suppliers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        {hasContractors ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="glass-card p-3 text-center">
                <p className="text-2xl font-bold">{contractorCounts?.activeContractors || 0}</p>
                <p className="text-xs text-muted-foreground">Active Contractors</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-2xl font-bold">{contractorCounts?.activeSites || 0}</p>
                <p className="text-xs text-muted-foreground">Sites with Contractors</p>
              </div>
            </div>
            
            {expiringDocuments && expiringDocuments.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Expiring Documents
                </h4>
                <div className="max-h-[120px] overflow-y-auto space-y-2">
                  {expiringDocuments.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.business_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-600 font-medium">Expires {new Date(doc.expiry_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded">
                <CheckCircle className="h-4 w-4" />
                <span>All contractor documents are up to date!</span>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium">No Contractors Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add contractors to manage your workforce and suppliers
            </p>
            <Button variant="outline" asChild>
              <Link to="/contractors/create">Add Your First Contractor</Link>
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="link" className="w-full" asChild>
          <Link to="/contractors">View All Contractors</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
