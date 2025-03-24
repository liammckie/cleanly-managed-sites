
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { SiteRecord } from '@/lib/types';

interface EditSiteFormHeaderProps {
  site: SiteRecord;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => Promise<void>;
}

export function EditSiteFormHeader({ site, isSaving, onSave }: EditSiteFormHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Edit Site: {site.name}</h1>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/sites/${site.id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Site
        </Button>
        
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
