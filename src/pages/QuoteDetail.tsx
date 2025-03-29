
import React from 'react';
import { useParams } from 'react-router-dom';

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quote Details</h1>
      <p className="text-gray-600">Details for quote ID: {id}</p>
    </div>
  );
}

export default QuoteDetail;
