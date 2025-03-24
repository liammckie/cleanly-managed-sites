import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Quote } from '@/lib/award/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, DollarSign, User, Building2, FileText, Copy, Eye, Edit, Trash2, Clock, Plus } from 'lucide-react';

interface QuoteListProps {
  quotes: Quote[];
  searchTerm: string;
  isLoading: boolean;
}

export function QuoteList({ quotes, searchTerm, isLoading }: QuoteListProps) {
  const navigate = useNavigate();
  
  const filteredQuotes = quotes.filter(quote => {
    const term = searchTerm.toLowerCase();
    return (
      quote.name.toLowerCase().includes(term) ||
      (quote.clientName && quote.clientName.toLowerCase().includes(term)) ||
      (quote.siteName && quote.siteName.toLowerCase().includes(term)) ||
      quote.status.toLowerCase().includes(term)
    );
  });
  
  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Draft</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Quotes Yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Create your first quote to start planning labor and calculating costs based on the Cleaning Services Award.
          </p>
          <Button onClick={() => navigate('/quoting/create')}>
            Create Your First Quote
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (filteredQuotes.length === 0 && searchTerm) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No quotes match your search term "{searchTerm}".
          </p>
          <Button 
            variant="link" 
            onClick={() => navigate('/quoting/create')}
            className="mt-2"
          >
            Create a new quote?
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredQuotes.map(quote => (
        <Card key={quote.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-1" title={quote.name}>
                {quote.name}
              </CardTitle>
              {getStatusBadge(quote.status)}
            </div>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(quote.createdAt), 'MMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              {quote.clientName && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate" title={quote.clientName}>
                    {quote.clientName}
                  </span>
                </div>
              )}
              
              {quote.siteName && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate" title={quote.siteName}>
                    {quote.siteName}
                  </span>
                </div>
              )}
              
              {quote.startDate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(quote.startDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>${quote.totalPrice.toFixed(2)}/month</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="mt-1 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {quote.shifts.length} shift{quote.shifts.length !== 1 ? 's' : ''}
                {quote.subcontractors.length > 0 && 
                  `, ${quote.subcontractors.length} subcontractor${quote.subcontractors.length !== 1 ? 's' : ''}`}
              </div>
              <div className="text-muted-foreground">{quote.marginPercentage}% margin</div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/quoting/${quote.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/quoting/edit/${quote.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      <Card 
        className="border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => navigate('/quoting/create')}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium mb-1">Create New Quote</h3>
        <p className="text-sm text-muted-foreground">
          Start a fresh quote for a client
        </p>
      </Card>
    </div>
  );
}
