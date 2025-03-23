
import { supabase } from '@/integrations/supabase/client';

// Get billing lines for a site
export async function getSiteBillingLines(siteId: string) {
  const { data, error } = await supabase
    .from('site_billing_lines')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error(`Error fetching billing lines for site ${siteId}:`, error);
    throw error;
  }
  
  return data || [];
}

// Handle creating/updating site billing lines
export async function handleSiteBillingLines(
  siteId: string, 
  billingLines: any[]
) {
  // First, delete existing billing lines for this site
  await supabase
    .from('site_billing_lines')
    .delete()
    .eq('site_id', siteId);
  
  // Then insert the new ones if there are any
  if (billingLines && billingLines.length > 0) {
    const billingLineRecords = billingLines.map(line => ({
      site_id: siteId,
      description: line.description,
      amount: line.amount || 0,
      frequency: line.frequency || 'monthly',
      is_recurring: line.isRecurring !== undefined ? line.isRecurring : true,
      on_hold: line.onHold || false,
      weekly_amount: line.weeklyAmount,
      monthly_amount: line.monthlyAmount,
      annual_amount: line.annualAmount
    }));
    
    const { error } = await supabase
      .from('site_billing_lines')
      .insert(billingLineRecords);
    
    if (error) {
      console.error('Error handling site billing lines:', error);
      // We won't throw here to avoid rolling back other operations
    }
  }
}
