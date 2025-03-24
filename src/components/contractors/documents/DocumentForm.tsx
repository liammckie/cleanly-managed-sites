
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { ContractorDocument, contractorDocumentsApi } from '@/lib/api/contractors/contractorHistoryApi';
import { DOCUMENT_TYPES } from './documentTypes';

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

export type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  contractorId: string;
  document?: ContractorDocument;
  onClose: () => void;
}

export const DocumentForm = ({ contractorId, document, onClose }: DocumentFormProps) => {
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
