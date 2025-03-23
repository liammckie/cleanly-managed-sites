
import React from 'react';
import { User, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function ProfileHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="h-6 w-6" />
        My Profile
      </h1>
      <Button variant="outline" asChild size="sm">
        <Link to="/settings">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Settings
        </Link>
      </Button>
    </div>
  );
}
