
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { PageLayout } from '@/components/ui/layout/PageLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const { user } = useAuth();
  const { 
    profile, 
    formData, 
    loading, 
    handleInputChange, 
    handleSubmit, 
    handleAvatarUpload 
  } = useProfileData();

  if (!user) {
    return (
      <PageLayout>
        <div className="container py-8">
          <p>Please log in to view your profile</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader />
          
          <ProfileTabs 
            profile={profile}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleAvatarUpload={handleAvatarUpload}
            loading={loading}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
