
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillingDetails, BillingLine } from '../types/billingTypes';
import { formatCurrency } from '@/lib/utils/formatters';

interface BillingDetailsSummaryProps {
  billingDetails: BillingDetails;
}

export function BillingDetailsSummary({ billingDetails }: BillingDetailsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Invoice Frequency</h3>
              <p className="capitalize">{billingDetails.invoiceFrequency || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Invoice Day</h3>
              <p>{billingDetails.invoiceDay || 'Not specified'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Invoice Email</h3>
            <p>{billingDetails.invoiceEmail || 'Not specified'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Invoice Address</h3>
            <p>{billingDetails.invoiceAddressLine1 || 'Not specified'}</p>
            {billingDetails.invoiceAddressLine2 && <p>{billingDetails.invoiceAddressLine2}</p>}
            {(billingDetails.invoiceCity || billingDetails.invoiceState) && (
              <p>
                {billingDetails.invoiceCity || ''}{' '}
                {billingDetails.invoiceState && billingDetails.invoiceCity && ', '}
                {billingDetails.invoiceState || ''}
                {' '}
                {billingDetails.invoicePostalCode || ''}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Revenue</h3>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <p className="text-xs text-muted-foreground">Weekly</p>
                <p>{formatCurrency(billingDetails.weeklyRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly</p>
                <p>{formatCurrency(billingDetails.monthlyRevenue || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Annual</p>
                <p>{formatCurrency((billingDetails.monthlyRevenue || 0) * 12)}</p>
              </div>
            </div>
          </div>
          
          {billingDetails.purchaseOrderRequired && (
            <div>
              <h3 className="text-sm font-medium">Purchase Order Required</h3>
              <p>Yes - PO #{billingDetails.purchaseOrderNumber || 'Not specified'}</p>
            </div>
          )}
          
          {billingDetails.billingLines && billingDetails.billingLines.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Billing Lines</h3>
              <div className="space-y-2">
                {billingDetails.billingLines.map((line: BillingLine, index: number) => (
                  <div key={line.id || index} className="p-2 border rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{line.description}</span>
                      <span>{formatCurrency(line.amount)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="capitalize">{line.frequency}</span>
                      {line.isRecurring && ' • Recurring'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
