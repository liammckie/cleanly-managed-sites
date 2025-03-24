
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAwardSettings } from '@/hooks/useAwardSettings';
import { AwardSettings } from '@/lib/award/types';
import { Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function AwardSettingsForm() {
  const { settings, isLoading, updateSettings, resetSettings } = useAwardSettings();
  
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<AwardSettings>({
    defaultValues: settings
  });
  
  // Update form when settings load
  React.useEffect(() => {
    if (!isLoading) {
      reset(settings);
    }
  }, [isLoading, settings, reset]);
  
  const onSubmit = (data: AwardSettings) => {
    updateSettings(data);
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default award settings?')) {
      resetSettings();
      reset(settings);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Award Settings</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Award Settings</CardTitle>
        <CardDescription>Configure labor award settings for cost calculations</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>Last updated: {settings.lastUpdated ? format(new Date(settings.lastUpdated), 'PPP') : 'Never'}</span>
            <span>Cleaning Services Award [MA000022]</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="baseRateMultiplier">
              Base Rate Multiplier
              <span className="ml-1 text-sm text-muted-foreground">(adjust all rates proportionally)</span>
            </Label>
            <Input
              id="baseRateMultiplier"
              type="number"
              step="0.01"
              min="0.5"
              max="2"
              {...register('baseRateMultiplier', { 
                required: 'Multiplier is required',
                min: { value: 0.5, message: 'Minimum multiplier is 0.5' },
                max: { value: 2, message: 'Maximum multiplier is 2' },
                valueAsNumber: true
              })}
            />
            {errors.baseRateMultiplier && (
              <p className="text-sm text-destructive">{errors.baseRateMultiplier.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overheadPercentageDefault">Default Overhead Percentage (%)</Label>
              <Input
                id="overheadPercentageDefault"
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register('overheadPercentageDefault', { 
                  required: 'Overhead percentage is required',
                  min: { value: 0, message: 'Minimum overhead is 0%' },
                  max: { value: 100, message: 'Maximum overhead is 100%' },
                  valueAsNumber: true
                })}
              />
              {errors.overheadPercentageDefault && (
                <p className="text-sm text-destructive">{errors.overheadPercentageDefault.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marginPercentageDefault">Default Margin Percentage (%)</Label>
              <Input
                id="marginPercentageDefault"
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register('marginPercentageDefault', { 
                  required: 'Margin percentage is required',
                  min: { value: 0, message: 'Minimum margin is 0%' },
                  max: { value: 100, message: 'Maximum margin is 100%' },
                  valueAsNumber: true
                })}
              />
              {errors.marginPercentageDefault && (
                <p className="text-sm text-destructive">{errors.marginPercentageDefault.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          
          <Button 
            type="submit" 
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
