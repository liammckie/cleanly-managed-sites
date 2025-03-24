
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Receipt, 
  UserCheck, 
  Package, 
  FileX, 
  UserCog,
  ClipboardList,
  PauseCircle,
  PlayCircle,
  Mail,
  UserSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VariationType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface ContractVariationSelectorProps {
  siteId: string;
}

export function ContractVariationSelector({ siteId }: ContractVariationSelectorProps) {
  const navigate = useNavigate();
  
  const variationTypes: VariationType[] = [
    {
      id: 'billing',
      title: 'Contract Billing Variation',
      description: 'Update billing rates, payment terms or contractor payments',
      icon: <Receipt className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/billing`
    },
    {
      id: 'contractor',
      title: 'Change of Contractor',
      description: 'Assign a new contractor to this site or update contractor details',
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/contractor`
    },
    {
      id: 'consumables',
      title: 'Consumable Order',
      description: 'Update consumables or place a new order',
      icon: <Package className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/consumables`
    },
    {
      id: 'cancellation',
      title: 'Cancellation of Contract',
      description: 'Cancel or terminate the existing contract',
      icon: <FileX className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/cancellation`
    },
    {
      id: 'client-profile',
      title: 'Client Profile Update',
      description: 'Update client contact information or details',
      icon: <UserCog className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/client-profile`
    },
    {
      id: 'scope',
      title: 'Scope of Work Update',
      description: 'Modify the scope of work or job specifications',
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/scope`
    },
    {
      id: 'hold',
      title: 'Account on Hold',
      description: 'Temporarily pause the contract',
      icon: <PauseCircle className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/hold`
    },
    {
      id: 'restart',
      title: 'Contract Restart',
      description: 'Restart a paused contract',
      icon: <PlayCircle className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/restart`
    },
    {
      id: 'billing-contact',
      title: 'Update Billing Contact',
      description: 'Change the billing contact information',
      icon: <Mail className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/billing-contact`
    },
    {
      id: 'direct-employment',
      title: 'Direct Employment',
      description: 'Change from contractor to direct employee',
      icon: <UserSquare className="h-8 w-8 text-primary" />,
      path: `/sites/${siteId}/variations/direct-employment`
    }
  ];
  
  const handleSelect = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Contract Variation</h1>
        <p className="text-gray-500">Select the type of variation you'd like to make to the contract</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variationTypes.map((type) => (
          <Card key={type.id} className="hover:border-primary cursor-pointer transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-primary/10">{type.icon}</div>
              </div>
              <CardTitle className="text-lg mt-2">{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSelect(type.path)}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
