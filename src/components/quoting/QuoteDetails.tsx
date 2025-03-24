
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FilePlus, FileEdit, Trash2 } from 'lucide-react';

interface QuoteDetailsProps {
  quoteId: string | null;
  onQuoteSelect: (id: string | null) => void;
}

interface QuoteItem {
  id: string;
  name: string;
  client: string;
  createdAt: string;
}

export function QuoteDetails({ quoteId, onQuoteSelect }: QuoteDetailsProps) {
  const [quotes, setQuotes] = useState<QuoteItem[]>([
    {
      id: '1',
      name: 'Office Complex Weekly Cleaning',
      client: 'ABC Corporation',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Retail Store Daily Cleaning',
      client: 'XYZ Retail',
      createdAt: new Date().toISOString()
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    description: '',
    startDate: '',
    endDate: '',
    quoteValidity: '30'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createNewQuote = () => {
    // Reset form
    setFormData({
      name: '',
      client: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      description: '',
      startDate: '',
      endDate: '',
      quoteValidity: '30'
    });
    
    onQuoteSelect(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {quoteId ? 'Edit Quote' : 'Create New Quote'}
        </h3>
        <Button onClick={createNewQuote} variant="outline" size="sm">
          <FilePlus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>

      {quotes.length > 0 && !quoteId && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quotes.map(quote => (
                <div 
                  key={quote.id} 
                  className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/30 cursor-pointer"
                  onClick={() => onQuoteSelect(quote.id)}
                >
                  <div>
                    <div className="font-medium">{quote.name}</div>
                    <div className="text-sm text-muted-foreground">{quote.client}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quote Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Quote Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g., Office Weekly Cleaning"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input 
                id="client" 
                name="client" 
                value={formData.client} 
                onChange={handleChange}
                placeholder="Client Name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Describe the cleaning services to be provided"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input 
                id="contactName" 
                name="contactName" 
                value={formData.contactName} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                name="contactEmail" 
                type="email" 
                value={formData.contactEmail} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input 
                id="contactPhone" 
                name="contactPhone" 
                value={formData.contactPhone} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Service Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              name="startDate" 
              type="date" 
              value={formData.startDate} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              name="endDate" 
              type="date" 
              value={formData.endDate} 
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quoteValidity">Quote Validity (days)</Label>
            <Select 
              value={formData.quoteValidity} 
              onValueChange={(value) => handleSelectChange('quoteValidity', value)}
            >
              <SelectTrigger id="quoteValidity">
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Quote Details</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
