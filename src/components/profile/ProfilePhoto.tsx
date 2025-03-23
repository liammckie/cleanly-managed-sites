
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProfilePhotoProps {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  onUpload: () => void;
}

export function ProfilePhoto({ avatarUrl, firstName, lastName, onUpload }: ProfilePhotoProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full shadow-lg"
            onClick={onUpload}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Click the camera icon to upload a new profile photo
        </p>
      </CardContent>
    </Card>
  );
}
