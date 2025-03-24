
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const DocumentsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>Manage business licenses, insurances, and other important documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground max-w-md">
              Upload and manage your business documents, licenses, and certifications here.
            </p>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
