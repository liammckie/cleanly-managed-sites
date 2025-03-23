
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save } from 'lucide-react';
import { clientsApi } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ClientNotesCardProps {
  notes?: string;
  clientId: string;
}

export function ClientNotesCard({ notes, clientId }: ClientNotesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await clientsApi.updateClient({
        id: clientId,
        data: { notes: noteText }
      });
      
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      setIsEditing(false);
      toast.success('Notes updated successfully');
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error(`Failed to save notes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Notes</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="h-32 resize-none"
            placeholder="Add notes about this client..."
          />
        ) : (
          <div className="text-sm text-muted-foreground whitespace-pre-wrap min-h-[80px]">
            {noteText ? noteText : 'No notes available.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
