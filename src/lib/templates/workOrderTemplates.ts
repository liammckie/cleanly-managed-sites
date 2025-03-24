
import { WorkOrderTemplate, WorkOrderActivityType } from '@/lib/api/workorders/types';

// For now, we'll use hardcoded templates
// Later we can move these to the database for user customization
const cleaningTemplates: WorkOrderTemplate[] = [
  {
    id: 'carpet-cleaning',
    title: 'Carpet Steam Cleaning',
    description: 'Please perform carpet steam cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 350,
    priority: 'medium',
    billingAmount: 500
  },
  {
    id: 'upholstery-cleaning',
    title: 'Upholstery and Fabric Partition Cleaning',
    description: 'Please perform upholstery and fabric partition cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 450,
    priority: 'medium',
    billingAmount: 650
  },
  {
    id: 'hard-floor',
    title: 'Hard Floor Stripping, Sealing and Polishing',
    description: 'Please perform hard floor stripping, sealing and polishing at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 600,
    priority: 'medium',
    billingAmount: 850
  },
  {
    id: 'tile-grout',
    title: 'Tile and Grout Deep Cleaning',
    description: 'Please perform tile and grout deep cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 400,
    priority: 'medium',
    billingAmount: 600
  },
  {
    id: 'high-dusting',
    title: 'High-Level Dusting and Vacuuming',
    description: 'Please perform high-level dusting and vacuuming at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 300,
    priority: 'medium',
    billingAmount: 450
  },
  {
    id: 'pressure-washing',
    title: 'Pressure Washing',
    description: 'Please perform pressure washing at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 500,
    priority: 'medium',
    billingAmount: 750
  },
  {
    id: 'window-cleaning',
    title: 'High-Access Window Cleaning',
    description: 'Please perform high-access window cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 550,
    priority: 'high',
    billingAmount: 800
  },
  {
    id: 'post-construction',
    title: 'Post-Construction or Post-Renovation Cleanup',
    description: 'Please perform post-construction or post-renovation cleanup at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 700,
    priority: 'high',
    billingAmount: 1000
  },
  {
    id: 'post-event',
    title: 'Post-Event or Emergency Cleanup',
    description: 'Please perform post-event or emergency cleanup at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 500,
    priority: 'urgent',
    billingAmount: 750
  },
  {
    id: 'disinfection',
    title: 'Disinfection and Sanitisation Services',
    description: 'Please perform disinfection and sanitisation services at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 450,
    priority: 'high',
    billingAmount: 675
  },
  {
    id: 'odour-removal',
    title: 'Specialised Odour Removal and Deodorising',
    description: 'Please perform specialised odour removal and deodorising at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 400,
    priority: 'medium',
    billingAmount: 600
  },
  {
    id: 'cubicle-cleaning',
    title: 'Upholstered Panel and Cubicle Cleaning',
    description: 'Please perform upholstered panel and cubicle cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 350,
    priority: 'medium',
    billingAmount: 525
  },
  {
    id: 'blind-curtain',
    title: 'Blind and Curtain Cleaning',
    description: 'Please perform blind and curtain cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 300,
    priority: 'medium',
    billingAmount: 450
  },
  {
    id: 'light-fixture',
    title: 'Light Fixture Cleaning',
    description: 'Please perform light fixture cleaning at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 250,
    priority: 'low',
    billingAmount: 375
  },
  {
    id: 'metal-polishing',
    title: 'Metal Polishing (Elevators, Railings, etc.)',
    description: 'Please perform metal polishing at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 350,
    priority: 'low',
    billingAmount: 525
  },
  {
    id: 'consumables',
    title: 'Consumables Inventory & Supply Restocking',
    description: 'Please perform consumables inventory and supply restocking at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 200,
    priority: 'medium',
    billingAmount: 300
  },
  {
    id: 'minor-maintenance',
    title: 'Minor Maintenance Tasks',
    description: 'Please perform minor maintenance tasks at [location] by [date].',
    activityType: 'cleaning',
    estimatedCost: 250,
    priority: 'medium',
    billingAmount: 375
  }
];

// We'll add templates for other activity types in the future
const allTemplates: WorkOrderTemplate[] = [
  ...cleaningTemplates,
  // Add more categories here when ready
];

/**
 * Get all available work order templates
 */
export const getAllTemplates = (): WorkOrderTemplate[] => {
  return allTemplates;
};

/**
 * Get templates filtered by activity type
 */
export const getTemplatesByActivityType = (activityType: WorkOrderActivityType): WorkOrderTemplate[] => {
  return allTemplates.filter(template => template.activityType === activityType);
};

/**
 * Get a specific template by ID
 */
export const getTemplateById = (id: string): WorkOrderTemplate | undefined => {
  return allTemplates.find(template => template.id === id);
};

/**
 * Process a template description by replacing placeholders with actual values
 */
export const processTemplateDescription = (
  description: string, 
  location: string,
  dueDate?: string
): string => {
  let processed = description.replace('[location]', location);
  
  if (dueDate) {
    processed = processed.replace('[date]', dueDate);
  }
  
  return processed;
};
