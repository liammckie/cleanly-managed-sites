
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientNotesCardProps {
  notes?: string;
}

export function ClientNotesCard({ notes }: ClientNotesCardProps) {
  if (!notes) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{notes}</p>
      </CardContent>
    </Card>
  );
}
