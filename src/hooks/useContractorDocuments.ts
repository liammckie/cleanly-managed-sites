
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractorDocumentsApi, ContractorDocument } from '@/lib/api/contractors/contractorHistoryApi';

// Function to fetch contractor documents
const fetchContractorDocuments = async (contractorId: string) => {
  if (!contractorId) return [];
  return await contractorDocumentsApi.getContractorDocuments(contractorId);
};

export function useContractorDocuments(contractorId: string) {
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
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
    setEditingDocument(null);
  };

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

  const closeDeleteDialog = () => {
    setDocumentToDelete(null);
  };

  // Group documents by status and type
  const groupDocuments = (docs: ContractorDocument[] = []) => {
    // Expired and expiring soon documents
    const expiredDocuments = docs.filter(doc => 
      doc.expiry_date && new Date(doc.expiry_date) < new Date()
    );
    
    const expiringSoonDocuments = docs.filter(doc => 
      doc.expiry_date && 
      new Date(doc.expiry_date) >= new Date() && 
      new Date(doc.expiry_date) < new Date(Date.now() + (doc.reminder_days || 30) * 86400000)
    );

    // Group by type
    const documentsByType: Record<string, ContractorDocument[]> = {};
    docs.forEach(doc => {
      if (!documentsByType[doc.document_type]) {
        documentsByType[doc.document_type] = [];
      }
      documentsByType[doc.document_type].push(doc);
    });

    return {
      expiredDocuments,
      expiringSoonDocuments,
      documentsByType
    };
  };

  const groupedDocuments = groupDocuments(documents);

  return {
    documents,
    isLoading,
    error,
    isAddDialogOpen,
    editingDocument,
    documentToDelete,
    groupedDocuments,
    handleOpenAddDialog,
    handleEditDocument,
    handleDeleteDocument,
    confirmDeleteDocument,
    closeAddDialog,
    closeDeleteDialog
  };
}
