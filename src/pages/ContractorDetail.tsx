
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useContractors } from '@/hooks/useContractors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import { ContractorRecord } from '@/lib/types';
import { ContractorDocuments } from '@/components/contractors/ContractorDocuments';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const ContractorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contractors, isLoading, error, deleteContractor } = useContractors();
  
  // Find the contractor by ID - safely cast contractors to array type
  const contractor = (Array.isArray(contractors) ? contractors : []).find(c => c.id === id) as ContractorRecord | undefined;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('details');
  
  // Handle delete contractor
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      try {
        await deleteContractor(id!);
        navigate('/contractors');
      } catch (error) {
        console.error('Error deleting contractor:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-6">
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-6">
              <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Error Loading Contractor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There was an error loading the contractor data. Please try again later.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/contractors')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Contractors
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  if (!contractor) {
    return (
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto p-6">
              <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Contractor Not Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The contractor you are looking for does not exist or has been deleted.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/contractors')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Contractors
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-4" 
                  onClick={() => navigate('/contractors')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-semibold">{contractor.business_name}</h1>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/contractors/${id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                          <dd className="text-base">{contractor.business_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Contact Name</dt>
                          <dd className="text-base">{contractor.contact_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                          <dd className="text-base">{contractor.email || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                          <dd className="text-base">{contractor.phone || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                          <dd className="text-base capitalize">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              contractor.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : contractor.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {contractor.status}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Street</dt>
                          <dd className="text-base">{contractor.address || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">City</dt>
                          <dd className="text-base">{contractor.city || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">State</dt>
                          <dd className="text-base">{contractor.state || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Postcode</dt>
                          <dd className="text-base">{contractor.postcode || 'N/A'}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Contractor Type</dt>
                          <dd className="text-base capitalize">{contractor.contractor_type || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">ABN</dt>
                          <dd className="text-base">{contractor.abn || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Tax ID</dt>
                          <dd className="text-base">{contractor.tax_id || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Hourly Rate</dt>
                          <dd className="text-base">
                            {contractor.hourly_rate ? `$${contractor.hourly_rate.toFixed(2)}` : 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Day Rate</dt>
                          <dd className="text-base">
                            {contractor.day_rate ? `$${contractor.day_rate.toFixed(2)}` : 'N/A'}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Specialties & Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Specialties</dt>
                          <dd className="text-base">
                            {contractor.specialty && contractor.specialty.length > 0 
                              ? contractor.specialty.join(', ')
                              : 'None'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                          <dd className="text-base whitespace-pre-wrap">
                            {contractor.notes || 'No notes'}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <ErrorBoundary>
                  <ContractorDocuments contractorId={contractor.id} />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContractorDetail;
