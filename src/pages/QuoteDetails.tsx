
import React from 'react';
import QuoteShiftForm from '@/components/quotes/QuoteShiftForm';
import QuoteSubcontractorForm from '@/components/quotes/QuoteSubcontractorForm';
import { useQuoteShifts } from '@/hooks/quotes/useQuoteShifts';
import { useQuoteSubcontractors } from '@/hooks/quotes/useQuoteSubcontractors';
import { useQuote } from '@/hooks/useQuote';
import { useAwardEngine } from '@/hooks/useAwardEngine';
import { mapFromDb } from '@/lib/mappers';

interface QuoteDetailsProps {
  quoteId: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quoteId }) => {
  const { quote, isLoading: quoteLoading } = useQuote(quoteId);
  const { shifts, isLoading: shiftsLoading } = useQuoteShifts(quoteId);
  const { subcontractors, isLoading: subcontractorsLoading } = useQuoteSubcontractors(quoteId);
  const { awardData, loading: awardLoading } = useAwardEngine(quoteId);

  if (quoteLoading || awardLoading || shiftsLoading || subcontractorsLoading) {
    return <div>Loading...</div>;
  }

  if (!quote) {
    return <div>Quote not found</div>;
  }

  return (
    <div>
      <h1>Quote Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2>Basic Information</h2>
          <p>Client: {quote.client_name}</p>
          <p>Site: {quote.site_name}</p>
          <p>Status: {quote.status}</p>
        </div>
        
        <div>
          <h2>Financial Details</h2>
          <p>Total Price: ${quote.total_price}</p>
          <p>Labor Cost: ${quote.labor_cost}</p>
          <p>Subcontractor Cost: ${quote.subcontractor_cost}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h2>Shifts</h2>
        {shifts.length > 0 ? (
          <div className="grid gap-2">
            {shifts.map((shift) => (
              <div key={shift.id} className="p-2 border rounded">
                <p>Day: {shift.day}</p>
                <p>Time: {shift.start_time} - {shift.end_time}</p>
                <p>Cleaners: {shift.number_of_cleaners}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No shifts found</p>
        )}
        
        <QuoteShiftForm quoteId={quoteId} />
      </div>
      
      <div className="mt-6">
        <h2>Subcontractors</h2>
        {subcontractors && subcontractors.length > 0 ? (
          <div className="grid gap-2">
            {subcontractors.map((subcontractor) => (
              <div key={subcontractor.id} className="p-2 border rounded">
                <p>Name: {subcontractor.name}</p>
                <p>Cost: ${subcontractor.cost}</p>
                <p>Frequency: {subcontractor.frequency}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No subcontractors found</p>
        )}
        
        <QuoteSubcontractorForm quoteId={quoteId} />
      </div>
      
      {awardData && (
        <div className="mt-6">
          <h2>Award Engine Details</h2>
          <pre>{JSON.stringify(awardData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
