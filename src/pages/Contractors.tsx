
import React from 'react';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useContractors } from '@/hooks/useContractors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Search, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';
import { ContractorRecord } from '@/lib/types';

const Contractors = () => {
  const { contractors, isLoading, error, contractorCounts } = useContractors();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredContractors = React.useMemo(() => {
    if (!contractors || !Array.isArray(contractors)) return [];
    return (contractors as ContractorRecord[]).filter(
      (contractor) =>
        contractor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contractor.specialty && contractor.specialty.some(s => 
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
  }, [contractors, searchTerm]);

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
                    Error Loading Contractors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There was an error loading the contractors data. Please try again later.
                  </p>
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
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Contractors & Suppliers</h2>
                <p className="text-muted-foreground">
                  Manage your contractors, suppliers, and their documents
                </p>
              </div>
              <Button asChild>
                <Link to="/contractors/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{contractorCounts?.totalContractors || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Contractors</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{contractorCounts?.activeContractors || 0}</p>
                    <p className="text-sm text-muted-foreground">Active Contractors</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{contractorCounts?.expiringDocuments || 0}</p>
                    <p className="text-sm text-muted-foreground">Expiring Documents</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    All Contractors
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contractors..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredContractors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContractors.map((contractor) => (
                      <Link
                        key={contractor.id}
                        to={`/contractors/${contractor.id}`}
                        className="block"
                      >
                        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="h-10 w-10 p-2 rounded-full bg-primary/10 text-primary" />
                            <div>
                              <h3 className="font-medium">{contractor.business_name}</h3>
                              <p className="text-sm text-muted-foreground">{contractor.contact_name}</p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <p>Type: {contractor.contractor_type}</p>
                            {contractor.specialty && (
                              <p className="truncate">
                                {contractor.specialty.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              contractor.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contractor.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-20" />
                    <h3 className="text-lg font-medium mb-2">No contractors found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? "No contractors match your search criteria"
                        : "Get started by adding your first contractor"}
                    </p>
                    {!searchTerm && (
                      <Button asChild>
                        <Link to="/contractors/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Contractor
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Contractors;
