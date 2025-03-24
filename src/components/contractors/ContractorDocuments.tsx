import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertTriangle, FileText, Plus, ExternalLink, Trash2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { contractorDocumentsApi, ContractorDocument } from '@/lib/api/contractors/contractorHistoryApi';

// Define the document types
const DOCUMENT_TYPES = [
  { value: 'public_liability', label: 'Public Liability Insurance' },
  { value: 'workcover', label: 'WorkCover Insurance' },
  { value: 'labour_hire_license', label: 'Labour Hire Licence' },
  { value: 'professional_indemnity', label: 'Professional Indemnity' },
  { value: 'workers_compensation', label: 'Workers Compensation' },
  { value: 'contract', label: 'Contract' },
  { value: 'compliance', label: 'Compliance Certificate' },
  { value: 'accreditation', label: 'Accreditation' },
  { value: 'other', label: 'Other' }
];

// Define document schema for form validation
const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  document_type: z.string().min(1, 'Document type is required'),
  file_path: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  reminder_days: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

// Function to fetch contractor documents
const fetchContractorDocuments = async (contractorId: string) => {
  if (!contractorId) return [];
  return await contractorDocumentsApi.getContractorDocuments(contractorId);
};

// Document Form component
const DocumentForm = ({ 
  contractorId, 
  document, 
  onClose 
}: { 
  contractorId: string, 
  document?: ContractorDocument, 
  onClose: () => void 
}) => {
  const queryClient = useQueryClient();
  const isEditMode = !!document;
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document?.name || '',
      document_type: document?.document_type || '',
      file_path: document?.file_path || '',
      issue_date: document?.issue_date || '',
      expiry_date: document?.expiry_date || '',
      reminder_days: document?.reminder_days || 30,
      notes: document?.notes || '',
    },
  });

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (values: DocumentFormValues) => {
      return await contractorDocumentsApi.createDocument({
        contractor_id: contractorId,
        name: values.name,
        document_type: values.document_type,
        file_path: values.file_path,
        issue_date: values.issue_date,
        expiry_date: values.expiry_date,
        reminder_days: values.reminder_days,
        notes: values.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-documents', contractorId] });
      toast.success('Document added successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to add document: ${error.message}`);
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (values: DocumentFormValues) => {
      if (!document) return null;

      return await contractorDocumentsApi.updateDocument(document.id, {
        name: values.name,
        document_type: values.document_type,
        file_path: values.file_path,
        issue_date: values.issue_date,
        expiry_date: values.expiry_date,
        reminder_days: values.reminder_days,
        notes: values.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-documents', contractorId] });
      toast.success('Document updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to update document: ${error.message}`);
    },
  });

  const onSubmit = (values: DocumentFormValues) => {
    if (isEditMode) {
      updateDocumentMutation.mutate(values);
    } else {
      createDocumentMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter document name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issue_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reminder_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Days Before Expiry</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file_path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/document.pdf" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter any notes about this document" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createDocumentMutation.isPending || updateDocumentMutation.isPending}>
            {(createDocumentMutation.isPending || updateDocumentMutation.isPending) ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Document' : 'Add Document'}</>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Document Item component
const DocumentItem = ({ 
  document, 
  onEdit, 
  onDelete 
}: { 
  document: ContractorDocument; 
  onEdit: () => void; 
  onDelete: () => void;
}) => {
  // Find the document type label
  const documentType = DOCUMENT_TYPES.find(type => type.value === document.document_type)?.label || document.document_type;
  
  // Format dates
  const formattedIssueDate = document.issue_date 
    ? format(new Date(document.issue_date), 'PPP') 
    : 'Not specified';
  
  const formattedExpiryDate = document.expiry_date 
    ? format(new Date(document.expiry_date), 'PPP') 
    : 'Not specified';
  
  // Determine if document is expired or expiring soon
  const isExpired = document.expiry_date && new Date(document.expiry_date) < new Date();
  const isExpiringSoon = document.expiry_date && !isExpired && 
    new Date(document.expiry_date) < new Date(Date.now() + (document.reminder_days || 30) * 86400000);

  return (
    <div className={`border rounded-lg p-4 ${
      isExpired 
        ? 'border-destructive/50 bg-destructive/5' 
        : isExpiringSoon 
          ? 'border-amber-500/50 bg-amber-50' 
          : 'border-border'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            isExpired 
              ? 'bg-destructive/10 text-destructive' 
              : isExpiringSoon 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-primary/10 text-primary'
          }`}>
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{document.name}</h3>
            <p className="text-sm text-muted-foreground">{documentType}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit document">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete document">
            <Trash2 className="h-4 w-4" />
          </Button>
          {document.file_path && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.open(document.file_path, '_blank')}
              title="Open document"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Issue Date:</p>
          <p>{formattedIssueDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Expiry Date:</p>
          <p className={`${isExpired ? 'text-destructive font-medium' : isExpiringSoon ? 'text-amber-700 font-medium' : ''}`}>
            {formattedExpiryDate}
            {isExpired && ' (Expired)'}
            {isExpiringSoon && !isExpired && ' (Expiring soon)'}
          </p>
        </div>
      </div>
      
      {document.notes && (
        <div className="mt-2 pt-2 border-t text-sm">
          <p className="text-muted-foreground">Notes:</p>
          <p>{document.notes}</p>
        </div>
      )}
    </div>
  );
};

// Delete Document Dialog
const DeleteDocumentDialog = ({ 
  document, 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  document: ContractorDocument; 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Document</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete the document "<strong>{document.name}</strong>"?</p>
          <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main ContractorDocuments component
export const ContractorDocuments = ({ contractorId }: { contractorId: string }) => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ContractorDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<ContractorDocument | null>(null);

  // Fetch documents query
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['contractor-documents', contractorId],
    queryFn: () => fetchContractorDocuments(contractorId),
    enabled: !!contractorId,
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await contractorDocumentsApi.deleteDocument(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-documents', contractorId] });
      toast.success('Document deleted successfully');
      setDocumentToDelete(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });

  // Handlers
  const handleEditDocument = (document: ContractorDocument) => {
    setEditingDocument(document);
    setIsAddDialogOpen(true);
  };

  const handleDeleteDocument = (document: ContractorDocument) => {
    setDocumentToDelete(document);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete.id);
    }
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setEditingDocument(null);
  };

  // Group documents by type for better organization
  const documentsByType: Record<string, ContractorDocument[]> = {};
  if (documents) {
    documents.forEach(doc => {
      if (!documentsByType[doc.document_type]) {
        documentsByType[doc.document_type] = [];
      }
      documentsByType[doc.document_type].push(doc);
    });
  }

  // Expired and expiring soon documents
  const expiredDocuments = documents?.filter(doc => 
    doc.expiry_date && new Date(doc.expiry_date) < new Date()
  ) || [];
  
  const expiringSoonDocuments = documents?.filter(doc => 
    doc.expiry_date && 
    new Date(doc.expiry_date) >= new Date() && 
    new Date(doc.expiry_date) < new Date(Date.now() + (doc.reminder_days || 30) * 86400000)
  ) || [];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Error Loading Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was an error loading the contractor documents. Please try again later.
          </p>
          <p className="text-sm mt-2 bg-muted p-2 rounded">
            {(error as Error).message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents & Certifications</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDocument ? 'Edit Document' : 'Add New Document'}
                </DialogTitle>
              </DialogHeader>
              <DocumentForm 
                contractorId={contractorId} 
                document={editingDocument || undefined}
                onClose={closeAddDialog}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-6">
              {/* Expired Documents Section */}
              {expiredDocuments.length > 0 && (
                <div>
                  <h3 className="text-destructive font-medium mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Expired Documents ({expiredDocuments.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expiredDocuments.map(document => (
                      <DocumentItem
                        key={document.id}
                        document={document}
                        onEdit={() => handleEditDocument(document)}
                        onDelete={() => handleDeleteDocument(document)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Expiring Soon Documents Section */}
              {expiringSoonDocuments.length > 0 && (
                <div>
                  <h3 className="text-amber-600 font-medium mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Expiring Soon ({expiringSoonDocuments.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expiringSoonDocuments.map(document => (
                      <DocumentItem
                        key={document.id}
                        document={document}
                        onEdit={() => handleEditDocument(document)}
                        onDelete={() => handleDeleteDocument(document)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Documents By Type */}
              {Object.entries(documentsByType).map(([type, docs]) => {
                const typeName = DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
                return (
                  <div key={type}>
                    <h3 className="font-medium mb-3">{typeName} ({docs.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {docs.map(document => (
                        <DocumentItem
                          key={document.id}
                          document={document}
                          onEdit={() => handleEditDocument(document)}
                          onDelete={() => handleDeleteDocument(document)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No Documents Added</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add documents such as Public Liability Insurance, WorkCover, and Labour Hire Licence to keep track of 
                important certifications and their expiry dates.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Document</DialogTitle>
                  </DialogHeader>
                  <DocumentForm 
                    contractorId={contractorId}
                    onClose={closeAddDialog}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {documentToDelete && (
        <DeleteDocumentDialog
          document={documentToDelete}
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={confirmDeleteDocument}
        />
      )}
    </ErrorBoundary>
  );
};
