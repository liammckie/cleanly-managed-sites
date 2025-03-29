
import { UserProfile, UserRole } from '@/types/db';
import { UserProfileWithRole } from '@/lib/types/users';

/**
 * Converts database user profile to application user profile with role information
 */
export function adaptUserProfile(userProfile: any, userRole?: UserRole): UserProfileWithRole {
  return {
    id: userProfile.id,
    email: userProfile.email,
    full_name: userProfile.full_name || `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim(),
    first_name: userProfile.first_name,
    last_name: userProfile.last_name,
    avatar_url: userProfile.avatar_url,
    title: userProfile.title,
    phone: userProfile.phone,
    custom_id: userProfile.custom_id,
    notes: userProfile.notes,
    territories: userProfile.territories,
    status: userProfile.status,
    role_id: userProfile.role_id,
    role: userRole,
    created_at: userProfile.created_at,
    updated_at: userProfile.updated_at,
    last_login: userProfile.last_login,
    daily_summary: userProfile.daily_summary
  };
}

/**
 * Prepares user profile data for database insertion/update
 */
export function prepareUserForDb(user: Partial<UserProfileWithRole>): any {
  // Clone the user object without the role property
  const { role, ...userData } = user;
  
  // Return the cleaned data
  return userData;
}
