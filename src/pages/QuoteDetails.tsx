import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { QuoteShiftForm } from '@/components/quotes/QuoteShiftForm';
import { QuoteSubcontractorForm } from '@/components/quotes/QuoteSubcontractorForm';
import { useQuoteShifts } from '@/hooks/useQuoteShifts';
import { useQuoteSubcontractors } from '@/hooks/useQuoteSubcontractors';
import { useAwardEngine } from '@/hooks/useAwardEngine';
import { adaptQuoteShift } from '@/utils/quoteAdapters';
import { Quote } from '@/types/models';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DatePicker } from '@/components/ui/date-picker';
import { apiToQuoteStatus, quoteStatusToApi } from '@/utils/typeMapping';
import { useQuote } from '@/hooks/useQuote';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Quote name must be at least 2 characters.",
  }),
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  siteName: z.string().optional(),
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'expired', 'pending', 'accepted']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  expiryDate: z.date().optional(),
  totalPrice: z.number().optional(),
  laborCost: z.number().optional(),
  overheadPercentage: z.number().optional(),
  marginPercentage: z.number().optional(),
  subcontractorCost: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export default function QuoteDetails() {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShiftFormOpen, setIsShiftFormOpen] = useState(false);
  const [isSubcontractorFormOpen, setIsSubcontractorFormOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null);
  const { quote, isLoading, error, updateQuote, deleteQuote } = useQuote(quoteId || '');
  const { shifts, addShift, updateShift, deleteShift } = useQuoteShifts(quoteId || '');
  const { subcontractors, addSubcontractor, updateSubcontractor, deleteSubcontractor } = useQuoteSubcontractors(quoteId || '');
  const { calculateQuoteCost } = useAwardEngine();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: quote?.name || '',
      clientName: quote?.clientName || '',
      siteName: quote?.siteName || '',
      status: quote?.status || 'draft',
      startDate: quote?.startDate ? new Date(quote.startDate) : undefined,
      endDate: quote?.endDate ? new Date(quote.endDate) : undefined,
      expiryDate: quote?.expiryDate ? new Date(quote.expiryDate) : undefined,
      totalPrice: quote?.totalPrice || 0,
      laborCost: quote?.laborCost || 0,
      overheadPercentage: quote?.overheadPercentage || 15,
      marginPercentage: quote?.marginPercentage || 20,
      subcontractorCost: quote?.subcontractorCost || 0,
      createdAt: quote?.createdAt ? new Date(quote.createdAt) : undefined,
      updatedAt: quote?.updatedAt ? new Date(quote.updatedAt) : undefined,
    },
  })

  useEffect(() => {
    if (quote) {
      form.reset({
        name: quote.name || '',
        clientName: quote.clientName || '',
        siteName: quote.siteName || '',
        status: apiToQuoteStatus(quote.status) || 'draft',
        startDate: quote.startDate ? new Date(quote.startDate) : undefined,
        endDate: quote.endDate ? new Date(quote.endDate) : undefined,
        expiryDate: quote.expiryDate ? new Date(quote.expiryDate) : undefined,
        totalPrice: quote.totalPrice || 0,
        laborCost: quote.laborCost || 0,
        overheadPercentage: quote.overheadPercentage || 15,
        marginPercentage: quote.marginPercentage || 20,
        subcontractorCost: quote.subcontractorCost || 0,
        createdAt: quote.createdAt ? new Date(quote.createdAt) : undefined,
        updatedAt: quote.updatedAt ? new Date(quote.updatedAt) : undefined,
      });
    }
  }, [quote, form]);

  const columns = [
    {
      accessorKey: 'day',
      header: 'Day',
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
    },
    {
      accessorKey: 'breakDuration',
      header: 'Break Duration',
    },
    {
      accessorKey: 'numberOfCleaners',
      header: 'Cleaners',
    },
    {
      accessorKey: 'employmentType',
      header: 'Employment Type',
    },
    {
      accessorKey: 'level',
      header: 'Level',
    },
    {
      accessorKey: 'estimatedCost',
      header: 'Estimated Cost',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            setSelectedShift(row.original);
            setIsShiftFormOpen(true);
          }}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteShift(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const subcontractorColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
    },
    {
      accessorKey: 'frequency',
      header: 'Frequency',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            setSelectedSubcontractor(row.original);
            setIsSubcontractorFormOpen(true);
          }}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteSubcontractor(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAddShift = async (shiftData: any) => {
    setIsShiftFormOpen(false);
    await addShift(shiftData);
  };

  const handleUpdateShift = async (shiftId: string, shiftData: any) => {
    setIsShiftFormOpen(false);
    await updateShift(shiftId, shiftData);
  };

  const handleDeleteShift = async (shiftId: string) => {
    await deleteShift(shiftId);
  };

  const handleAddSubcontractor = async (subcontractorData: any) => {
    setIsSubcontractorFormOpen(false);
    await addSubcontractor(subcontractorData);
  };

  const handleUpdateSubcontractor = async (subcontractorId: string, subcontractorData: any) => {
    setIsSubcontractorFormOpen(false);
    await updateSubcontractor(subcontractorId, subcontractorData);
  };

  const handleDeleteSubcontractor = async (subcontractorId: string) => {
    await deleteSubcontractor(subcontractorId);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      // Convert dates to strings
      const startDate = values.startDate ? values.startDate.toISOString() : null;
      const endDate = values.endDate ? values.endDate.toISOString() : null;
      const expiryDate = values.expiryDate ? values.expiryDate.toISOString() : null;
  
      // Create a complete quote object
      const quoteWithDefaults: Quote = {
        id: quote?.id || '',
        name: values.name,
        clientName: values.clientName,
        siteName: values.siteName || '',
        status: values.status || 'draft',
        startDate: startDate || '',
        endDate: endDate || '',
        expiryDate: expiryDate || '',
        totalPrice: values.totalPrice || 0,
        laborCost: values.laborCost || 0,
        overheadPercentage: values.overheadPercentage || 15,
        marginPercentage: values.marginPercentage || 20,
        subcontractorCost: values.subcontractorCost || 0,
        createdAt: values.createdAt ? values.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: values.updatedAt ? values.updatedAt.toISOString() : new Date().toISOString(),
      };
  
      // Call the updateQuote function with the complete quote object
      await updateQuote(quoteWithDefaults);
      toast.success('Quote updated successfully');
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Failed to update quote');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (quoteId) {
        await deleteQuote(quoteId);
        toast.success('Quote deleted successfully');
        navigate('/quotes');
      } else {
        toast.error('Quote ID is missing');
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Quote Details</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quote Information</CardTitle>
              <CardDescription>Edit basic quote details here.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Quote Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Client Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Site Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DatePicker
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date the contract starts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DatePicker
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date the contract ends.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DatePicker
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date the quote expires.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Total Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="laborCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labor Cost</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Labor Cost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcontractorCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcontractor Cost</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Subcontractor Cost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="overheadPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overhead Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Overhead Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marginPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Margin Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate('/quotes')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="my-8" />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quote Shifts</h2>
        <Button onClick={() => setIsShiftFormOpen(true)}>Add Shift</Button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={columns} data={shifts} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subcontractors</h2>
        <Button onClick={() => setIsSubcontractorFormOpen(true)}>Add Subcontractor</Button>
      </div>

      <Card>
        <CardContent>
          <DataTable columns={subcontractorColumns} data={subcontractors} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Quote'}
        </Button>
      </div>

      {/* Shift Form Modal */}
      <QuoteShiftForm
        open={isShiftFormOpen}
        onOpenChange={setIsShiftFormOpen}
        onSubmit={selectedShift ? (data) => handleUpdateShift(selectedShift.id, data) : handleAddShift}
        shift={selectedShift}
      />

      {/* Subcontractor Form Modal */}
      <QuoteSubcontractorForm
        open={isSubcontractorFormOpen}
        onOpenChange={setIsSubcontractorFormOpen}
        onSubmit={selectedSubcontractor ? (data) => handleUpdateSubcontractor(selectedSubcontractor.id, data) : handleAddSubcontractor}
        subcontractor={selectedSubcontractor}
      />
    </div>
  );
}
