
import React from 'react';
import { AlertTriangle, FileText, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DOCUMENT_TYPES } from './documents/documentTypes';
import { DocumentForm } from './documents/DocumentForm';
import { DocumentItem } from './documents/DocumentItem';
import { DeleteDocumentDialog } from './documents/DeleteDocumentDialog';
import { EmptyDocumentState } from './documents/EmptyDocumentState';
import { useContractorDocuments } from '@/hooks/useContractorDocuments';

export const ContractorDocuments = ({ contractorId }: { contractorId: string }) => {
  const {
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
  } = useContractorDocuments(contractorId);

  const { expiredDocuments, expiringSoonDocuments, documentsByType } = groupedDocuments;

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
              <Button size="sm" onClick={handleOpenAddDialog}>
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
            <EmptyDocumentState onAddClick={handleOpenAddDialog} />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {documentToDelete && (
        <DeleteDocumentDialog
          document={documentToDelete}
          isOpen={!!documentToDelete}
          onClose={closeDeleteDialog}
          onConfirm={confirmDeleteDocument}
        />
      )}
    </ErrorBoundary>
  );
};
