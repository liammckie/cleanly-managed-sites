
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ContractTerm } from '@/components/sites/contract/types';

interface ContractTermsSectionProps {
  contractTerms: ContractTerm[];
  onChange: (newTerms: ContractTerm[]) => void;
}

export const ContractTermsSection: React.FC<ContractTermsSectionProps> = ({ 
  contractTerms,
  onChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<ContractTerm | null>(null);
  const [newTerm, setNewTerm] = useState<ContractTerm>({
    name: '',
    startDate: '',
    endDate: '',
    renewalTerms: '',
    terminationPeriod: '',
    autoRenew: false
  });
  
  const handleOpenDialog = (term?: ContractTerm) => {
    if (term) {
      setEditingTerm(term);
      setNewTerm({...term});
    } else {
      setEditingTerm(null);
      setNewTerm({
        name: '',
        startDate: '',
        endDate: '',
        renewalTerms: '',
        terminationPeriod: '',
        autoRenew: false
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveTerm = () => {
    if (editingTerm) {
      // Update existing term
      const updatedTerms = contractTerms.map(term => 
        term.id === editingTerm.id ? { ...newTerm, id: term.id } : term
      );
      onChange(updatedTerms);
    } else {
      // Add new term
      const termWithId = { ...newTerm, id: uuidv4() };
      onChange([...contractTerms, termWithId]);
    }
    setIsDialogOpen(false);
  };
  
  const handleDeleteTerm = (id: string) => {
    onChange(contractTerms.filter(term => term.id !== id));
  };
  
  const handleChangeField = (field: keyof ContractTerm, value: any) => {
    setNewTerm(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contract Terms</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleOpenDialog()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contract Term
        </Button>
      </div>
      
      {contractTerms.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No contract terms have been added.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add terms that define the contractual relationship, such as renewal conditions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractTerms.map((term) => (
            <Card key={term.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{term.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{term.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{term.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renewal Terms:</span>
                    <span>{term.renewalTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Termination Period:</span>
                    <span>{term.terminationPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto-Renew:</span>
                    <span>{term.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenDialog(term)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTerm(term.id!)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? `Edit Contract Term: ${editingTerm.name}` : 'Add Contract Term'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Term Name</Label>
              <Input 
                id="name"
                value={newTerm.name}
                onChange={(e) => handleChangeField('name', e.target.value)}
                placeholder="e.g. Initial Contract Term"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={newTerm.startDate}
                  onChange={(e) => handleChangeField('startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate"
                  type="date"
                  value={newTerm.endDate}
                  onChange={(e) => handleChangeField('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renewalTerms">Renewal Terms</Label>
              <Textarea 
                id="renewalTerms"
                value={newTerm.renewalTerms}
                onChange={(e) => handleChangeField('renewalTerms', e.target.value)}
                placeholder="e.g. Contract renews for additional 12 months unless terminated"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terminationPeriod">Termination Period</Label>
              <Input 
                id="terminationPeriod"
                value={newTerm.terminationPeriod}
                onChange={(e) => handleChangeField('terminationPeriod', e.target.value)}
                placeholder="e.g. 30 days written notice"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="autoRenew" 
                checked={newTerm.autoRenew}
                onCheckedChange={(checked) => handleChangeField('autoRenew', checked)}
              />
              <Label htmlFor="autoRenew">Auto-Renew</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTerm}>
              {editingTerm ? 'Update' : 'Add'} Term
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
