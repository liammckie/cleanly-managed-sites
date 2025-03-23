
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from './ProfileForm';
import { ProfilePhoto } from './ProfilePhoto';
import { SecuritySettings } from './SecuritySettings';
import { PreferencesRedirect } from './PreferencesRedirect';

interface ProfileTabsProps {
  profile: any;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    title: string;
    avatar_url: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleAvatarUpload: () => void;
  loading: boolean;
}

export function ProfileTabs({
  profile,
  formData,
  handleInputChange,
  handleSubmit,
  handleAvatarUpload,
  loading
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="mb-6">
        <TabsTrigger value="personal">Personal Information</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfilePhoto 
            avatarUrl={profile?.avatar_url} 
            firstName={formData.first_name}
            lastName={formData.last_name}
            onUpload={handleAvatarUpload}
          />
          
          <ProfileForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="preferences">
        <PreferencesRedirect />
      </TabsContent>
      
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
    </Tabs>
  );
}
