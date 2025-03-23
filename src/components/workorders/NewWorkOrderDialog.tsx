
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { SiteRecord } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { WorkOrderForm } from './WorkOrderForm';
import { Building2 } from 'lucide-react';

interface NewWorkOrderDialogProps {
  sites: SiteRecord[];
  onSuccess: () => void;
}

interface SiteSelectionForm {
  siteId: string;
}

export const NewWorkOrderDialog = ({ sites, onSuccess }: NewWorkOrderDialogProps) => {
  const [selectedSite, setSelectedSite] = useState<SiteRecord | null>(null);
  
  const form = useForm<SiteSelectionForm>({
    defaultValues: {
      siteId: '',
    },
  });

  const onSubmit = (data: SiteSelectionForm) => {
    const site = sites.find(s => s.id === data.siteId);
    if (site) {
      setSelectedSite(site);
    }
  };

  // If no sites are available, show a message
  if (sites.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          You need to create a site before you can create a work order.
        </p>
        <Button asChild>
          <a href="/sites/create">Create Site</a>
        </Button>
      </div>
    );
  }

  // If a site is selected, show the work order form
  if (selectedSite) {
    return <WorkOrderForm site={selectedSite} onSuccess={onSuccess} />;
  }

  // Otherwise, show the site selection form
  return (
    <div className="p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="siteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a site for this work order</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Recent sites:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sites.slice(0, 4).map((site) => (
                <Card 
                  key={site.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    form.setValue('siteId', site.id);
                    onSubmit({ siteId: site.id });
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{site.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {site.address}, {site.city}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!form.watch('siteId')}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
