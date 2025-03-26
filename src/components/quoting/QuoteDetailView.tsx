
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  FilePlus,
  Printer,
  Download,
  Share2,
  Tag,
  Copy,
  CheckCircle,
  XCircle,
  ClockIcon,
  BarChart4,
  PieChart,
  DollarSign,
} from 'lucide-react';
import { Quote } from '@/types/models';
import { useDeleteQuote } from '@/hooks/useQuotes';

interface QuoteDetailViewProps {
  quote: Quote;
}

export function QuoteDetailView({ quote }: QuoteDetailViewProps) {
  const navigate = useNavigate();
  const { mutateAsync: deleteQuote, isPending: isDeleting } = useDeleteQuote();
  
  const handleDeleteQuote = async () => {
    await deleteQuote(quote.id);
    navigate('/quoting');
  };
  
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
      case 'pending':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{quote.name}</h1>
            {getStatusBadge(quote.status)}
          </div>
          <p className="text-muted-foreground">
            {quote.clientName && `Client: ${quote.clientName}`}
            {quote.clientName && quote.siteName && ' | '}
            {quote.siteName && `Site: ${quote.siteName}`}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/quoting')}
          >
            Back
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/quoting/edit/${quote.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Quote</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this quote? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteQuote}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contract Period</CardDescription>
            <CardTitle className="text-xl">
              {quote.startDate && quote.endDate ? (
                <>
                  {format(new Date(quote.startDate), 'MMM d, yyyy')} - {format(new Date(quote.endDate), 'MMM d, yyyy')}
                </>
              ) : (
                'Not specified'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{quote.contractLength} {quote.contractLengthUnit}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Quote Total</CardDescription>
            <CardTitle className="text-xl">${quote.totalPrice.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>
                ${(quote.totalPrice / 4.33).toFixed(2)} per week
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expiry Date</CardDescription>
            <CardTitle className="text-xl">
              {quote.expiryDate ? (
                format(new Date(quote.expiryDate), 'MMM d, yyyy')
              ) : (
                'Not specified'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>
                {quote.expiryDate && new Date(quote.expiryDate) < new Date() ? (
                  <span className="text-red-600">Expired</span>
                ) : (
                  'Valid'
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profit Margin</CardDescription>
            <CardTitle className="text-xl">
              {quote.marginPercentage}% (${quote.marginAmount.toFixed(2)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground">
              <PieChart className="h-4 w-4 mr-2" />
              <span>Overhead: {quote.overheadPercentage}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Labor & Shifts</CardTitle>
              <CardDescription>
                Scheduled cleaning shifts and labor requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!quote.shifts || quote.shifts.length === 0 ? (
                <div className="text-center p-6 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">No shifts added to this quote.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.shifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">
                          {shift.day.charAt(0).toUpperCase() + shift.day.slice(1)}
                        </TableCell>
                        <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                        <TableCell>
                          {shift.numberOfCleaners} × Level {shift.level} ({shift.employmentType})
                        </TableCell>
                        <TableCell className="text-right">
                          ${shift.estimatedCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subcontractors</CardTitle>
              <CardDescription>
                External services included in this quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!quote.subcontractors || quote.subcontractors.length === 0 ? (
                <div className="text-center p-6 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">No subcontractors added to this quote.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subcontractor</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.subcontractors.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell>{sub.service}</TableCell>
                        <TableCell>
                          {typeof sub.frequency === 'string' && 
                            sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${sub.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{quote.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                Summary of costs and profit margin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor Cost:</span>
                  <span className="font-medium">${quote.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subcontractor Cost:</span>
                  <span className="font-medium">${quote.subcontractorCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Overhead ({quote.overheadPercentage}%):
                  </span>
                  <span className="font-medium">${quote.overheadCost.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-medium">${quote.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Margin ({quote.marginPercentage}%):
                  </span>
                  <span className="font-medium">${quote.marginAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Price:</span>
                  <span className="font-bold">${quote.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="font-semibold">${(quote.totalPrice / 4.33).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="font-semibold">${quote.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual</p>
                  <p className="font-semibold">${(quote.totalPrice * 12).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <FilePlus className="h-4 w-4 mr-2" />
                Create Contract
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Quote
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Email to Client
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Quote
              </Button>
              {quote.status === 'draft' ? (
                <Button className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Sent
                </Button>
              ) : quote.status === 'sent' ? (
                <>
                  <Button className="w-full justify-start" variant="default">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Accepted
                  </Button>
                  <Button className="w-full justify-start" variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Rejected
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
