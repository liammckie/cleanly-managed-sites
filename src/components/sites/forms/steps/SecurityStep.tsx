
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityDetails } from '../types/securityTypes';

interface SecurityStepProps {
  securityDetails: SecurityDetails;
  handleChange: (field: string, value: any) => void;
}

export function SecurityStep({
  securityDetails,
  handleChange
}: SecurityStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="alarmCode"
            render={() => (
              <FormItem>
                <FormLabel>Alarm Code</FormLabel>
                <FormControl>
                  <Input
                    value={securityDetails.alarmCode || ''}
                    onChange={(e) => handleChange('alarmCode', e.target.value)}
                    placeholder="Enter alarm code"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            name="hasSecuritySystem"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Security System</FormLabel>
                  <FormDescription>
                    Does this site have a security system?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={securityDetails.hasSecuritySystem || false}
                    onCheckedChange={(checked) => handleChange('hasSecuritySystem', checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {securityDetails.hasSecuritySystem && (
            <>
              <FormField
                name="securityCompany"
                render={() => (
                  <FormItem>
                    <FormLabel>Security Company</FormLabel>
                    <FormControl>
                      <Input
                        value={securityDetails.securityCompany || ''}
                        onChange={(e) => handleChange('securityCompany', e.target.value)}
                        placeholder="Enter security company name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                name="securityContact"
                render={() => (
                  <FormItem>
                    <FormLabel>Security Contact</FormLabel>
                    <FormControl>
                      <Input
                        value={securityDetails.securityContact || ''}
                        onChange={(e) => handleChange('securityContact', e.target.value)}
                        placeholder="Enter security contact details"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            name="keyLocation"
            render={() => (
              <FormItem>
                <FormLabel>Key Location</FormLabel>
                <FormControl>
                  <Input
                    value={securityDetails.keyLocation || ''}
                    onChange={(e) => handleChange('keyLocation', e.target.value)}
                    placeholder="Where are the keys stored?"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            name="accessInstructions"
            render={() => (
              <FormItem>
                <FormLabel>Access Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    value={securityDetails.accessInstructions || ''}
                    onChange={(e) => handleChange('accessInstructions', e.target.value)}
                    placeholder="Instructions for accessing the site"
                    rows={4}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            name="notes"
            render={() => (
              <FormItem>
                <FormLabel>Security Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={securityDetails.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Additional security notes"
                    rows={4}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
