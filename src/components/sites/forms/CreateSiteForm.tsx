
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormStep } from './SiteFormStep';
import { SiteStatus } from '../SiteCard';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Define types for the nested form data
type WindowCleaning = {
  frequency: string;
  lastCompleted: string;
  nextScheduled: string;
}

type SteamCleaning = {
  charges: string;
  frequency: string;
  lastCompleted: string;
}

type Periodicals = {
  windowCleaning: WindowCleaning;
  steamCleaning: SteamCleaning;
}

type JobSpecifications = {
  daysPerWeek: number;
  hoursPerDay: number;
  directEmployees: boolean;
  notes: string;
}

type Replenishables = {
  stock: string[];
  contactDetails: string;
}

type SecurityDetails = {
  accessCode: string;
  alarmCode: string;
  keyLocation: string;
  outOfHoursAccess: boolean;
}

type Subcontractor = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
}

type FormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status: SiteStatus;
  representative: string;
  phone: string;
  email: string;
  subcontractors: Subcontractor[];
  periodicals: Periodicals;
  jobSpecifications: JobSpecifications;
  replenishables: Replenishables;
  securityDetails: SecurityDetails;
}

export function CreateSiteForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Basic information
    name: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    status: 'active' as SiteStatus,
    representative: '',
    phone: '',
    email: '',
    
    // Subcontractor details
    subcontractors: [
      {
        businessName: '',
        contactName: '',
        email: '',
        phone: ''
      }
    ],
    
    // Periodical inclusions
    periodicals: {
      windowCleaning: {
        frequency: 'quarterly',
        lastCompleted: '',
        nextScheduled: ''
      },
      steamCleaning: {
        charges: '',
        frequency: 'semi-annually',
        lastCompleted: ''
      }
    },
    
    // Job specifications
    jobSpecifications: {
      daysPerWeek: 5,
      hoursPerDay: 3,
      directEmployees: false,
      notes: ''
    },
    
    // Replenishables
    replenishables: {
      stock: ['', '', '', '', ''],
      contactDetails: ''
    },
    
    // Security details
    securityDetails: {
      accessCode: '',
      alarmCode: '',
      keyLocation: '',
      outOfHoursAccess: false
    }
  });
  
  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle nested field changes
  const handleNestedChange = (section: keyof FormData, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [field]: value
      }
    });
  };
  
  // Handle nested within nested field changes
  const handleDoubleNestedChange = (section: keyof FormData, subsection: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [subsection]: {
          ...((formData[section] as any)[subsection] as object),
          [field]: value
        }
      }
    });
  };
  
  // Handle array of objects field changes
  const handleSubcontractorChange = (index: number, field: string, value: string) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors[index] = {
      ...newSubcontractors[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
  // Handle array field changes
  const handleStockChange = (index: number, value: string) => {
    const newStock = [...formData.replenishables.stock];
    newStock[index] = value;
    
    setFormData({
      ...formData,
      replenishables: {
        ...formData.replenishables,
        stock: newStock
      }
    });
  };
  
  // Add another subcontractor
  const addSubcontractor = () => {
    setFormData({
      ...formData,
      subcontractors: [
        ...formData.subcontractors,
        {
          businessName: '',
          contactName: '',
          email: '',
          phone: ''
        }
      ]
    });
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors.splice(index, 1);
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
  // Handle submit
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Site has been created successfully!");
      setIsSubmitting(false);
      navigate('/sites');
    }, 1500);
  };
  
  // Steps configuration
  const steps = [
    {
      title: "Basic Information",
      description: "Enter the basic details about the site.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter site name"
                value={formData.name}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter street address"
                value={formData.address}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => handleChange({ target: { name: 'state', value } } as any)}
                >
                  <SelectTrigger id="state" className="glass-input">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="NSW">New South Wales</SelectItem>
                    <SelectItem value="VIC">Victoria</SelectItem>
                    <SelectItem value="QLD">Queensland</SelectItem>
                    <SelectItem value="WA">Western Australia</SelectItem>
                    <SelectItem value="SA">South Australia</SelectItem>
                    <SelectItem value="TAS">Tasmania</SelectItem>
                    <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                    <SelectItem value="NT">Northern Territory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode <span className="text-destructive">*</span></Label>
                <Input
                  id="postcode"
                  name="postcode"
                  placeholder="Enter postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: SiteStatus) => handleChange({ target: { name: 'status', value } } as any)}
                >
                  <SelectTrigger id="status" className="glass-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="representative">Representative Name <span className="text-destructive">*</span></Label>
                <Input
                  id="representative"
                  name="representative"
                  placeholder="Enter representative name"
                  value={formData.representative}
                  onChange={handleChange}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Subcontractor Details",
      description: "Add information about the subcontractors for this site.",
      content: (
        <div className="space-y-6">
          {formData.subcontractors.map((subcontractor, index) => (
            <div key={index} className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Subcontractor {index + 1}</h3>
                {formData.subcontractors.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeSubcontractor(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`business-name-${index}`}>Business Name <span className="text-destructive">*</span></Label>
                  <Input
                    id={`business-name-${index}`}
                    placeholder="Enter business name"
                    value={subcontractor.businessName}
                    onChange={(e) => handleSubcontractorChange(index, 'businessName', e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`contact-name-${index}`}>Contact Name <span className="text-destructive">*</span></Label>
                  <Input
                    id={`contact-name-${index}`}
                    placeholder="Enter contact name"
                    value={subcontractor.contactName}
                    onChange={(e) => handleSubcontractorChange(index, 'contactName', e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${index}`}>Email <span className="text-destructive">*</span></Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      placeholder="Enter email"
                      value={subcontractor.email}
                      onChange={(e) => handleSubcontractorChange(index, 'email', e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`phone-${index}`}>Phone <span className="text-destructive">*</span></Label>
                    <Input
                      id={`phone-${index}`}
                      placeholder="Enter phone number"
                      value={subcontractor.phone}
                      onChange={(e) => handleSubcontractorChange(index, 'phone', e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={addSubcontractor}
          >
            Add Another Subcontractor
          </Button>
        </div>
      )
    },
    {
      title: "Periodical Inclusions",
      description: "Add information about periodical cleaning services.",
      content: (
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-medium">Window Cleaning</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="window-frequency">Frequency</Label>
                <Select 
                  value={formData.periodicals.windowCleaning.frequency} 
                  onValueChange={(value) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'frequency', value)}
                >
                  <SelectTrigger id="window-frequency" className="glass-input">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="window-last-completed">Last Completed</Label>
                  <Input
                    id="window-last-completed"
                    type="date"
                    value={formData.periodicals.windowCleaning.lastCompleted}
                    onChange={(e) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'lastCompleted', e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="window-next-scheduled">Next Scheduled</Label>
                  <Input
                    id="window-next-scheduled"
                    type="date"
                    value={formData.periodicals.windowCleaning.nextScheduled}
                    onChange={(e) => handleDoubleNestedChange('periodicals', 'windowCleaning', 'nextScheduled', e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-medium">Steam Cleaning</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="steam-charges">Charges</Label>
                <Input
                  id="steam-charges"
                  placeholder="Enter charges (e.g. $250 per session)"
                  value={formData.periodicals.steamCleaning.charges}
                  onChange={(e) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'charges', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="steam-frequency">Frequency</Label>
                  <Select 
                    value={formData.periodicals.steamCleaning.frequency} 
                    onValueChange={(value) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'frequency', value)}
                  >
                    <SelectTrigger id="steam-frequency" className="glass-input">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="steam-last-completed">Last Completed</Label>
                  <Input
                    id="steam-last-completed"
                    type="date"
                    value={formData.periodicals.steamCleaning.lastCompleted}
                    onChange={(e) => handleDoubleNestedChange('periodicals', 'steamCleaning', 'lastCompleted', e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Job Specifications",
      description: "Add details about the cleaning job requirements.",
      content: (
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-medium">Cleaning Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="days-per-week">Days Per Week</Label>
                <Select 
                  value={String(formData.jobSpecifications.daysPerWeek)} 
                  onValueChange={(value) => handleNestedChange('jobSpecifications', 'daysPerWeek', parseInt(value))}
                >
                  <SelectTrigger id="days-per-week" className="glass-input">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours-per-day">Hours Per Day</Label>
                <Input
                  id="hours-per-day"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.jobSpecifications.hoursPerDay}
                  onChange={(e) => handleNestedChange('jobSpecifications', 'hoursPerDay', parseInt(e.target.value))}
                  className="glass-input"
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="direct-employees" 
                  checked={formData.jobSpecifications.directEmployees}
                  onCheckedChange={(checked) => handleNestedChange('jobSpecifications', 'directEmployees', !!checked)}
                />
                <label
                  htmlFor="direct-employees"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Direct Employees (unchecked if subcontractors)
                </label>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-notes">Special Instructions / Notes</Label>
              <Textarea
                id="job-notes"
                placeholder="Enter any special instructions or notes..."
                rows={4}
                value={formData.jobSpecifications.notes}
                onChange={(e) => handleNestedChange('jobSpecifications', 'notes', e.target.value)}
                className="glass-input resize-none"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Replenishables & Stock",
      description: "Add information about replenishable stock items.",
      content: (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-medium">Stock Items</h3>
          
          <div className="space-y-4">
            {formData.replenishables.stock.map((item, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`stock-${index}`}>Stock Item {index + 1}</Label>
                <Input
                  id={`stock-${index}`}
                  placeholder="Enter stock item"
                  value={item}
                  onChange={(e) => handleStockChange(index, e.target.value)}
                  className="glass-input"
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="stock-contact">Contact Details for Replenishment</Label>
            <Textarea
              id="stock-contact"
              placeholder="Enter contact details for stock replenishment..."
              rows={3}
              value={formData.replenishables.contactDetails}
              onChange={(e) => handleNestedChange('replenishables', 'contactDetails', e.target.value)}
              className="glass-input resize-none"
            />
          </div>
        </div>
      )
    },
    {
      title: "Security Details",
      description: "Add security and access information for the site.",
      content: (
        <div className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="password"
                placeholder="Enter access code"
                value={formData.securityDetails.accessCode}
                onChange={(e) => handleNestedChange('securityDetails', 'accessCode', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alarm-code">Alarm Code</Label>
              <Input
                id="alarm-code"
                type="password"
                placeholder="Enter alarm code"
                value={formData.securityDetails.alarmCode}
                onChange={(e) => handleNestedChange('securityDetails', 'alarmCode', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-location">Key Location</Label>
            <Input
              id="key-location"
              placeholder="Enter key location"
              value={formData.securityDetails.keyLocation}
              onChange={(e) => handleNestedChange('securityDetails', 'keyLocation', e.target.value)}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="out-of-hours" 
                checked={formData.securityDetails.outOfHoursAccess}
                onCheckedChange={(checked) => handleNestedChange('securityDetails', 'outOfHoursAccess', !!checked)}
              />
              <label
                htmlFor="out-of-hours"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Out of Hours Access Available
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Review & Submit",
      description: "Review your information before creating the site.",
      content: (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium">Site Information Summary</h3>
            
            <div className="mt-4 space-y-6">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Basic Information</h4>
                <p className="mt-1 text-lg font-semibold">{formData.name}</p>
                <p className="mt-1">{formData.address}, {formData.city}, {formData.state} {formData.postcode}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="capitalize">{formData.status}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
                <p className="mt-1">{formData.representative}</p>
                {formData.phone && <p className="mt-1">{formData.phone}</p>}
                {formData.email && <p className="mt-1">{formData.email}</p>}
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground">Subcontractors</h4>
                <div className="mt-2 space-y-2">
                  {formData.subcontractors.map((sub, index) => (
                    <div key={index} className="p-2 bg-secondary rounded-md">
                      <p className="font-medium">{sub.businessName}</p>
                      <p className="text-sm">{sub.contactName} | {sub.email} | {sub.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground">Job Specifications</h4>
                <div className="mt-2">
                  <p>{formData.jobSpecifications.daysPerWeek} days per week, {formData.jobSpecifications.hoursPerDay} hours per day</p>
                  <p className="mt-1">{formData.jobSpecifications.directEmployees ? 'Direct Employees' : 'Subcontractors'}</p>
                  {formData.jobSpecifications.notes && (
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">Notes:</span>
                      <p className="mt-1">{formData.jobSpecifications.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">By submitting this form, you confirm that all provided information is correct.</p>
          </div>
        </div>
      )
    }
  ];
  
  // Next step handler
  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleSubmit();
      return;
    }
    
    setCurrentStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };
  
  // Back step handler
  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <SiteFormStep
        title={steps[currentStep].title}
        description={steps[currentStep].description}
        onNext={handleNext}
        onBack={handleBack}
        isSubmitting={isSubmitting}
        isLastStep={currentStep === steps.length - 1}
        isFirstStep={currentStep === 0}
      >
        {steps[currentStep].content}
      </SiteFormStep>
    </div>
  );
}
