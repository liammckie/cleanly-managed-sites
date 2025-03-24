
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Building2, Phone, FileText, Contract } from 'lucide-react';

export function DashboardActions() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <Button 
        variant="outline" 
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/clients/create')}
      >
        <Users className="mr-2 h-4 w-4" />
        Create Client
      </Button>
      
      <Button 
        variant="outline"
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/sites/create')}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Create Site
      </Button>
      
      <Button 
        variant="outline"
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/contacts/create')}
      >
        <Phone className="mr-2 h-4 w-4" />
        Create Contact
      </Button>
      
      <Button 
        variant="outline"
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/workorders/create')}
      >
        <FileText className="mr-2 h-4 w-4" />
        Create Work Order
      </Button>
      
      <Button 
        variant="outline"
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/contracts/create')}
      >
        <Contract className="mr-2 h-4 w-4" />
        Create Contract
      </Button>
      
      <Button 
        variant="outline"
        className="bg-slate-50 hover:bg-slate-100 border-slate-200"
        onClick={() => navigate('/quickactions')}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Quick Actions
      </Button>
    </div>
  );
}
