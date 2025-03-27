
import React from 'react';
import { 
  FormField,
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SiteFormData } from '../types/siteFormData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStep({ 
  formData, 
  handleNestedChange 
}: JobSpecificationsStepProps) {
  const jobSpecs = formData.job_specifications || {};

  const handleChange = (field: string, value: any) => {
    handleNestedChange('job_specifications', field, value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="cleaningFrequency"
              render={() => (
                <FormItem>
                  <FormLabel>Cleaning Frequency</FormLabel>
                  <Select
                    value={jobSpecs.cleaningFrequency || ''}
                    onValueChange={(value) => handleChange('cleaningFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {jobSpecs.cleaningFrequency === 'custom' && (
              <FormField
                name="customFrequency"
                render={() => (
                  <FormItem>
                    <FormLabel>Custom Frequency</FormLabel>
                    <FormControl>
                      <Input
                        value={jobSpecs.customFrequency || ''}
                        onChange={(e) => handleChange('customFrequency', e.target.value)}
                        placeholder="Specify custom frequency"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="serviceDays"
              render={() => (
                <FormItem>
                  <FormLabel>Service Days</FormLabel>
                  <FormControl>
                    <Input
                      value={jobSpecs.serviceDays || ''}
                      onChange={(e) => handleChange('serviceDays', e.target.value)}
                      placeholder="e.g. Monday, Wednesday, Friday"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="serviceTime"
              render={() => (
                <FormItem>
                  <FormLabel>Service Time</FormLabel>
                  <FormControl>
                    <Input
                      value={jobSpecs.serviceTime || ''}
                      onChange={(e) => handleChange('serviceTime', e.target.value)}
                      placeholder="e.g. After 5:00 PM"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              name="daysPerWeek"
              render={() => (
                <FormItem>
                  <FormLabel>Days Per Week</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.daysPerWeek || ''}
                      onChange={(e) => handleChange('daysPerWeek', e.target.value)}
                      min="0"
                      max="7"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="hoursPerDay"
              render={() => (
                <FormItem>
                  <FormLabel>Hours Per Day</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.hoursPerDay || ''}
                      onChange={(e) => handleChange('hoursPerDay', e.target.value)}
                      min="0"
                      step="0.5"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="directEmployees"
              render={() => (
                <FormItem>
                  <FormLabel>Direct Employees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.directEmployees || ''}
                      onChange={(e) => handleChange('directEmployees', e.target.value)}
                      min="0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              name="weeklyContractorCost"
              render={() => (
                <FormItem>
                  <FormLabel>Weekly Contractor Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.weeklyContractorCost || ''}
                      onChange={(e) => handleChange('weeklyContractorCost', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="monthlyContractorCost"
              render={() => (
                <FormItem>
                  <FormLabel>Monthly Contractor Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.monthlyContractorCost || ''}
                      onChange={(e) => handleChange('monthlyContractorCost', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="annualContractorCost"
              render={() => (
                <FormItem>
                  <FormLabel>Annual Contractor Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={jobSpecs.annualContractorCost || ''}
                      onChange={(e) => handleChange('annualContractorCost', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="estimatedHours"
            render={() => (
              <FormItem>
                <FormLabel>Estimated Hours</FormLabel>
                <FormControl>
                  <Input
                    value={jobSpecs.estimatedHours || ''}
                    onChange={(e) => handleChange('estimatedHours', e.target.value)}
                    placeholder="e.g. 8 hours per week"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="equipmentRequired"
            render={() => (
              <FormItem>
                <FormLabel>Equipment Required</FormLabel>
                <FormControl>
                  <Input
                    value={jobSpecs.equipmentRequired || ''}
                    onChange={(e) => handleChange('equipmentRequired', e.target.value)}
                    placeholder="e.g. Vacuum, mop, etc."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="scopeNotes"
            render={() => (
              <FormItem>
                <FormLabel>Scope Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={jobSpecs.scopeNotes || ''}
                    onChange={(e) => handleChange('scopeNotes', e.target.value)}
                    placeholder="Detailed description of job requirements"
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
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={jobSpecs.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any additional information about the job specifications"
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
