import React from 'react';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { NewWorkOrderDialog } from '@/components/workorders/NewWorkOrderDialog';
import { useSites } from '@/hooks/useSites';
import { useNavigate } from 'react-router-dom';

const CreateWorkOrder = () => {
  const { data: sites, isLoading: sitesLoading } = useSites();
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/workorders');
  };
  
  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Work Order</h1>
        
        <NewWorkOrderDialog sites={sites || []} onSuccess={handleSuccess} />
      </div>
    </PageLayout>
  );
};

export default CreateWorkOrder;
