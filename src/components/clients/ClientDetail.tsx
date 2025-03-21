
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientDetails } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteCard } from '../sites/SiteCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Edit, 
  Plus, 
  AlertTriangle,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useClients } from '@/hooks/useClients';

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const navigate = useNavigate();
  const { client, sites, isLoading, isError, error } = useClientDetails(clientId);
  const { deleteClient, isDeleting } = useClients();
  
  // Status badge colors
  const statusColor = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  };
  
  // Handle delete
  const handleDelete = () => {
    deleteClient(clientId, {
      onSuccess: () => {
        navigate('/clients');
      },
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="rounded-lg p-8 text-center border border-border bg-card">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">Error Loading Client</h3>
        <p className="text-muted-foreground">
          {(error as any)?.message || 'Could not load client details.'}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            Go Back to Clients
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="rounded-lg p-8 text-center border border-border bg-card">
        <h3 className="text-lg font-semibold">Client Not Found</h3>
        <p className="text-muted-foreground">
          The client you are looking for does not exist or has been deleted.
        </p>
        <Button className="mt-4" onClick={() => navigate('/clients')}>
          Go Back to Clients
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold">{client.name}</h2>
          <Badge className={`${statusColor[client.status as keyof typeof statusColor]} capitalize`}>
            {client.status}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-1">
            <Link to={`/clients/${clientId}/edit`}>
              <Edit size={16} />
              <span>Edit</span>
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-1">
                <Trash2 size={16} />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the client "{client.name}" and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Contact Person</p>
                  <p>{client.contact_name}</p>
                </div>
              </div>
              
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="break-all">{client.email}</p>
                  </div>
                </div>
              )}
              
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{client.phone}</p>
                  </div>
                </div>
              )}
              
              {(client.address || client.city || client.state || client.postcode) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p>{[
                      client.address,
                      client.city,
                      client.state && client.postcode ? `${client.state} ${client.postcode}` : client.state || client.postcode
                    ].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sites</CardTitle>
                <CardDescription>Sites managed for this client</CardDescription>
              </div>
              
              <Button asChild size="sm" className="gap-1">
                <Link to={`/sites/create?client=${clientId}`}>
                  <Plus size={16} />
                  <span>Add Site</span>
                </Link>
              </Button>
            </CardHeader>
            
            <CardContent>
              {sites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sites.map(site => (
                    <SiteCard
                      key={site.id}
                      id={site.id}
                      name={site.name}
                      address={site.address}
                      city={site.city}
                      status={site.status as any}
                      representative={site.representative}
                      phone={site.phone}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No Sites Yet</h3>
                  <p className="text-muted-foreground">
                    This client doesn't have any sites yet.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to={`/sites/create?client=${clientId}`}>
                      Add First Site
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
