
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/ui/layout/Sidebar';
import { Navbar } from '@/components/ui/layout/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { QuotingDashboard } from '@/components/quoting/QuotingDashboard';
import { Plus, Filter } from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';

export default function QuotingTool() {
  const navigate = useNavigate();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          
          <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Quoting & Labor Planning</h1>
                <p className="text-muted-foreground">
                  Create accurate quotes and plan labor based on the Cleaning Services Award [MA000022]
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={() => navigate('/quoting/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </div>
            
            <QuotingDashboard />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
